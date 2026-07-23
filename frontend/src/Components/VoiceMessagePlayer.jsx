import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VoiceMessagePlayer = ({ audioUrl, isUser = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl ${
      isUser 
        ? 'bg-indigo-600 text-white rounded-tr-none' 
        : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none'
    }`}>
      <audio ref={audioRef} src={audioUrl} muted={isMuted} />
      
      <button
        onClick={togglePlay}
        className={`p-2 rounded-full ${
          isUser 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'bg-slate-800 hover:bg-slate-700'
        } transition-all`}
      >
        {isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" />
        )}
      </button>

      <div className="flex-1">
        <div 
          className="relative h-1.5 bg-white/20 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-2 rounded-full ${
          isUser 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'bg-slate-800 hover:bg-slate-700'
        } transition-all`}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};

export default VoiceMessagePlayer;
