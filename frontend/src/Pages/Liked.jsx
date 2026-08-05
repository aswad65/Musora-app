import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import MusicItem from '../Components/MusicLibrayItem';
import useGetLikedMusic from '../Hooks/MusicHooks/GetLikeMusics.JSX';
// --- Sub-Components ---



const LikedPage = () => {
  const { data } = useGetLikedMusic();
  // console.log("DATA FULL:", data); 
  
  // const [search, setSearch] = useState("");
const songs = data?.result?.[0] || [];  // Access the first array inside result
                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

  const listRef = useRef(null);

  return (
      <main className="flex-1 flex flex-col relative overflow-hidden">
         <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8 pb-6 sm:pb-12 custom-scrollbar">
          <div ref={listRef} className="flex flex-col gap-0.5 sm:gap-1">
            {songs.length > 0 ? (
              songs.map((song) => (
                <MusicItem key={song.MusicId} song={song} />
              ))
            ) : (
              <div className="py-16 sm:py-20 text-center px-4">
                <p className="text-slate-500 italic text-sm sm:text-base">No liked tracks yet. Tap the heart icon on any song to save it here!</p>
              </div>
            )}
          </div>
        </div>
     
      </main>
  );
};

export default LikedPage;