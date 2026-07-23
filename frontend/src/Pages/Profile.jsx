import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  Settings, Award,
     UserPlus, Check, MoreHorizontal,
     Clock, Music2,
  Users, Play, CheckCircle2, X, Image as ImageIcon, Trash2,Pause,
} from 'lucide-react';
import { useGetAllByuser } from '../Hooks/GetUserbyId';
import useFollowUser from '../Hooks/MusicHooks/Followandunfollow';
import useGetMusicById from '../Hooks/MusicHooks/GetMusicById';
import useGetFollower from '../Hooks/MusicHooks/GetFollower';
import { usePlayer } from '../Context/PlayerContext';

// --- Sub-Component: Stat Card ---
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 flex items-center gap-4 hover:bg-slate-800 transition-colors">
    <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const userId = new URLSearchParams(window.location.search).get('userId');
  const { data, isLoading } = useGetAllByuser(userId);
  const { mutate, data: followData } = useFollowUser();
  const { data: Followuser } = useGetFollower(userId)
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;




  const { data: music } = useGetMusicById(userId);

  const songs = music?.music || [];



  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".profile-header", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(".stat-card, .recent-item", {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out"
      });
    });
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (!Followuser?.result) return;

    const isUserFollowed = Followuser.result.find(
      (f) => Number(f.FollowingId) === Number(userId)
    );

    setIsFollowing(!!isUserFollowed);
  }, [Followuser, userId]);

  const handleFollowToggle = () => {

    mutate(userId);

    gsap.fromTo(".follow-btn", { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
  };
  const handleplay = () => {
    console.log("play button clicked");
  }
  

  return (
    <div className="min-h-full pb-20">

      {/* 1. PROFILE HEADER */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950">
        <div className="absolute -bottom-16 left-6 md:left-12 flex flex-col md:flex-row items-center md:items-end gap-6 profile-header w-[calc(100%-48px)]">

          {/* Avatar with status ring */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-slate-950 overflow-hidden shadow-2xl bg-slate-800 ring-1 ring-white/10">
              <img src={data?.ProfilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.Name || 'John'}` || data?.Name.slice(0, 2).toUpperCase()} alt="Avatar" className="w-full h-full object-cover" />
            </div>

          </div>

          {/* Content Wrapper: Flex-row to keep Name and Button aligned */}
          <div className="flex flex-col md:flex-row md:items-end justify-between w-full pb-4 gap-6">

            {/* Name and Stats */}
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                  {data?.Name || 'John Doe'}
                </h1>
                <CheckCircle2 size={24} className="text-indigo-400 mt-1" fill="currentColor" />
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                  <Users size={12} className="text-indigo-500" />
                  {data?.Followers ?? '1.2k'} <span className="text-slate-600 font-medium">Followers</span>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                  {data?.Following ?? '458'} <span className="text-slate-600 font-medium">Following</span>
                </span>
              </div>
            </div>

            {/* THE FOLLOW BUTTON: Perfectly aligned to the right side of the header */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleFollowToggle}
                className={`follow-btn group relative flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all duration-500 overflow-hidden ${isFollowing
                    ? 'bg-slate-900 text-slate-400 border border-slate-800 shadow-inner'
                    : 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-[0_10px_30px_rgba(99,102,241,0.2)]'
                  }`}
              >
                {/* Subtle hover glow effect */}
                {!isFollowing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                {isFollowing ? (
                  <>
                    <Check size={16} strokeWidth={3} className="text-indigo-500" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} strokeWidth={3} />
                    <span>Follow User</span>
                  </>
                )}
              </button>

              {/* Extra Settings/More Button for symmetry */}
              <button className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
      {/* 2. MAIN CONTENT GRID */}
      <div className="mt-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={Music2} label="Songs Played" value="2,485" color="bg-indigo-500" />
            <StatCard icon={Clock} label="Hours Listened" value="158" color="bg-purple-500" />
            <StatCard icon={Award} label="Badges" value="12" color="bg-emerald-500" />
          </div>

          <section>
            <h3 className="text-xl font-bold text-white mb-6">Recently Played</h3>
                 <div className="space-y-2">
              {songs?.map((i) => (
                <div key={i.Id} className="recent-item flex items-center justify-between p-3 rounded-xl bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/50 group cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <img src={i.bgPic} className="w-12 h-12 rounded-lg" alt="Cover" />
                    <div>
                      <p className="text-white font-bold text-sm">{i.Title}</p>
                      <p className="text-slate-500 text-xs font-medium italic">Played 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
          
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(i, songs);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-indigo-600 rounded-full text-white transition-opacity"
                    >
                      {getTrackId(currentTrack) === getTrackId(i) && getTrackId(i) && isPlaying ? (
                        <Pause size={14} fill="currentColor" />
                      ) : (
                        <Play size={14} fill="currentColor" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>


        {/* Right Column Content remains the same... */}
        <div className="space-y-8">
          <section className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50">
            <h3 className="text-lg font-bold text-white mb-6">Top Genres</h3>
            <div className="space-y-4">
              {[{ name: 'Synthwave', percent: '85%', color: 'bg-indigo-500' }, { name: 'Hip Hop', percent: '62%', color: 'bg-purple-500' }].map((genre) => (
                <div key={genre.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>{genre.name}</span>
                    <span>{genre.percent}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${genre.color} rounded-full`} style={{ width: genre.percent }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;