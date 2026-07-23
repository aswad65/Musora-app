import React, { use, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useUserContext } from '../Context/UserContext';
import EditMusicModal from '../Components/EditMusicModal';
import { useMusicContext } from '../Context/MusicContext';
import { useGetAllByuser } from '../Hooks/GetUserbyId';
import useGetMusicById from '../Hooks/MusicHooks/GetMusicById';

import {
  Settings, Edit3, Award, Clock, Music2,
  Users, Play, MoreHorizontal, CheckCircle2, X, Image as ImageIcon, Trash2,Pause,
  EditIcon, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetUserProfile } from '../Hooks/GetUserProfile';
import useEditProfile from '../Hooks/EditProfile';
import useDeleteMusic from '../Hooks/MusicHooks/DeleteMusic';
import { usePlayer } from '../Context/PlayerContext';
import router from '../routes/router';



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

const MyprofilePage = () => {

  const [Pop, setPop] = useState(false)
  const [Name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [isEditMusicModalOpen, setIsEditMusicModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const { LogoutUser } = useUserContext();
  const handleEditMusic = (music) => {
    setSelectedMusic(music);
    setIsEditMusicModalOpen(true);
  };

  const { data: loginuser } = useGetUserProfile();
  const userId = loginuser?.ID;
  const { data: music } = useGetMusicById(userId);
  const { data, isLoading, error } = useGetUserProfile();
  const { mutate, isPending } = useEditProfile()
  const { mutate: deleteMusic } = useDeleteMusic()
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const getTrackId = (track) => track?.Id || track?.MusicId || track?.MusicID || track?.id;
  const songs = music?.music || [];


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Profile Header Entrance
      gsap.from(".profile-header", {
        scale: 0.9,
        // opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Staggered Stats & Lists
      gsap.from(".stat-card, .recent-item", {
        y: 20,
        // opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out"
      });
    });
    return () => ctx.revert();
  }, []);

  function handlePopup() {

    setPop(true);
  }

  function handleClose() {
    setPop(false)
    setName('')
    setFile(null)
  }

  function handleSubmit(e) {
    const formData = new FormData();
    formData.append('Name', Name);
    formData.append('file', file);
    e.preventDefault()
    mutate({ formdata: formData });
    console.log({ formData });

    if (!Name || !file) {
      toast.error("Please fill in all fields")
      return
    }

    // console.log("Submitting:", { Name, file })
    toast.success("Profile updated successfully!")
    handleClose()
  }

  const handleSettingsToggle = () => {
    setIsSettingsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await LogoutUser();
      setIsSettingsMenuOpen(false);
      router.navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-full pb-20">

      {/* 1. PROFILE HEADER */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950">
        <div className="absolute -bottom-16 left-6 md:left-12 flex flex-col md:flex-row items-end gap-6 profile-header">
          <div className="relative group">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-slate-950 overflow-hidden shadow-2xl bg-slate-800">
              <img src={data?.ProfilePicture} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={handlePopup}
              className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-full border-2 border-slate-950 hover:scale-110 transition-transform"
            >
              <Edit3 size={16} className="text-white" />
            </button>
          </div>

          <div className="pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">{data?.Name || 'John Doe'}</h1>
              <CheckCircle2 size={24} className="text-indigo-400" fill="currentColor" />
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1"><Users size={14} /> {data?.Followers ?? data?.followers?.length ?? '1.2k'} Followers</span>
              <span>•</span>
              <span className="flex items-center gap-1">{data?.Following ?? '458'} Following</span>
            </div>
            <p className="text-sm text-slate-400">{data?.Email || 'example@domain.com'}</p>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex gap-3">
          <div className="relative">
            <button
              onClick={handleSettingsToggle}
              className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40"
            >
              <Settings size={20} />
            </button>

            {isSettingsMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-md">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="mt-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: STATS & GENRES */}
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={Music2} label="Songs Played" value="2,485" color="bg-indigo-500" />
            <StatCard icon={Clock} label="Hours Listened" value="158" color="bg-purple-500" />
            <StatCard icon={Award} label="Badges" value="12" color="bg-emerald-500" />
          </div>

          {/* Recently Played List */}          <section>
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
                        handleEditMusic(i);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all active:scale-90"
                    >
                      <EditIcon size={14} />
                   </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm("Are you sure you want to delete this music?")) {
                          deleteMusic({ musicId: i.Id });
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-rose-600 hover:bg-rose-500 rounded-full text-white transition-all active:scale-90"
                    >
                      <Trash2 size={14} />
                    </button>
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

        {/* RIGHT COLUMN: FRIENDS / ACTIVITY */}

        {isPending && <p>Updating profile...</p>}
        {/* MODALS */}
      <EditMusicModal 
        isOpen={isEditMusicModalOpen} 
        onClose={() => setIsEditMusicModalOpen(false)} 
        music={selectedMusic} 
      />

      {Pop && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-2xl w-full max-w-md relative overflow-hidden group">

              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700"></div>

              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">
                  Edit <span className="text-indigo-500">Profile</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium mb-8">
                  Update your identity and avatar
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Profile Name
                    </label>
                    <input
                      type="text"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                    />
                  </div>

                  {/* File Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Avatar Image
                    </label>
                    <div className="relative group/file">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group-hover/file:border-indigo-500/50 group-hover/file:bg-indigo-500/5 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover/file:text-indigo-500 group-hover/file:bg-indigo-500/10 transition-all">
                          <ImageIcon size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 group-hover/file:text-slate-300 transition-colors">
                          {file ? file.name : "Select profile picture"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 mt-4"
                  >
                    <CheckCircle2 size={18} />
                    Save Changes
                  </button>

                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>

  );

};

export default MyprofilePage;