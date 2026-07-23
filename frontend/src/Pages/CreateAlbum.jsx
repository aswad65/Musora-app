import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Plus, Music, Image as ImageIcon, X, 
  CheckCircle2, ListMusic, Trash2, Save, Search, Check 
} from 'lucide-react';
import MusicItem from '../Components/MusicLibrayItem';
import useCreateAlbum from '../Hooks/MusicHooks/CreateAlbum';
import useGetMyMusic from '../Hooks/MusicHooks/GetMyMusic';
import toast from 'react-hot-toast';

const AlbumCreationPage = () => {
  // --- STATE ---
  const [albumTitle, setAlbumTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { mutate, isPending } = useCreateAlbum();
  const { data: myMusic, isLoading: isMusicLoading } =useGetMyMusic();

  // Filtered Music for Picker
  const filteredMusic = myMusic?.filter(song => 
    song.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.Artist.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // --- HANDLERS ---
  const addSongToAlbum = (song) => {
    if (!selectedSongs.find(s => s.Id === song.Id)) {
      setSelectedSongs([...selectedSongs, song]);
      toast.success(`${song.Title} added to selection`);
    } else {
      toast.error("Song already selected");
    }
  };

  const removeSong = (id) => {
    setSelectedSongs(selectedSongs.filter(s => s.Id !== id));
  };

  const handleCreateAlbum = () => {
    if (!albumTitle) {
      toast.error("Please enter an album title");
      return;
    }
    if (selectedSongs.length === 0) {
      toast.error("Please select at least one song");
      return;
    }

    const formData = new FormData();
    formData.append("Title", albumTitle);
    formData.append("Description", description);
    if (coverImage) {
      formData.append("albumPic", coverImage);
    }
    // We send only the IDs
    const musicIds = selectedSongs.map(s => s.Id);
    console.log("musicIds:", musicIds);
    
    formData.append("MusicIds", JSON.stringify(musicIds));
    
    mutate({ FormData: formData });
  };

  // --- ANIMATIONS ---
  useEffect(() => {
    if (selectedSongs.length > 0) {
      gsap.from(".new-item", {
        x: -20,
        opacity: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, [selectedSongs.length]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12">
      
      {/* HEADER */}
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
          <ListMusic className="text-indigo-500" size={36} />
          Create New Album
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Studio Management / Album Builder</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: METADATA */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Album Cover</label>
              <div className="relative group w-full aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden">
                {coverImage ? (
                  <img src={URL.createObjectURL(coverImage)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-slate-700 group-hover:text-indigo-400 mb-4 transition-colors" size={48} />
                    <span className="text-xs font-bold text-slate-600">Upload High-Res Artwork</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Album Title"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white font-bold placeholder:text-slate-700 focus:border-indigo-500 focus:ring-0 transition-all"
                />
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (Optional)"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-slate-300 text-sm focus:border-indigo-500 focus:ring-0 transition-all min-h-[120px] resize-none"
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: TRACKLIST MANAGEMENT */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-4">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Album Tracklist</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                {selectedSongs.length} {selectedSongs.length === 1 ? 'Track' : 'Tracks'} Selected
              </p>
            </div>
            <button 
              onClick={() => setShowMusicPicker(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Plus size={16} />
              Open Music Picker
            </button>
          </div>

          {/* DYNAMIC LIST OF SELECTED SONGS */}
          <div className="space-y-3 min-h-[450px] bg-slate-900/20 rounded-[2.5rem] border border-slate-800/50 p-6 backdrop-blur-sm">
            {selectedSongs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-32">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Music size={40} strokeWidth={1.5} className="opacity-20" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">Your tracklist is empty</p>
                <button 
                  onClick={() => setShowMusicPicker(true)}
                  className="mt-4 text-indigo-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Click here to add music
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSongs.map((song) => (
                  <div key={song.Id} className="new-item group flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img src={song.bgPic || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100"} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">{song.Title}</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{song.Artist}</p>
                    </div>
                    <button 
                      onClick={() => removeSong(song.Id)}
                      className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT SECTION */}
          <div className="pt-4 flex justify-end">
            <button 
              onClick={handleCreateAlbum}
              disabled={!albumTitle || selectedSongs.length === 0 || isPending}
              className="group flex items-center gap-4 bg-indigo-600 disabled:bg-slate-800 text-white disabled:text-slate-600 px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-xs transition-all hover:bg-indigo-500 active:scale-95 shadow-2xl shadow-indigo-600/20"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {isPending ? "Creating Album..." : "Finalize & Create Album"}
              {!isPending && <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>

      {/* MODERN MUSIC SELECTION POPUP */}
      {showMusicPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowMusicPicker(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-[#0f172a] border border-slate-800 w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            
            {/* LEFT: MUSIC EXPLORER */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800/50">
              {/* Header */}
              <div className="p-8 border-b border-slate-800/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Your <span className="text-indigo-500">Music Library</span></h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Select tracks to add to your new album</p>
                  </div>
                  <button 
                    onClick={() => setShowMusicPicker(false)}
                    className="md:hidden p-2 text-slate-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or artist..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Music List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                {isMusicLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : filteredMusic.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                    <Music size={48} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">No matching tracks found</p>
                  </div>
                ) : (
                  filteredMusic.map((song) => {
                    const isSelected = selectedSongs.some(s => s.Id === song.Id);
                    return (
                      <div 
                        key={song.Id}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                          ? "bg-indigo-600/10 border-indigo-500/50" 
                          : "bg-slate-900/40 border-transparent hover:border-slate-700 hover:bg-slate-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 bg-slate-950 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                            <img src={song.bgPic || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100"} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white font-bold text-sm md:text-base truncate">{song.Title}</h4>
                            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest mt-1">{song.Artist}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => addSongToAlbum(song)}
                          disabled={isSelected}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isSelected
                            ? "bg-indigo-600 text-white cursor-default"
                            : "bg-slate-950 text-slate-400 hover:bg-white hover:text-black border border-slate-800"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={14} strokeWidth={3} />
                              Selected
                            </>
                          ) : (
                            <>
                              <Plus size={14} strokeWidth={3} />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT: SELECTED TRACKS PANEL */}
            <div className="w-full md:w-80 bg-slate-950/50 flex flex-col border-t md:border-t-0 md:border-l border-slate-800/50">
              <div className="p-8 flex items-center justify-between border-b border-slate-800/50">
                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  Selection <span className="text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md text-[10px]">{selectedSongs.length}</span>
                </h4>
                <button 
                  onClick={() => setShowMusicPicker(false)}
                  className="hidden md:block p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {selectedSongs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30">
                    <ListMusic size={32} className="mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">Your selection list is empty</p>
                  </div>
                ) : (
                  selectedSongs.map(song => (
                    <div key={song.Id} className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 group animate-in slide-in-from-right-4 duration-300">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={song.bgPic || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=50"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="flex-1 text-[11px] font-bold text-slate-200 truncate">{song.Title}</span>
                      <button 
                        onClick={() => removeSong(song.Id)}
                        className="text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-slate-800/50">
                <button 
                  onClick={() => setShowMusicPicker(false)}
                  className="w-full bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                  Done Selecting
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumCreationPage;