import React, { useState ,useRef} from 'react';
import {
  Play, Pause, SkipForward, SkipBack,
  Volume2, VolumeX, Gauge, ListMusic,
  Maximize2, Repeat, Shuffle,
  ChevronLeft ,ChevronUp
} from 'lucide-react';
import { usePlayer } from '../Context/PlayerContext';

const GlobalPlayer = ({ setCut  }) => {
  const {
    currentTrack, isPlaying, progress, duration,
    volume, isMuted, playbackSpeed,
    togglePlay, playNext, playPrevious,
    setVolume, setIsMuted, setPlaybackSpeed, seek
  } = usePlayer();
  const aeroref = React.useRef(null);

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
const handleOpen = () => {
  setCut(true);

  if (aeroref.current) {
    aeroref.current.style.opacity = "0";
  }
};
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 sm:px-4 py-2 sm:py-3 md:px-6 md:py-3">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-[1fr_auto] md:grid-cols-3 items-center gap-2 sm:gap-4">

        {/* 1. Track Info */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-hidden min-w-0">
          <div className="relative group flex-shrink-0">
            <img
              src={currentTrack.bgPic}
              alt={currentTrack.Title}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl object-cover shadow-lg"
            />
            <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          </div>
          <div className="overflow-hidden min-w-0">
            <h4 className="text-white font-black text-xs sm:text-sm md:text-base truncate tracking-tight uppercase italic">
              {currentTrack.Title}
            </h4>
            <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm font-bold truncate uppercase tracking-widest">
              {currentTrack.Artist || "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* Mobile: Progress & Play in center column */}
        <div className="flex md:hidden items-center gap-3">
          <div className="hidden xs:flex flex-col items-center w-36">
            <div className="w-full flex items-center justify-between gap-2 mb-1">
              <span className="text-[9px] font-black text-slate-500 tabular-nums">
                {formatTime((progress / 100) * duration)}
              </span>
              <span className="text-[9px] font-black text-slate-500 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
            <div className="relative flex-1 h-1 w-full bg-slate-800 rounded-full group cursor-pointer">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={playPrevious}
              className="text-slate-300 hover:text-white transition-all active:scale-90 p-1"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-lg shadow-indigo-600/30"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
            </button>
            <button
              onClick={playNext}
              className="text-slate-300 hover:text-white transition-all active:scale-90 p-1"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* 2. Main Controls & Progress - Desktop */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Shuffle size={18} />
            </button>
            <button
              onClick={playPrevious}
              className="text-slate-300 hover:text-white transition-all active:scale-90"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-110 transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
            </button>
            <button
              onClick={playNext}
              className="text-slate-300 hover:text-white transition-all active:scale-90"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
            <button className="text-slate-500 hover:text-white transition-colors">
              <Repeat size={18} />
            </button>
          </div>

          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 w-8 text-right tabular-nums">
              {formatTime((progress / 100) * duration)}
            </span>
            <div className="relative flex-1 h-1 bg-slate-800 rounded-full group cursor-pointer">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-500 w-8 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* 3. Volume & Speed Controls */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3 lg:gap-5 min-w-0">

          {/* Speed Control */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all flex items-center gap-1 ${showSpeedMenu ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Gauge size={16} />
              <span className="text-[9px] sm:text-[10px] font-black hidden sm:inline">{playbackSpeed}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-4 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl min-w-[80px]">
                {speeds.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setPlaybackSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-xs font-bold text-left hover:bg-indigo-600 hover:text-white transition-colors ${playbackSpeed === s ? 'text-indigo-400' : 'text-slate-300'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-2 group">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="relative w-20 lg:w-24 h-1 bg-slate-800 rounded-full cursor-pointer">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute top-0 left-0 h-full bg-slate-300 group-hover:bg-indigo-500 rounded-full transition-colors"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>

          <button className="hidden md:block text-slate-400 hover:text-white transition-colors p-1.5">
            <ListMusic size={18} />
          </button>

          {/* Close Player Button */}
          <button
            onClick={() => { setCut(false) }}
            className="text-slate-400 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-slate-800"
            title="Close player"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        

        </div>
      </div>
    </div>
  );
};

export default GlobalPlayer;
