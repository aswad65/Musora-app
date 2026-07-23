import { Heart, Play, Pause } from 'lucide-react';
import {  useRef } from 'react';
import { useState } from 'react';
import useLikeMusic from '../Hooks/MusicHooks/LiketheNusic';
import toast from 'react-hot-toast';
import { Link } from '@tanstack/react-router';
import useGetlikemusicbyId  from '../Hooks/MusicHooks/GetlikemusicbyId';
import { usePlayer } from '../Context/PlayerContext';


 export const MusicCard = ({ Music, fullList = null }) => {
  const cardRef = useRef(null);
  const {mutate,data}=useLikeMusic()
  const {data:LikedMusic}=useGetlikemusicbyId(Music?.Id)
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const Liked = LikedMusic?.likedMusic?.[0]
  console.log();
  
  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;

  function handleLike() {
    mutate({MusicId:Music?.Id,ownerId:Music?.userID})
  }
  
  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playTrack(Music, fullList);
  };
  

  return (
    <div ref={cardRef} className="music-card group relative bg-slate-800/40 p-4 rounded-2xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all duration-300 cursor-pointer">
  <Link to={`/musicpage/?musicId=${Music?.Id}`}>
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-lg">
        <img src={Music?.bgPic} alt={Music?.Title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div 
            onClick={handlePlay}
            className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-transform hover:scale-110 active:scale-95"
          >
            {getTrackId(currentTrack) === getTrackId(Music) && getTrackId(Music) && isPlaying ? (
              <Pause fill="currentColor" size={24} />
            ) : (
              <Play fill="currentColor" size={24} />
            )}
          </div>
        </div>
      </div>
      <h4 className="font-bold text-slate-100 truncate">{Music?.Title}</h4>
      <p className="text-sm text-slate-400 truncate">{Music?.Artist}</p>
</Link>
      <div onClick={handleLike} className="like absolute bottom-2 right-2 flex items-center justify-center text-white">
        <Heart fill={Liked?.IsLiked==1? "currentColor" : "none"} size={24} />
      </div>
    </div>
  );
};


export default MusicCard;
