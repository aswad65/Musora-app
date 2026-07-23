import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { Play, Pause, Plus, MoreVertical } from 'lucide-react';
import { usePlayer } from '../Context/PlayerContext';

const MusicItem = ({ song, fullList = null }) => {
  const rowRef = useRef(null);
  const playBtnRef = useRef(null);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;

  const onMouseEnter = () => {
    gsap.to(rowRef.current, { backgroundColor: "rgba(30, 41, 59, 0.8)", x: 8, duration: 0.3 });
    gsap.to(playBtnRef.current, { scale: 1.2, backgroundColor: "#4f46e5", duration: 0.2 });
  };

  const onMouseLeave = () => {
    gsap.to(rowRef.current, { backgroundColor: "transparent", x: 0, duration: 0.3 });
    gsap.to(playBtnRef.current, { scale: 1, backgroundColor: "transparent", duration: 0.2 });
  };

  return (
    <div 
      ref={rowRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border-b border-slate-900/50"
    >
      <div className="flex items-center gap-4 flex-1">
        
        {/* Default Image (since DB doesn't provide cover) */}
        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0">
          <img 
            src={song.bgPic || `https://picsum.photos/seed/${getTrackId(song)}/100`} 
            alt={song.Title} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div>
          <h4 className="text-white font-bold text-sm md:text-base">
            {song.Title}
          </h4>

          {/* Optional fallback */}
          <p className="text-slate-400 text-xs md:text-sm">
            {song.Artist}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 text-slate-400">
        <div className="flex items-center gap-1">
          
          {/* Play Button */}
          <button 
            ref={playBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              playTrack(song, fullList);
            }}
            className="p-2.5 rounded-full hover:text-white transition-colors"
          >
            {getTrackId(currentTrack) === getTrackId(song) && getTrackId(song) && isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>

          <button className="p-2.5 rounded-full hover:text-white hover:bg-slate-800">
            <Plus size={18} />
          </button>

          <button className="p-2.5 rounded-full hover:text-white hover:bg-slate-800">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicItem;