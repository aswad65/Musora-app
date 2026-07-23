import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Music, Image as ImageIcon,
  CheckCircle2, X, Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAddMusic from '../Hooks/MusicHooks/AddMusic';
import { useLocation } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

const CreateMusic = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',

  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [generatedMusicPath, setGeneratedMusicPath] = useState(null);
  const location = useLocation();
  const generatedMusic = location.state?.generatedMusic;
  // Animation Refs
  const formRef = useRef(null);

  const { mutate, isPending ,onSuccess} = useAddMusic()
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Please provide a title for your music.");
      return;
    }

    if (!audioFile && !generatedMusicPath) {
      toast.error("Please provide an audio file or use an AI-generated track.");
      return;
    }

    try {
      const musicFormData = new FormData();
      musicFormData.append("title", formData.title);
      musicFormData.append("artist", formData.artist);
      if (audioFile) {
        musicFormData.append("audio", audioFile);
      }
      if (generatedMusicPath) {
        musicFormData.append("generatedAudioPath", generatedMusicPath);
      }
      if (coverFile) {
        musicFormData.append("bgPic", coverFile);
      }

      mutate({ FormData: musicFormData }, {
        onSuccess: () => {
          setFormData({ title: '', artist: '', genre: '' });
          setAudioFile(null);
          setCoverFile(null);
      
        }
      }
      );

    } catch (error) {
      console.error(error);
      toast.error("Error preparing upload");
    }
  };
  useEffect(() => {
    if (generatedMusic) {
      setGeneratedMusicPath(generatedMusic);
    }
  }, [generatedMusic]);

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto bg-slate-950 min-h-screen">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
          Upload <span className="text-indigo-500">Music</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Share your sound with the SonicUI community.</p>
      </div>

      <form ref={formRef} onSubmit={handleUpload} className="space-y-8">

        {/* 1. FILE UPLOAD SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Audio Dropzone */}
          <div className="relative group">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Audio File</label>
            <div className={`relative h-48 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 ${audioFile || generatedMusicPath ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-900/30 hover:border-slate-600'
              }`}>
              <input
                type="file"
                accept="audio/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setAudioFile(e.target.files[0])}
              />
              {audioFile ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/40">
                    <CheckCircle2 className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">{audioFile.name}</p>
                  <button type="button" onClick={() => setAudioFile(null)} className="text-[10px] text-indigo-400 font-bold mt-2 uppercase">Change File</button>
                </div>
              ) : generatedMusicPath ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/40">
                    <CheckCircle2 className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-white">AI-generated track ready</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase">Using stored backend audio</p>
                </div>
              ) : (
                <>
                  <Upload className="text-slate-600 mb-3 group-hover:text-indigo-500 transition-colors" size={32} />
                  <p className="text-sm font-bold text-slate-400">Drag song here</p>
                  <p className="text-[10px] text-slate-600 mt-1 uppercase">MP3, WAV, FLAC</p>
                </>
              )}
            </div>
          </div>

          {/* Cover Art Dropzone */}
          <div className="relative group">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Cover Image</label>
            <div className={`relative h-48 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 ${coverFile ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900/30 hover:border-slate-600'
              }`}>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setCoverFile(e.target.files[0])}
              />
              {coverFile ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Preview"
                    className="w-20 h-20 rounded-xl object-cover mx-auto mb-2 shadow-xl"
                  />
                  <p className="text-[10px] text-purple-400 font-bold uppercase">Ready to upload</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="text-slate-600 mb-3 group-hover:text-purple-500 transition-colors" size={32} />
                  <p className="text-sm font-bold text-slate-400">Upload Artwork</p>
                  <p className="text-[10px] text-slate-600 mt-1 uppercase">JPG, PNG (1:1 Ratio)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. METADATA SECTION */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Song Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's the track called?"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-700 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Artist Name</label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Artist or Band name"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-700 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold appearance-none"
            >
              <option value="">Select a genre</option>
              <option value="electronic">Electronic / Synthwave</option>
              <option value="hiphop">Hip Hop / Rap</option>
              <option value="lofi">Lo-Fi / Chill</option>
              <option value="rock">Rock / Metal</option>
            </select>
          </div>
        </div>

        {/* 3. SUBMIT BUTTON */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={`group relative flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-2xl ${isPending
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'
              }`}
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>Publish Song</span>
                <Plus size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMusic;