import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from '@tanstack/react-router';
export const ArtistCard = ({ name, imageUrl, Id }) => {
  const cardRef = useRef(null);

  return (
<Link to={`/Profile?userId=${Id}`} className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
    <div 
        ref={cardRef} 
        onMouseEnter={() => gsap.to(cardRef.current, { scale: 1.1, duration: 0.3 })}
        onMouseLeave={() => gsap.to(cardRef.current, { scale: 1, duration: 0.3 })}
        className="flex flex-col items-center gap-2 cursor-pointer shrink-0"
        >
      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-xl">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs md:text-sm font-semibold text-slate-300">{name}</span>
    </div>
</Link>
  );
};