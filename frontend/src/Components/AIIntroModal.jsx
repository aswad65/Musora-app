import React from 'react';
import { X, Sparkles, Music, Mic, Scissors } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '@tanstack/react-router';

const AIIntroModal = ({ isOpen, onClose, onCreateMusic, onCreateKaraoke }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/10 blur-3xl rounded-full -ml-12 -mb-12" />

        <div className="p-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-indigo-400" size={32} />
          </div>

          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4">
            Meet Your <span className="text-indigo-500">AI Assistant</span>
          </h2>

          <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700/50">
            <p className="text-slate-300 font-medium leading-relaxed">
              🎉 This AI feature is currently <span className="text-indigo-400 font-bold underline">free</span> for a limited time. It may become a premium feature in future updates.
            </p>
          </div>

          {/* Core Action Menu Stack */}
          <div className="flex flex-col gap-3">
            {/* Button 1: Create Music by AI */}
            <button
              onClick={onCreateMusic}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Music size={16} fill="currentColor" />
              Create Music by AI
            </button>

            {/* Button 2: Create Karaoke */}
            <Link to="/create-karaoke">
            <button
              onClick={onCreateKaraoke}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
            >
              <Mic size={16} />
              Create Karaoke
            </button>
            </Link>

            {/* Button 3: Separate Vocal from Non-Vocal */}
           

            {/* Secondary Action: Close Panel */}
            <button
              onClick={onClose}
              className="w-full bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all mt-2"
            >
              Close
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </motion.div>
    </div>
  );
};

export default AIIntroModal;