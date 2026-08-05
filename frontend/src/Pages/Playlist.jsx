import { Plus, X, Music, ListMusic, Trash2 } from 'lucide-react';
// Assuming these hooks exist in your project structure
import useGetplaylistTitles from '../Hooks/MusicHooks/GetPlaylistTitle';
import useCreatePlaylist from '../Hooks/MusicHooks/Createplaylist';
import toast from 'react-hot-toast';
import { useEffect,useState } from 'react';
import { Link } from '@tanstack/react-router';
import useGetAllMusic from '../Hooks/MusicHooks/GetMusic';
import useAddMusicToPlaylist from '../Hooks/MusicHooks/useAddMusicToPlaylist';
import { useDeletePlaylist } from '../Hooks/MusicHooks/DeletePlaylistHooks';

const Playlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [Musiclist, setMusiclist] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  
  const { data: allMusic } = useGetAllMusic();
 

  const { mutate: addMusic } = useAddMusicToPlaylist();
  const { mutate: deletePlaylist } = useDeletePlaylist();

  // Fetching playlists using the custom hook
  const { data, isLoading, error } = useGetplaylistTitles();
  const playlists = data?.result || [];

  const{mutate}=useCreatePlaylist()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playlistTitle.trim()) return;
     mutate(playlistTitle)
    setPlaylistTitle("");
    setIsModalOpen(false);
    toast.success("Playlist created successfully!");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-medium">
        Error loading playlists: {error.message}
      </div>
    );
  }

  function handleaddMusic(e, playlistId) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPlaylistId(playlistId);
    setMusiclist(true);
    setSelectedSongs([]);
  }

  function handleDeletePlaylist(e, playlistId) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(playlistId);
    }
  }

  const handleToggleSong = (songId) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const handleConfirmAddMusic = () => {
    if (selectedSongs.length === 0) {
      toast.error("Please select at least one song");
      return;
    }
    addMusic({ musicIds: selectedSongs, playlistId: currentPlaylistId });
    setMusiclist(false);
    setSelectedSongs([]);
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto bg-slate-950 min-h-screen text-slate-200">
      {/* Top Section with Create Button */}
      <div className="flex justify-end mb-4 sm:mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-sm sm:text-base"
        >
          <Plus size={16} className="sm:hidden" />
          <Plus size={18} className="hidden sm:block" />
          <span className="sm:inline">Create Playlist</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Playlist Content Section */}
      <div className="space-y-3 sm:space-y-4">
        
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2">
          <ListMusic className="text-indigo-500" size={20} />
          <span>Your Collections</span>
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium text-sm">Loading playlists...</p>
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {playlists.map((playlist, index) => (
              <Link key={playlist.Id} to={`/library/playlistMusic?titleId=${playlist.Id}`}>
                <div
                  key={playlist.id || index}
                  className="flex items-stretch sm:items-center justify-between p-3 sm:p-5 bg-slate-900/40 border border-slate-800/50 rounded-xl sm:rounded-2xl hover:bg-slate-900/80 hover:border-slate-700 transition-all group flex-col sm:flex-row gap-3 sm:gap-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-md sm:rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 transition-colors flex-shrink-0">
                      <Music size={16} className="sm:hidden" />
                      <Music size={20} className="hidden sm:block" />
                    </div>
                    <span className="font-bold text-slate-100 truncate min-w-0">
                      {playlist.Title || playlist.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 justify-end">
                    <button 
                      onClick={(e) => handleDeletePlaylist(e, playlist.Id)} 
                      className="p-1.5 sm:p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-all"
                      title="Delete Playlist"
                    >
                      <Trash2 size={16} className="sm:hidden" />
                      <Trash2 size={18} className="hidden sm:block" />
                    </button>
                    <button 
                      onClick={(e) => handleaddMusic(e, playlist.Id)} 
                      className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-md sm:rounded-lg transition-all border border-slate-700 hover:border-indigo-500"
                    >
                      Add Music
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-slate-900/20 rounded-2xl sm:rounded-3xl border border-dashed border-slate-800 px-4">
            <p className="text-slate-500 text-sm">No playlists found. Start by creating one!</p>
          </div>
        )}
        
      </div>

      {/* Add Music Modal */}
      {Musiclist && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMusiclist(false)}
          />
          
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-t-2xl sm:rounded-[2rem] p-4 sm:p-8 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh]">
            <button
              onClick={() => setMusiclist(false)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 text-slate-500 hover:text-white transition-colors p-1 sm:p-0"
            >
              <X size={18} className="sm:hidden" />
              <X size={22} className="hidden sm:block" />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 mt-2 sm:mt-0">Add Music to Playlist</h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">Select the tracks you want to add to your collection.</p>

            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 custom-scrollbar -mr-1 sm:-mr-2">
              {allMusic?.map((song) => (
                <div 
                  key={song.Id} 
                  className={`flex items-center justify-between p-2.5 sm:p-4 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                    selectedSongs.includes(song.Id) 
                    ? "bg-indigo-600/10 border-indigo-500/50" 
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => handleToggleSong(song.Id)}
                >
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-md sm:rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                      <Music size={14} className="sm:hidden" />
                      <Music size={18} className="hidden sm:block" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-100 text-sm sm:text-base truncate">{song.Title}</p>
                      <p className="text-xs text-slate-500 truncate">{song.Artist}</p>
                    </div>
                  </div>
                  
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    selectedSongs.includes(song.Id)
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-700"
                  }`}>
                    {selectedSongs.includes(song.Id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                    {selectedSongs.includes(song.Id) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleConfirmAddMusic}
                disabled={selectedSongs.length === 0}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-sm sm:text-base"
              >
                Add {selectedSongs.length > 0 ? `${selectedSongs.length} Tracks` : 'Selected'}
              </button>
              <button
                type="button"
                onClick={() => setMusiclist(false)}
                className="sm:w-auto px-4 sm:px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Modal with Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 text-slate-500 hover:text-white transition-colors p-1 sm:p-0"
            >
              <X size={18} className="sm:hidden" />
              <X size={22} className="hidden sm:block" />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 mt-2 sm:mt-0">New Playlist</h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-8">Give your new collection a unique name.</p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Morning Coffee Mix"
                  value={playlistTitle}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-sm sm:text-base"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="sm:w-auto px-4 sm:px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Playlist;