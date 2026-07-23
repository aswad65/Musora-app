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
         <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar">
          <div ref={listRef} className="flex flex-col gap-1">
            {songs.length > 0 ? (
              songs.map((song) => (
                <MusicItem key={song.MusicId} song={song} />
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-slate-500 italic">No tracks found matching your search.</p>
              </div>
            )}
          </div>
        </div>
     
      </main>
  );
};

export default LikedPage;