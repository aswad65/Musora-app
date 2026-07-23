import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, playlist]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;

  const playTrack = (track, newPlaylist = null) => {
    const trackId = getTrackId(track);
    
    if (newPlaylist) {
      setPlaylist(newPlaylist);
      const index = newPlaylist.findIndex(t => getTrackId(t) === trackId);
      setCurrentIndex(index);
    } else if (playlist.length > 0) {
      const index = playlist.findIndex(t => getTrackId(t) === trackId);
      setCurrentIndex(index !== -1 ? index : currentIndex);
    }

    if (getTrackId(currentTrack) === trackId && trackId) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      audioRef.current.src = track.AudioFile || track.audioUrl;
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      setCurrentIndex(nextIndex);
      setCurrentTrack(nextTrack);
      audioRef.current.src = nextTrack.AudioFile || nextTrack.audioUrl;
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      setCurrentIndex(prevIndex);
      setCurrentTrack(prevTrack);
      audioRef.current.src = prevTrack.AudioFile || prevTrack.audioUrl;
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
      setIsPlaying(true);
    }
  };

  const seek = (val) => {
    const time = (val / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(val);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      playlist,
      volume,
      isMuted,
      playbackSpeed,
      progress,
      duration,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      setVolume,
      setIsMuted,
      setPlaybackSpeed,
      seek
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
