import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, CheckCircle2, Save } from 'lucide-react';
import useEditMusic from '../Hooks/MusicHooks/EditMusic';

const EditMusicModal = ({ music, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const { mutate, isPending } = useEditMusic();

  useEffect(() => {
    if (music) {
      setFormData({
        title: music.Title || '',
        artist: music.Artist || '',
      });
    }
  }, [music]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const musicFormData = new FormData();
    musicFormData.append("MusicId", music.Id);
    musicFormData.append("Title", formData.title);
    musicFormData.append("Artist", formData.artist);
    if (audioFile) musicFormData.append("audio", audioFile);
    if (coverFile) musicFormData.append("bgPic", coverFile);

    mutate({ FormData: musicFormData }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
            Edit <span className="text-indigo-500">Music</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Upload */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Audio File</label>
              <div className={`relative h-32 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 ${
                audioFile ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}>
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setAudioFile(e.target.files[0])}
                />
                {audioFile ? (
                  <div className="text-center">
                    <CheckCircle2 className="text-indigo-500 mx-auto mb-1" size={24} />
                    <p className="text-xs font-bold text-white truncate max-w-[150px]">{audioFile.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="text-slate-600 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Change Audio</p>
                  </>
                )}
              </div>
            </div>

            {/* Cover Upload */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cover Image</label>
              <div className={`relative h-32 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 ${
                coverFile ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />
                {coverFile ? (
                  <img 
                    src={URL.createObjectURL(coverFile)} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-lg object-cover shadow-lg"
                  />
                ) : (
                  <>
                    <ImageIcon className="text-slate-600 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Change Cover</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Song Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Artist Name</label>
              <input 
                type="text" 
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-full font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMusicModal;
