import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import {
  Play, Pause, Shuffle, Heart, MoreHorizontal,
  Clock3, Hash, Calendar, Disc
} from 'lucide-react';
import MusicItem from '../Components/MusicLibrayItem';
import useGetalbumbyId from '../Hooks/MusicHooks/GetalbumbyId';
import { usePlayer } from '../Context/PlayerContext';

const AlbumPage = () => {
  const albumId = new URLSearchParams(window.location.search).get('albumId');
  const { data: album, isLoading } = useGetalbumbyId(albumId);

  const [isShuffled, setIsShuffled] = useState(false);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;

  const albumSongs = album?.result || [];
  const albumDetails = albumSongs[0] || {};
  console.log(albumDetails);
  
  const displaySongs = useMemo(() => {
    if (!isShuffled) return albumSongs;
    const shuffledSongs = [...albumSongs];
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledSongs[i], shuffledSongs[j]] = [
        shuffledSongs[j],
        shuffledSongs[i],
      ];
    }
    return shuffledSongs;
  }, [albumSongs, isShuffled]);

  const albumData = useMemo(() => ({
    title: albumDetails?.Title || "Loading...",
    artist: albumDetails?.Artist || "Unknown Artist",
    cover:
      albumDetails?.bgPic ||
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000",
    releaseDate: albumDetails?.ReleaseDate
      ? new Date(albumDetails.ReleaseDate).getFullYear()
      : "2024",

    totalSongs: albumSongs.length,

    duration: "Calculating...",

    songs: displaySongs.map((song) => ({
      ...song,
      id: song?.MusicId || song?.MusicID,
      title: song?.Title || "Unknown Title",
      artist: song?.Artist || "Unknown Artist",
      duration: song?.Duration || "3:30",
      plays: song?.Plays || "0",
      audioUrl: song?.AudioFile || "",
      cover: song?.bgPic || albumDetails?.CoverImage,
    })),
  }), [albumDetails, albumSongs, displaySongs]);

  const handlePlayAlbum = () => {
    if (albumData.songs.length > 0) {
      // If any song from this album is already playing, just toggle
      const isAlbumPlaying = albumData.songs.some(s => getTrackId(s) === getTrackId(currentTrack));
      if (isAlbumPlaying) {
        playTrack(currentTrack);
      } else {
        // Otherwise play first song and load album playlist
        playTrack(albumData.songs[0], albumData.songs);
      }
    }
  };

  const isCurrentAlbumPlaying = useMemo(() => {
    return isPlaying && albumData.songs.some(s => getTrackId(s) === getTrackId(currentTrack));
  }, [isPlaying, currentTrack, albumData.songs]);
  const pageRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      // Fade in header
      gsap.from(".album-hero", {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "power3.out"
      });
      // Staggered list entrance
      gsap.from(".track-row", {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out"
      });
    }, pageRef);
    return () => ctx.revert();
  }, [isLoading, isShuffled]); // Re-run animation when shuffling

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#020617] text-slate-200">

      {/* --- 1. HERO HEADER --- */}
      <div className="album-hero relative min-h-[280px] sm:min-h-[320px] md:h-[40vh] lg:h-[50vh] flex items-end p-3 sm:p-4 md:p-6 lg:p-12 overflow-hidden">
        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-indigo-900/30 z-0" />
        <img
          src={albumData.cover}
          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl sm:blur-2xl -z-10"
          alt="Background Blur"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 md:gap-8 w-full">
          {/* Album Cover Art */}
          <div className="shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group relative">
            <img
              src={albumData.cover}
              alt={albumData.title}
              className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-xl sm:rounded-2xl object-cover border border-white/10"
            />
            <div 
              onClick={handlePlayAlbum}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl sm:rounded-2xl cursor-pointer"
            >
              {isCurrentAlbumPlaying ? (
                <><Pause fill="white" size={32} className="sm:hidden text-white" /><Pause fill="white" size={48} className="hidden sm:block text-white" /></>
              ) : (
                <><Play fill="white" size={32} className="sm:hidden ml-1 text-white" /><Play fill="white" size={48} className="hidden sm:block text-white" /></>
              )}
            </div>
          </div>

          {/* Album Metadata */}
          <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-4 text-center md:text-left min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-indigo-400">
              Official Album
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic break-words">
              {albumData.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-sm font-bold">
              <span className="text-white hover:underline cursor-pointer truncate max-w-[200px] sm:max-w-none">{albumData.artist}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{albumData.releaseDate}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400">{albumData.totalSongs} Songs{albumData.duration ? `, ${albumData.duration}` : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. ACTION BAR --- */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-5 md:py-8 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <button 
            onClick={handlePlayAlbum}
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {isCurrentAlbumPlaying ? (
              <><Pause fill="white" size={20} className="sm:hidden text-white" /><Pause fill="white" size={24} className="hidden sm:block text-white" /></>
            ) : (
              <><Play fill="white" size={20} className="sm:hidden ml-0.5 text-white" /><Play fill="white" size={24} className="hidden sm:block text-white ml-1" /></>
            )}
          </button>
          <Shuffle
            onClick={() => setIsShuffled(!isShuffled)}
            size={20}
            className={`sm:hidden ${isShuffled ? 'text-indigo-400' : 'text-slate-500'} hover:text-indigo-400 cursor-pointer transition-colors`}
          />
          <Shuffle
            onClick={() => setIsShuffled(!isShuffled)}
            size={24}
            className={`hidden sm:block ${isShuffled ? 'text-indigo-400' : 'text-slate-500'} hover:text-indigo-400 cursor-pointer transition-colors`}
          />

        </div>
      </div>

      {/* --- 3. TRACKLIST --- */}
      <div className="px-2 sm:px-3 md:px-4 lg:px-12 pb-6 sm:pb-10 md:pb-20">
        {/* Table Header Labels */}
        <div className="hidden sm:grid grid-cols-[28px_1fr_80px] md:grid-cols-[40px_1fr_1fr_120px] gap-2 sm:gap-4 px-2 sm:px-4 py-2 border-b border-slate-800 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 sm:mb-4">
          <div className="flex justify-center"><Hash size={14} /></div>
          <div>Title</div>
          <div className="hidden md:block">Plays</div>
          <div className="flex justify-end"><Clock3 size={14} /></div>
        </div>

        {/* The Mapped Songs */}
        <div className="space-y-0.5 sm:space-y-1">
          {albumData.songs?.map((song, index) => (
            <div key={song.id} className="track-row group">

              <div className="grid grid-cols-[28px_1fr_auto] sm:grid-cols-[28px_1fr_80px] md:grid-cols-[40px_1fr_1fr_120px] gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/5 transition-all items-center">

                {/* Index / Play Button */}
                <div 
                  onClick={() => playTrack(song, albumData.songs)}
                  className="flex justify-center text-xs sm:text-sm font-bold text-slate-500 group-hover:text-white cursor-pointer"
                >
                  <span className={`${getTrackId(currentTrack) === getTrackId(song) ? 'hidden' : 'group-hover:hidden'}`}>
                    {index + 1}
                  </span>

                  {getTrackId(currentTrack) === getTrackId(song) && isPlaying ? (
                    <Pause size={12} fill="currentColor" />
                  ) : (
                    <Play
                      size={12}
                      className={`${getTrackId(currentTrack) === getTrackId(song) ? 'block' : 'hidden group-hover:block'}`}
                      fill="currentColor"
                    />
                  )}
                </div>

                {/* Music Item */}
                <div className="min-w-0">
                  <MusicItem song={song} fullList={albumData.songs} />
                </div>

                {/* Plays */}
                <div className="hidden md:block text-[10px] sm:text-xs font-bold text-slate-500">
                  {song.plays}
                </div>

                {/* Duration */}
                <div className="flex justify-end text-[10px] sm:text-xs font-bold text-slate-500 tabular-nums">
                  {song.duration}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 4. FOOTER INFO --- */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-12 py-6 sm:py-8 md:py-10 border-t border-slate-800/50 opacity-40">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
          <Calendar size={12} className="sm:hidden" />
          <Calendar size={14} className="hidden sm:block" />
          Released December 14, {albumData.releaseDate}
        </div>
        <p className="text-[9px] sm:text-[10px] mt-1 sm:mt-2 uppercase tracking-tight">© 2024 SonicUI Records Inc.</p>
      </div>

    </div>
  );
};

export default AlbumPage;
