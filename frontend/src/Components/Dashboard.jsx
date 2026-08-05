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
    <div className="p-3 sm:p-4 md:p-8 space-y-8 md:space-y-12 min-h-screen bg-slate-950">
      {/* Top Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
              Top <span className="text-indigo-500">Artists</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Most popular creators this week</p>
          </div>
        </div>
        
        <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-4 sm:pb-6 no-scrollbar snap-x -mx-3 sm:mx-0 px-3 sm:px-0">
          {isUsersLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 sm:gap-4 shrink-0 snap-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-slate-800/50 animate-pulse border-2 border-slate-800/50 shadow-xl"></div>
                <div className="h-3 bg-slate-800/50 animate-pulse rounded-full w-12 sm:w-16"></div>
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
            <div className="flex items-center gap-3 text-slate-600 bg-slate-900/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-dashed border-slate-800 w-full min-w-0 shrink-0">
              <User size={18} className="sm:hidden flex-shrink-0" />
              <User size={20} className="hidden sm:block flex-shrink-0" />
              <p className="font-medium text-xs sm:text-sm italic truncate min-w-0">No artists found in the community yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Mixed Content Section: Music & Albums */}
      <section>
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
              Discover <span className="text-indigo-500">New Sounds</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 truncate">Shuffled mix of music and albums for you</p>
          </div>
          {isError && (
            <button 
              onClick={() => refetch()}
              className="p-2 text-indigo-400 hover:text-white transition-colors flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-indigo-500/10 rounded-full px-2 sm:px-4 flex-shrink-0"
            >
              <RefreshCw size={12} className="sm:hidden" />
              <RefreshCw size={14} className="hidden sm:block" />
              <span className="hidden sm:inline">Retry</span>
            </button>
          )}
        </div>

        {isMusicLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-red-500/5 rounded-[2rem] sm:rounded-[3rem] border border-red-500/10 space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={24} className="sm:hidden" />
              <AlertCircle size={32} className="hidden sm:block" />
            </div>
            <div className="text-center px-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Something went wrong</h3>
              <p className="text-slate-500 text-xs sm:text-sm">We couldn't load the content right now.</p>
            </div>
          </div>
        ) : mixedData && mixedData.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-6 lg:gap-8">
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
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-slate-900/20 rounded-[2rem] sm:rounded-[3rem] border border-dashed border-slate-800 space-y-4 sm:space-y-6 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 shadow-inner">
              <Music size={28} className="sm:hidden animate-bounce" />
              <Music size={40} className="hidden sm:block animate-bounce" />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter">The stage is empty</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto">Be the first to share your sound! Upload your music or create albums to see them here.</p>
            </div>
            <Link to="/Create">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                <Plus size={16} className="sm:hidden" />
                <Plus size={18} className="hidden sm:block" />
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