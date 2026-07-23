import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X, Heart, MessageSquare, UserPlus, Music, BellRing, Circle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import useGetNotification from '../Hooks/MusicHooks/getNotification'

export const POPUP = ({ setShowPopUp }) => {
  // 1. Data Fetching
  const { data: notifications, isLoading } = useGetNotification();
  const [hiddenIds, setHiddenIds] = useState([]);
  
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const rawNotify = notifications?.[0] || []
  const notify = rawNotify.filter(n => !hiddenIds.includes(n.Id || n.id));

  // 2. Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(drawerRef.current, { x: "100%", duration: 0.5, ease: "power3.out" });
      gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  // 3. Exit Animation Handler
  const handleClose = () => {
    gsap.to(drawerRef.current, { 
      x: "100%", 
      duration: 0.4, 
      ease: "power3.in", 
      onComplete: () => setShowPopUp(false) 
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  // 4. Pretend Cutting Functionality
  const handleDeleteNotification = (id) => {
    console.log("Pretend cutting functionality for notification:", id);
    // Locally hide the notification for now
    setHiddenIds(prev => [...prev, id]);
    // User will implement the actual bacon/button logic (API call) themselves
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={12} className="text-pink-500" fill="currentColor" />;
      case 'comment': return <MessageSquare size={12} className="text-indigo-400" fill="currentColor" />;
      case 'follow': return <UserPlus size={12} className="text-emerald-400" />;
      default: return <Music size={12} className="text-slate-400" />;
    }
  };

  const getNotificationText = (notif) => {
    switch (notif.Type) {
      case 'like': return `liked your track`;
      case 'comment': return `left a thought on`;
      case 'follow': return `joined your circle`;
      default: return `interacted with you`;
    }
  };


  return (
    <div className="fixed inset-0 h-screen flex justify-end overflow-hidden">
      {/* BACKGROUND OVERLAY */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleClose} 
      />

      {/* NOTIFICATION DRAWER */}
      <div 
        ref={drawerRef}
        className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-900 shadow-2xl flex flex-col"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-900 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
               <BellRing size={20} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Updates</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-900 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Syncing Feed</p>
            </div>
          ) : notify && notify.length > 0 ? (
            <div className="divide-y divide-slate-900/50">
              {notify?.map((notif, i) => (
                <div
                  key={notif.Id || i}
                  className={`p-5 flex gap-4 hover:bg-indigo-500/[0.02] transition-all cursor-pointer group relative ${
                    !notif.IsRead ? "bg-indigo-500/[0.03]" : ""
                  }`}
                >
                  {/* Unread Dot */}
                  {!notif.IsRead && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                      <Circle size={6} className="fill-indigo-500 text-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    </div>
                  )}

                  {/* User Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={notif.ProfilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.Username}`|| notif}
                      alt={notif.Username}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-800 group-hover:border-indigo-500/50 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shadow-xl group-hover:scale-110 transition-transform">
                      {getNotificationIcon(notif.Type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm text-slate-400 leading-snug">
                      <span className="font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                        {notif.Username}
                      </span>{" "}
                      {getNotificationText(notif)}
                      {notif.MusicTitle && (
                        <span className="block text-indigo-400 font-bold mt-0.5 truncate italic">
                          "{notif.MusicTitle}"
                        </span>
                      )}
                    </p>

                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">
                      {notif.CreatedAt
                        ? formatDistanceToNow(new Date(notif.CreatedAt), { addSuffix: true })
                        : "Just now"}
                    </p>
                  </div>

                  {/* Track Thumbnail Preview */}
                  {(notif.Type === "like" || notif.Type === "comment") && notif.MusicCover && (
                    <div className="shrink-0 flex items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 group-hover:scale-105 transition-transform shadow-lg">
                        <img
                          src={notif.MusicCover}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* CROSS SIGN (CLOSE BUTTON) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notif.Id || i);
                    }}
                    className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-all active:scale-90 z-10"
                    title="Remove notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-12 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-900/50 rounded-[2rem] flex items-center justify-center text-slate-700 border border-slate-900">
                <Music size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">Quiet Studio</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">
                   Your notifications will <br/> synchronize here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}














































