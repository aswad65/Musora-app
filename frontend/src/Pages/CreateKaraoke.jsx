import React, { useState, useRef } from 'react';
import {
  Music, Upload, X, CheckCircle2,
  Play, Pause, Download, RefreshCw, Loader2,
  Mic2, FolderOpen, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import useGetMyMusic from '../Hooks/MusicHooks/Getmymusic';
import useAiKarokeService from '../Hooks/Ai-sending-Hook/Ai-karoke';

const CreateKaraoke = () => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [showMyMusicModal, setShowMyMusicModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180)
  const [isPlaying, setIsPlaying] = useState(false);
  console.log(selectedSong);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const getFullAudioUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `http://localhost:3000${url}`;
    return `http://localhost:3000/${url}`;
  };

  const handlePlay = (audioKaraoke) => {
    console.log("handlePlay called with audioKaraoke:", audioKaraoke);
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(getFullAudioUrl(audioKaraoke));
        
        // Update current time as the audio plays
        audioRef.current.addEventListener('timeupdate', () => {
          setCurrentTime(audioRef.current.currentTime);
        });
        
        // Get the total duration when metadata is loaded
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current.duration);
        });
        
        // Set isPlaying to false when audio ends
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });
      }

      if (isPlaying) {
        // Pause the audio
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Play the audio
        audioRef.current.play().catch((err) => {
          console.error("Failed to play audio:", err);
        });
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error in handlePlay:", err);
    }
  };
  const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

  // Handle progress bar click to seek
  const handleProgressBarClick = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  // Fetch user's music from backend with loading/error states
  const { data: myMusic, isLoading: isFetchingMusic, error: fetchMusicError, refetch } = useGetMyMusic();
  
  // Fetch karaoke service
  const { mutate, isPending: isGenerating, data: karokeData, error: generationError } = useAiKarokeService();
  console.log("asasa 1",karokeData?.data?.noVocalsUrl);
   console.log("asasa 2",karokeData?.data?.[0]?.noVocalsUrl);

  

  // Handle errors
  React.useEffect(() => {
    if (fetchMusicError) {
      toast.error("Failed to fetch your music");
    }
    if (generationError) {
      toast.error("Failed to generate karaoke");
    }
  }, [fetchMusicError, generationError]);

  // Cleanup audio on component unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop playing when song is replaced
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentTime(0);
    setDuration(180);
  }, [selectedSong]);

  // Reset player when karaoke data changes
  React.useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [karokeData]);

  // Handle selecting from My Music
  const handleSelectFromMyMusic = (song) => {
    setSelectedSong(song);
    setShowMyMusicModal(false);
  };

  // Handle uploading from computer
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSong({
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        duration: "3:30", // Placeholder
        file: file
      });
    }
  };

  const handleDownload = async (audioUrl) => {
    if (!audioUrl) return;
    try {
      const url = getFullAudioUrl(audioUrl);
      const resp = await fetch(url);
      const blob = await resp.blob();
      const mimeParts = blob.type.split('/');
      const ext = mimeParts[1] || 'webm';
      const filename = `${selectedSong?.Title || selectedSong?.name || 'karaoke'}-karaoke.${ext}`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed, opening in new tab', err);
      window.open(getFullAudioUrl(audioUrl), '_blank');
    }
  };

  const handleUpload = (audioUrl) => {
    if (!audioUrl) {
      toast.error("No karaoke audio available to upload");
      return;
    }
    navigate({
      to: "/Create",
      state: {
        generatedMusic: generatedAudioPath,
      },
    });
  };

  // Handle remove/change song
  const handleRemoveSong = () => {
    setSelectedSong(null);
  };

  // Simulate karaoke generation
  const handleCreateKaraoke = () => {
    const formdata=new FormData();
    
    // Check if selected song has a file (uploaded from computer)
    if (selectedSong.file) {
      console.log("Appending uploaded file to formdata:", selectedSong.file.name);
      formdata.append("file", selectedSong.file);
    } 
    // If no file, check if it has an audioUrl (from My Music)
    else if (selectedSong.AudioFile) {
      console.log("Appending audioUrl to formdata:", selectedSong.AudioFile);
      formdata.append("audioUrl", selectedSong.AudioFile);
    } 
    // Otherwise, error
    else {
      toast.error("No valid audio selected");
      return;
    }
    
    console.log("Sending formdata to backend");
    mutate(formdata); // Notice: we're passing formdata directly, not wrapped in { formdata }
  };

  // Reset karaoke state when replacing song
  const handleReplaceSong = () => {
    // We'll use setSelectedSong(null) or just let user choose new song
    setSelectedSong(null);
    // If we had a reset function in the hook we'd use it here
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto bg-slate-950 min-h-screen">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
          Create <span className="text-indigo-500">Karaoke</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Upload a song to generate its karaoke version.</p>
      </div>

      <div className="space-y-8">
        {/* 1. UPLOAD OPTIONS SECTION */}
        {!selectedSong && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Option 1: Choose from My Music */}
            <button 
              onClick={() => setShowMyMusicModal(true)}
              className="group relative h-56 rounded-[2rem] border-2 border-dashed border-slate-800 bg-slate-900/30 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center p-8 text-left"
            >
              <div className="w-14 h-14 bg-slate-800 group-hover:bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <FolderOpen className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Choose from My Music</h3>
              <p className="text-sm text-slate-500 font-medium">Select a track you've already uploaded</p>
            </button>

            {/* Option 2: Upload from Computer */}
            <div className="relative group">
              <div className="h-56 rounded-[2rem] border-2 border-dashed border-slate-800 bg-slate-900/30 hover:border-purple-500 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center p-8">
                <input
                  type="file"
                  accept="audio/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <div className="w-14 h-14 bg-slate-800 group-hover:bg-purple-600/20 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <Upload className="text-slate-400 group-hover:text-purple-400 transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Upload from Computer</h3>
                <p className="text-sm text-slate-500 font-medium">Drag & drop or click to browse audio files</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. SELECTED SONG PREVIEW */}
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex items-center gap-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Music className="text-white" size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-white truncate">{selectedSong.Title || selectedSong.name}</h3>
              <p className="text-slate-500 font-medium">{selectedSong.Artist || selectedSong.artist}</p>
              <p className="text-xs text-slate-600 font-bold uppercase mt-1">{selectedSong.Duration || selectedSong.duration || "3:30"}</p>
            </div>
            <button
              onClick={handleRemoveSong}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all flex-shrink-0"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}

        {/* 3. CREATE KARAOKE BUTTON */}
        {selectedSong && (
          <div className="pt-4">
            <button
              onClick={handleCreateKaraoke}
              disabled={isGenerating}
              className={`w-full group relative flex items-center justify-center gap-3 px-10 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl ${isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.99]'
                }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Generating Karaoke...</span>
                </>
              ) : (
                <>
                  <Mic2 size={20} fill="currentColor" />
                  <span>Create Karaoke</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 4. KARAOKE OUTPUT SECTION */}
       <div className="mt-8">
    {/* Placeholder before generation */}
    {!isGenerating && !karokeData && (
      <div className="h-64 bg-slate-900/30 border border-dashed border-slate-800 rounded-[2.5rem] flex items-center justify-center">
        <div className="text-center">
          <Mic2 className="text-slate-700 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Your karaoke track will appear here.</p>
        </div>
      </div>
    )}

    {/* Loading state during generation */}
    {isGenerating && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-64 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center"
      >
        <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
        <p className="text-lg font-black text-white mb-2">Processing your track...</p>
        <p className="text-slate-500 font-medium">Removing vocals and creating instrumental</p>
        {/* Simulated progress bar */}
        <div className="w-2/3 h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </div>
      </motion.div>
    )}

    {/* Success state after generation */}
    {karokeData && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-[2.5rem] p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-600/20 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="text-green-400" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Karaoke generated successfully!</h3>
            <p className="text-slate-400 font-medium">{selectedSong?.Title || selectedSong?.name || "Unknown Title"}</p>
          </div>
        </div>

        {/* --- Music Player Progress Bar & Duration --- */}
        <div className="mb-8 bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-black tracking-wider">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div 
            className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer hover:h-3 transition-all"
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-100" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        </div>
        {/* ------------------------------------------- */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => handlePlay(karokeData?.data?.noVocalsUrl)} 
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
          >
            {isPlaying ? (
              <>
                <Pause size={16} fill="currentColor" />
                Pause
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                Play
              </>
            )}
          </button>
          
          <button 
            onClick={() => {
              const karaokeUrl = karokeData?.data?.noVocalsUrl || karokeData?.data?.[0]?.noVocalsUrl;
              handleDownload(karaokeUrl);
            }}
            disabled={!karokeData}
            className={`flex items-center justify-center gap-2 px-6 py-4 ${karokeData ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} rounded-2xl font-black uppercase tracking-widest text-xs transition-all`}
          >
            <Download size={16} />
            Download
          </button>

          {/* Replaced 'Replace Song' with 'Upload Song' */}
          <button
            onClick={() => {
              const karaokeUrl = karokeData?.data?.noVocalsUrl || karokeData?.data?.[0]?.noVocalsUrl;
              handleUpload(karaokeUrl);
            }}
            disabled={!karokeData}
            className={`flex items-center justify-center gap-2 px-6 py-4 ${karokeData ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} rounded-2xl font-black uppercase tracking-widest text-xs transition-all`}
          >
            <Upload size={16} />
            Upload Song
          </button>
        </div>
      </motion.div>
    )}
  </div>
      </div>

      {/* My Music Modal */}
      {showMyMusicModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-black text-white italic uppercase">My Music</h3>
              <button
                onClick={() => setShowMyMusicModal(false)}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {/* Loading state */}
              {isFetchingMusic && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="text-indigo-500 animate-spin mb-4" size={40} />
                  <p className="text-slate-400 font-medium">Loading your music...</p>
                </div>
              )}

              {/* Error state */}
              {!isFetchingMusic && fetchMusicError && (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="text-red-500 mb-4" size={40} />
                  <p className="text-red-400 font-medium mb-4">Failed to load your music</p>
                  <button
                    onClick={() => refetch()}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!isFetchingMusic && !fetchMusicError && (!myMusic || myMusic.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="text-slate-600 mb-4" size={40} />
                  <p className="text-slate-400 font-medium mb-2">No music uploaded yet</p>
                  <p className="text-slate-500 text-sm">Upload some songs first to use them here</p>
                </div>
              )}

              {/* Success state with music list */}
              {!isFetchingMusic && !fetchMusicError && myMusic && myMusic.length > 0 && (
                <div className="space-y-3">
                  {myMusic.map((song) => (
                    <button
                      key={song.MusicId || song.Id}
                      onClick={() => handleSelectFromMyMusic(song)}
                      className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl flex items-center gap-4 text-left transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Music className="text-slate-400" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{song.Title}</p>
                        <p className="text-sm text-slate-500">{song.Artist}</p>
                      </div>
                      <p className="text-xs text-slate-600 font-bold font-mono flex-shrink-0">{"3:30"}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CreateKaraoke;
