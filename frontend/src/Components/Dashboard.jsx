import React, { useMemo } from 'react';
import { gsap } from 'gsap';
import MusicCard from './MusicCard';
import { useGetAlluser } from '../Hooks/GetallUser';
import { ArtistCard } from './ArtistCard';
import useGetAllMusic from '../Hooks/MusicHooks/GetMusic';
import { MoreHorizontal,Music, User, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import useGetalbum from '../Hooks/MusicHooks/Getalbum';
import AlbumCard from './Componenetforalbum';

const DashboardPage = () => {
  const { data: userData, isLoading: isUsersLoading } = useGetAlluser();
  const { data: MusicData, isLoading: isMusicLoading, isError, refetch } = useGetAllMusic();
  const {data:albumData}=useGetalbum();
  const albums=albumData?.result?.[0] || [];

  const mixedData = useMemo(() => {
    if (!MusicData && !albums) return [];

    const musicItems =
      MusicData?.map(item => ({
        ...item,
        contentType: "music",
      })) || [];

    const albumItems =
      albums?.map(item => ({
        ...item,
        contentType: "album",
      })) || [];

    const combined = [...musicItems, ...albumItems];

    // Fisher-Yates Shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined;
  }, [MusicData, albums]);

  const onlyMusicTracks = useMemo(() => mixedData.filter(item => item.contentType === 'music'), [mixedData]);

  const SkeletonCard = () => (
    <div className="skeleton-card bg-slate-900/40 rounded-3xl p-4 border border-slate-800/50 space-y-4">
      <div className="aspect-square bg-slate-800/50 rounded-2xl w-full animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/50 rounded-full w-3/4 animate-pulse"></div>
        <div className="h-3 bg-slate-800/50 rounded-full w-1/2 animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-12 min-h-screen bg-slate-950">
      {/* Top Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
              Top <span className="text-indigo-500">Artists</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium">Most popular creators this week</p>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
          {isUsersLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4 shrink-0">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-800/50 animate-pulse border-2 border-slate-800/50 shadow-xl"></div>
                <div className="h-3 bg-slate-800/50 animate-pulse rounded-full w-16"></div>
              </div>
            ))
          ) : userData && userData.length > 0 ? (
            userData.map((user) => (
              <ArtistCard 
                key={user.ID} 
                name={user.Name} 
                Id={user.ID} 
                imageUrl={user.ProfilePicture||`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.Name}`} 
              />
            ))
          ) : (
            <div className="flex items-center gap-3 text-slate-600 bg-slate-900/20 p-6 rounded-3xl border border-dashed border-slate-800 w-full">
              <User size={20} />
              <p className="font-medium text-sm italic">No artists found in the community yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Mixed Content Section: Music & Albums */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
              Discover <span className="text-indigo-500">New Sounds</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium">Shuffled mix of music and albums for you</p>
          </div>
          {isError && (
            <button 
              onClick={() => refetch()}
              className="p-2 text-indigo-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-indigo-500/10 rounded-full px-4"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
        </div>

        {isMusicLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 bg-red-500/5 rounded-[3rem] border border-red-500/10 space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">Something went wrong</h3>
              <p className="text-slate-500 text-sm">We couldn't load the content right now.</p>
            </div>
          </div>
        ) : mixedData && mixedData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8">
            {mixedData.map((item, i) => (
              <div key={i} className="transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                {item.contentType === 'music' ? (
                  <MusicCard Music={item} fullList={onlyMusicTracks} />
                ) : (
                  <AlbumCard Album={item} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800 space-y-6">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 shadow-inner">
              <Music size={40} className="animate-bounce" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">The stage is empty</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Be the first to share your sound! Upload your music or create albums to see them here.</p>
            </div>
            <Link to="/Create">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                <Plus size={18} />
                <span>Upload Music</span>
              </button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;