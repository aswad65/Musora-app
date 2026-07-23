import { Heart, Play } from 'lucide-react';
import {  useRef } from 'react';
import { useState } from 'react';
import useLikeMusic from '../Hooks/MusicHooks/LiketheNusic';
import toast from 'react-hot-toast';
import { Link } from '@tanstack/react-router';
import useGetlikemusicbyId  from '../Hooks/MusicHooks/GetlikemusicbyId';


 export const AlbumCard = ({ Album }) => {
  const cardRef = useRef(null);
  return (
    <div ref={cardRef} className="music-card group relative bg-slate-800/40 p-4 rounded-2xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all duration-300 cursor-pointer">
  <Link to={`/album/?albumId=${Album?.Id}`}>
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-lg">
        <img src={Album?.CoverImage} alt={Album?.Title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play fill="currentColor" size={24} />
          </div>
        </div>
      </div>
      <h4 className="font-bold text-slate-100 truncate">{Album?.Title||"Album Title"}</h4>
      <p className="text-sm text-slate-400 truncate">{Album?.Artist||"Album"}</p>
</Link>
     
    </div>
  );
};


export default AlbumCard;
