import { 
  Play, Plus, MoreVertical
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const MusicItem = ({ song }) => {
  const rowRef = useRef(null);
  const playBtnRef = useRef(null);

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
      className="music-item flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border-b border-slate-900/50"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0">
          <img src={song?.cover || "" || "/default-cover"} alt={song?.title || "" || "default-cover"}  className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm md:text-base tracking-tight">{song?.Title || "" || "default-cover"}</h4>
          <p className="text-slate-400 text-xs md:text-sm">{song?.Artist || "" || "default-cover"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 text-slate-400">
        <span className="hidden md:block text-xs font-mono">{song?.duration}</span>
        <div className="flex items-center gap-1">
          <button ref={playBtnRef} className="p-2.5 rounded-full hover:text-white transition-colors border border-transparent hover:border-indigo-500/30">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </button>
          <button className="p-2.5 rounded-full hover:text-white hover:bg-slate-800 transition-all">
            <Plus size={18} />
          </button>
          <button className="p-2.5 rounded-full hover:text-white hover:bg-slate-800 transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
