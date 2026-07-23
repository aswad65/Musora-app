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
      <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar">
        <div ref={listRef} className="flex flex-col gap-1">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={getTrackId(song)}
                className="recent-item flex items-center justify-between p-3 rounded-xl bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/50 group cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
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
                    <p className="text-slate-400 text-xs md:text-sm">
                      {song.Artist || "Unknown Artist"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleddelete(song);
                    }}
                    className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash size={18} />
                  </button>

                  {/* Play Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(song, songs);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2.5 bg-indigo-600 rounded-full text-white transition-all active:scale-90"
                  >
                    {getTrackId(currentTrack) === getTrackId(song) && isPlaying ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500 italic">No tracks found in this playlist.</p>
            </div>
          )}
        </div>
      </div>
        
    </main>
  );
};


export default PlaylistMusicpage
