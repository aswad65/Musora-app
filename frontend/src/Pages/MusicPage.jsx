import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Heart, PlusCircle, Share2, MessageCircle, 
  Play, SkipBack, SkipForward, Repeat, Shuffle,
  Volume2, Disc, ChevronLeft, MoreVertical, X, Music, ListMusic,Pause
} from 'lucide-react';
import { CommentSection } from '../Components/CommentSection';// Importing the previous design
import useGetMusicBymusicId from '../Hooks/MusicHooks/GetMusicBymusicId';
import useLikeMusic from '../Hooks/MusicHooks/LiketheNusic';
import useGetCommentBymusicId from '../Hooks/MusicHooks/GetCommentBymusicId';
import useAddMusicToPlaylist from '../Hooks/MusicHooks/useAddMusicToPlaylist';
import useGetplaylistTitles from '../Hooks/MusicHooks/GetPlaylistTitle';
import toast from 'react-hot-toast';
import { usePlayer } from '../Context/PlayerContext';
import useGetLikeMusicById from '../Hooks/MusicHooks/GetlikemusicbyId';

const MusicPlayerPage = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const musicId = new URLSearchParams(window.location.search).get('musicId');
  const discRef = useRef(null);
  const {data:music}=useGetMusicBymusicId(musicId);
  const {data:commentData}=useGetCommentBymusicId(musicId);
  const {mutate:addMusicToPlaylist}=useAddMusicToPlaylist();
  const {data:playlistData}=useGetplaylistTitles();
  const playlistTitles = playlistData?.result || [];
  const {data:LikedMusic}=useGetLikeMusicById(musicId);
 const Liked = LikedMusic?.likedMusic?.[0]
  
  const {mutate:likeMusic}=useLikeMusic();
  const { playTrack, currentTrack, isPlaying, progress, duration, seek, playNext, playPrevious } = usePlayer();
  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;
  
  const songs = music?.music?.[0] || [];

  

  useEffect(() => {
    // 1. Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from(".player-left", { x: -100, opacity: 0, duration: 1, ease: "power4.out" });
      gsap.from(".player-right", { x: 100, opacity: 0, duration: 1, ease: "power4.out" });
      
      // 2. Infinite Disc Rotation
      gsap.to(discRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none"
      });
    });
    return () => ctx.revert();
  }, []);

  const handleAddToPlaylist = () => {
    setShowPlaylistModal(true);
    gsap.fromTo(".playlist-btn", { scale: 0.8 }, { scale: 1, duration: 0.3 });
  };

  const handleConfirmAddToPlaylist = (playlistId) => {
    if (!musicId) {
      toast.error("Music ID is missing");
      return;
    }
    addMusicToPlaylist({ musicIds: [musicId], playlistId }, {
      onSuccess: () => {
        setIsAdded(true);
        setShowPlaylistModal(false);
      }
    });
  };

  const handleLike=()=>{
    console.log(songs?.userID);
    
    likeMusic({MusicId:musicId,ownerId:songs?.userID});
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24 sm:pb-20">
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="p-3 sm:p-4 md:p-6 flex items-center justify-between gap-2">
        <button className="flex items-center gap-1 sm:gap-2 text-slate-400 hover:text-white transition-colors group min-w-0">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
          <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Back to Discovery</span>
        </button>
        <div className="text-center min-w-0 flex-1 px-2">
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Now Playing</p>
          <p className="text-xs sm:text-sm font-bold text-indigo-400 truncate">{songs?.Title || 'Unknown Track'}</p>
        </div>
        <button className="p-1.5 sm:p-2 bg-slate-900 rounded-full border border-slate-800 flex-shrink-0">
          <MoreVertical size={16} className="sm:hidden" />
          <MoreVertical size={20} className="hidden sm:block" />
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mt-2 sm:mt-4 md:mt-8">
        
        {/* --- LEFT SIDE: THE VISUALIZER --- */}
        <div className="player-left flex flex-col items-center justify-center space-y-6 sm:space-y-8 md:space-y-12">
          <div className="relative group">
            {/* Outer Glow */}
            <div className="absolute -inset-2 sm:-inset-4 bg-indigo-500/20 rounded-full blur-2xl sm:blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
            
            {/* The Rotating Disc */}
            <div ref={discRef} className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-[8px] sm:border-[10px] md:border-[12px] border-slate-900 shadow-2xl overflow-hidden shadow-indigo-500/10">
              <img 
                src={songs?.bgPic || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1000" }
                className="w-full h-full object-cover"
                alt="Album Cover" 
              />
              {/* Vinyl Hole */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#020617] rounded-full border-2 sm:border-3 md:border-4 border-slate-900 flex items-center justify-center">
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-slate-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls (Simplified for UI) */}
          <div className="w-full max-w-md space-y-4 sm:space-y-6 px-2 sm:px-0">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
               <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 w-8 sm:w-10 tabular-nums text-right">{formatTime((progress / 100) * duration)}</span>
               <div className="flex-1 h-1 sm:h-1.5 bg-slate-800 rounded-full overflow-hidden relative group cursor-pointer">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="h-full bg-indigo-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full shadow-lg sm:scale-0 sm:group-hover:scale-100 transition-transform"></div>
                  </div>
               </div>
               <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 w-8 sm:w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
              <Shuffle className="text-slate-600 hover:text-indigo-400 cursor-pointer hidden sm:block" size={18} />
              <SkipBack 
                onClick={playPrevious}
                className="text-white hover:text-indigo-400 cursor-pointer" 
                fill="currentColor" 
                size={20}
              />
              <button 
                onClick={() => playTrack(songs)}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-xl shadow-white/5"
              >
                {getTrackId(currentTrack) === getTrackId(songs) && getTrackId(songs) && isPlaying ? (
                  <Pause size={20} className="sm:hidden" fill="currentColor" />
                ) : (
                  <Play size={20} className="sm:hidden ml-0.5" fill="currentColor" />
                )}
                {getTrackId(currentTrack) === getTrackId(songs) && getTrackId(songs) && isPlaying ? (
                  <Pause size={24} className="hidden sm:block md:hidden" fill="currentColor" />
                ) : (
                  <Play size={24} className="hidden sm:block md:hidden ml-0.5" fill="currentColor" />
                )}
                {getTrackId(currentTrack) === getTrackId(songs) && getTrackId(songs) && isPlaying ? (
                  <Pause size={28} className="hidden md:block" fill="currentColor" />
                ) : (
                  <Play size={28} className="hidden md:block ml-1" fill="currentColor" />
                )}
              </button>
              <SkipForward 
                onClick={playNext}
                className="text-white hover:text-indigo-400 cursor-pointer" 
                fill="currentColor" 
                size={20}
              />
              <Repeat className="text-slate-600 hover:text-indigo-400 cursor-pointer hidden sm:block" size={18} />
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: CONTENT & COMMENTS --- */}
        <div className="player-right space-y-6 sm:space-y-8 md:space-y-10">
          
          {/* Header & Main Actions */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic break-words">{songs?.Title || 'Unknown Track'}</h1>
                <p className="text-base sm:text-lg md:text-xl font-bold text-indigo-400 mt-1 sm:mt-2">{songs?.Artist || 'M83'} <span className="text-slate-600 mx-1.5 sm:mx-2">•</span> <span className="hidden sm:inline">Hurry Up, We're Dreaming</span></p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* LIKE BUTTON */}
                <button 
                  onClick={handleLike}
                  className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border transition-all flex-shrink-0 ${Liked?.IsLiked==1 ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                >
                          <Heart fill={Liked?.IsLiked==1 ? "currentColor" : "none"} size={18} className="sm:hidden" />
                          <Heart fill={Liked?.IsLiked==1 ? "currentColor" : "none"} size={24} className="hidden sm:block" />

                </button>

                {/* ADD TO PLAYLIST BUTTON */}
                <button 
                  onClick={handleAddToPlaylist}
                  className={`playlist-btn flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all flex-shrink-0 ${isAdded ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
                >
                  {isAdded ? (
                    <><span className="sm:hidden">Saved</span><span className="hidden sm:inline">Added to Library</span></>
                  ) : (
                    <>
                      <PlusCircle size={14} className="sm:hidden" />
                      <PlusCircle size={18} className="hidden sm:block" />
                      <span className="sm:hidden">Playlist</span>
                      <span className="hidden sm:inline">Add to Playlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl">
              A dreamlike synth-pop anthem characterized by its driving beat and soaring vocal hooks. 
              Considered one of the most influential electronic tracks of the 2010s.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-y border-slate-800/50">
            <div className="text-center px-1">
              <p className="text-[8px] sm:text-[10px] text-slate-600 font-black uppercase tracking-widest">Plays</p>
              <p className="text-sm sm:text-lg font-black text-white">{songs?.Plays || '1.2M'}</p>
            </div>
            <div className="text-center border-x border-slate-800/50 px-1">
              <p className="text-[8px] sm:text-[10px] text-slate-600 font-black uppercase tracking-widest">Comments</p>
              <p className="text-sm sm:text-lg font-black text-white">{commentData?.comments?.[0]?.length || 0}</p>
            </div>
            <div className="text-center px-1">
              <p className="text-[8px] sm:text-[10px] text-slate-600 font-black uppercase tracking-widest">Likes</p>
              <p className="text-sm sm:text-lg font-black text-white">{songs?.Likes || 0}</p>
            </div>
          </div>

          {/* COMMENT SECTION INTEGRATION */}
          <div className="bg-slate-900/20 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-800/50 p-1 sm:p-2">
            <CommentSection musicId={musicId} ownerId={songs?.userID} />
          </div>

        </div>
      
      </div>
      {/* PLAYLIST MODAL */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPlaylistModal(false)}
          />
          
          <div className="relative bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-t-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl flex flex-col max-h-[80vh] sm:max-h-[70vh] overflow-hidden">
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg sm:rounded-xl transition-all"
            >
              <X size={18} className="sm:hidden" />
              <X size={20} className="hidden sm:block" />
            </button>

            <div className="mb-5 sm:mb-8 mt-2 sm:mt-0">
              <h3 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">
                Add to <span className="text-indigo-500">Playlist</span>
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Choose a collection for this track</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-2 sm:space-y-3 custom-scrollbar">
              {playlistTitles.length > 0 ? (
                playlistTitles.map((playlist) => (
                  <button 
                    key={playlist.Id} 
                    onClick={() => handleConfirmAddToPlaylist(playlist.Id)}
                    className="w-full flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group text-left"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all flex-shrink-0">
                      <ListMusic size={18} className="sm:hidden" />
                      <ListMusic size={22} className="hidden sm:block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-100 truncate group-hover:text-white text-sm sm:text-base">{playlist.Title}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Custom Playlist</p>
                    </div>
                    <PlusCircle size={16} className="sm:hidden text-slate-700 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                    <PlusCircle size={18} className="hidden sm:block text-slate-700 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center space-y-3 sm:space-y-4 px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 border border-slate-800">
                    <ListMusic size={24} className="sm:hidden" />
                    <ListMusic size={30} className="hidden sm:block" />
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium italic">No playlists found.<br/>Create one in your library first!</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowPlaylistModal(false)}
              className="mt-4 sm:mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase tracking-widest text-[10px] py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayerPage;