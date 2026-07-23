 import { Search, Filter, ChevronDown } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
 import React, { useState } from 'react'
 
 const Libraryheader = ({ search, setSearch }) => {
   const location = useLocation(); 
  const [active, setActive] = useState(location.pathname); 

  const handleClick = (path) => {
    setActive(path);
  };

   return (
    <div className="px-8 pt-8 pb-4 bg-slate-950/90 backdrop-blur-xl z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="lib-header text-3xl font-black text-white tracking-tight">Your Library </h2>
            
            <div className="lib-header flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search in library..."
                  className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-sm font-medium transition-colors">
                <Filter size={16} /> Sort by <ChevronDown size={14} />
              </button>
            </div>
          </div>

         <div className="lib-header flex items-center gap-4 border-b border-slate-900 pb-2">
      <button
        className={`text-sm font-bold pb-2 ${
          active === "/library/liked"
            ? "text-indigo-400 border-b-2 border-indigo-500"
            : "text-slate-500 hover:text-slate-300 transition-colors"
        }`}
        onClick={() => handleClick("/library/liked")}
      >
        <Link to="/library/liked">Liked Music</Link>
      </button>

     
      <button
        className={`text-sm font-bold pb-2 ${
          active === "/library/playlist"
            ? "text-indigo-400 border-b-2 border-indigo-500"
            : "text-slate-500 hover:text-slate-300 transition-colors"
        }`}
        onClick={() => handleClick("/library/playlist")}
      >
        <Link to="/library/playlist">Playlists</Link>
      </button>
    </div>
        </div>
   )
 }
 export default Libraryheader