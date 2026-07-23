import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Loader2, Music as MusicIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import useGetAllMusic from '../Hooks/MusicHooks/GetMusic';

const SearchBar = ({focus,setfocus}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: allMusic, isLoading, isError, error } = useGetAllMusic();
  const searchContainerRef = useRef(null);
  
  
  // Filter and sort music in real-time
  const filteredMusic = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const lowerTerm = searchTerm.toLowerCase();
    
    return allMusic
      ?.filter((music) => 
        music.Title.toLowerCase().includes(lowerTerm)
      )
      .sort((a, b) => {
        // Matching songs (starts with search term) appear first
        const aStarts = a.Title.toLowerCase().startsWith(lowerTerm);
        const bStarts = b.Title.toLowerCase().startsWith(lowerTerm);
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 10); // Limit to 10 results for better UX
  }, [searchTerm, allMusic]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setfocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsDropdownOpen(false);
    setfocus(false);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-sm hidden sm:block">
      {/* Search Input Bar */}
      <div className="relative group">
        <Search 
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            isDropdownOpen ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-400'
          }`} 
          size={16} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search for music, artists..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isDropdownOpen && searchTerm.trim() ? (
        <div className="absolute top-full left-0 mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl ring-1 ring-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="text-indigo-500 animate-spin" size={24} />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Searching Beats...</p>
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <p className="text-sm text-rose-500 font-medium">Failed to fetch music</p>
                <p className="text-[10px] text-slate-500 mt-1">{error?.message}</p>
              </div>
            ) : filteredMusic?.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50 mb-1">
                  Top Results
                </div>
                {filteredMusic.map((music) => (
                  <Link
                    key={music.Id}
                    to={`/musicpage/?musicId=${music.Id}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-500/10 transition-colors group"
                  >
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                      <img
                        src={music.bgPic}
                        alt={music.Title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
                        {music.Title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {music.Artist || 'Unknown Artist'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-800">
                  <MusicIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase tracking-tighter italic">No matches found</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Try searching something else</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : focus && (
           <div className="absolute top-full left-0 mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl ring-1 ring-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="text-indigo-500 animate-spin" size={24} />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Searching Beats...</p>
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <p className="text-sm text-rose-500 font-medium">Failed to fetch music</p>
                <p className="text-[10px] text-slate-500 mt-1">{error?.message}</p>
              </div>
            ) : filteredMusic?.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50 mb-1">
                  Top Results
                </div>
                {filteredMusic.map((music) => (
                  <Link
                    key={music.Id}
                    to={`/musicpage/?musicId=${music.Id}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-500/10 transition-colors group"
                  >
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                      <img
                        src={music.bgPic}
                        alt={music.Title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
                        {music.Title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {music.Artist || 'Unknown Artist'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-800">
                  <MusicIcon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase tracking-tighter italic">No matches found</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Try searching something else</p>
                </div>
              </div>
            )}
          </div>
        </div> )
}
    </div>
  );
};

export default SearchBar;
