import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Play, Pause, Plus, MoreVertical, Trash } from 'lucide-react';
import MusicItem from '../Components/MusicLibrayItem';
import { useGetplaylist } from '../Hooks/MusicHooks/Getplaylist';
import { useDeleteMusicFromPlaylist } from '../Hooks/MusicHooks/DeletePlaylistHooks';
import { usePlayer } from '../Context/PlayerContext';
// --- Sub-Components ---



const PlaylistMusicpage = () => {

  const titleId = new URLSearchParams(window.location.search).get('titleId');
  const { mutate: deleteplaylist } = useDeleteMusicFromPlaylist()
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const { data } = useGetplaylist(titleId);

  const songs = data?.result?.[0] || [];  // Access the first array inside result
  const listRef = useRef(null);

  const handleddelete = (song) => {
    deleteplaylist({ playlistId: titleId, musicId: song?.MusicId || "" })
  }

  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID;

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8 pb-6 sm:pb-12 custom-scrollbar">
        <div ref={listRef} className="flex flex-col gap-1 sm:gap-2">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={getTrackId(song)}
                className="recent-item flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/50 group cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-md sm:rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <img
                      src={song.bgPic || `https://picsum.photos/seed/${getTrackId(song)}/100`}
                      alt={song.Title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">
                      {song.Title}
                    </h4>
                    <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm truncate">
                      {song.Artist || "Unknown Artist"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5 flex-shrink-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleddelete(song);
                    }}
                    className="p-1.5 sm:p-2 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash size={16} className="sm:hidden" />
                    <Trash size={18} className="hidden sm:block" />
                  </button>

                  {/* Play Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(song, songs);
                    }}
                    className="sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2.5 bg-indigo-600 rounded-full text-white transition-all active:scale-90 shadow-lg shadow-indigo-600/30 sm:shadow-none"
                  >
                    {getTrackId(currentTrack) === getTrackId(song) && isPlaying ? (
                      <Pause size={14} className="sm:hidden" fill="currentColor" />
                    ) : (
                      <Play size={14} className="sm:hidden ml-0.5" fill="currentColor" />
                    )}
                    {getTrackId(currentTrack) === getTrackId(song) && isPlaying ? (
                      <Pause size={18} className="hidden sm:block" fill="currentColor" />
                    ) : (
                      <Play size={18} className="hidden sm:block ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 sm:py-20 text-center px-4">
              <p className="text-slate-500 italic text-sm sm:text-base">No tracks found in this playlist. Add some music!</p>
            </div>
          )}
        </div>
      </div>
        
    </main>
  );
};


export default PlaylistMusicpage
