import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link, useNavigate } from '@tanstack/react-router';
import { 
  Home, Search, Library, Heart, ListMusic, 
  Bell, Zap, MessageSquare, Menu, X, Album,
  ChevronUp,ChevronLeft
} from 'lucide-react';
import {SidebarItem} from './Sidebar';
import { POPUP } from './POPUP';
import SearchBar from './SearchBar';
import GlobalPlayer from './GlobalPlayer';
import AIIntroModal from './AIIntroModal';
import AIChatPanel from './AIChatPanel';


const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [focus, setfocus] = useState(false);
  const [cut, setcut] = useState(true);

  // AI Assistant States
  const [isAIIntroOpen, setIsAIIntroOpen] = useState(false);
  const [aiChatStatus, setAiChatStatus] = useState('never-opened');

  function handleClick() {
    setShowPopUp(true);
  }

  function handleAIClick() {
    setIsAIIntroOpen(true);
  }

  function handleGetStarted() {
    setIsAIIntroOpen(false);
    setAiChatStatus('open');
  }

  // Handle Create Karaoke button
  function handleCreateKaraoke() {
    setIsAIIntroOpen(false);
    navigate({ to: "/create-karaoke" });
  }

  // Handle Create Music button (open chat)
  function handleCreateMusic() {
    setIsAIIntroOpen(false);
    setAiChatStatus('open');
  }

  const handleCloseAIChat = () => {
    setAiChatStatus('closed');
  };

  const handleReopenAIChat = () => {
    setAiChatStatus('open');
  };

  // Handle Separate Vocals button (placeholder)
  function handleSeparateVocals() {
    setIsAIIntroOpen(false);
    // Placeholder: You can navigate or open another modal here later
  }

  function handleSearch() {
   setfocus(true);
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isSidebarOpen) {
      gsap.to(sidebarRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
      gsap.to(overlayRef.current, { opacity: 1, visibility: 'visible', duration: 0.3 });
    } else {
      if (isMobile) {
        gsap.to(sidebarRef.current, { x: "-100%", duration: 0.4, ease: "power3.in" });
      }
      gsap.to(overlayRef.current, { opacity: 0, visibility: 'hidden', duration: 0.3 });
    }
  }, [isSidebarOpen]);
 
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Background Overlay */}
      <div 
        ref={overlayRef}
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden invisible opacity-0"
      />

      {/* Persistent Sidebar */}
      <aside 
        ref={sidebarRef}
        className="fixed lg:static z-50 flex flex-col w-72 max-w-[85vw] h-full bg-slate-900 border-r border-slate-800 p-4 sm:p-6 transform -translate-x-full lg:translate-x-0"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap size={22} className="text-indigo-500" fill="currentColor" />
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Musora</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-1">
          <Link to="/"><SidebarItem icon={Home} label="Home"  /></Link>
          <SidebarItem handleSearch={handleSearch} icon={Search} label="Explore"  />
          <Link to="/library/Liked"><SidebarItem  icon={Library} label="Library" /></Link>
          <Link to="/Create"><SidebarItem  icon={ListMusic} label="Add Music" /></Link>
          <Link to="/CreateAlbum"><SidebarItem  icon={Album} label="Add Album" /></Link>

 
        </nav>
      </aside>

      {/* Main Content Scroll Area */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pb-32">
        {/* Persistent Header */}
        <header className="sticky top-0 z-30 px-3 sm:px-4 md:px-8 py-3 sm:py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 rounded-xl text-slate-300 border border-slate-800 flex-shrink-0">
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <SearchBar focus={focus} setfocus={setfocus} />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 flex-shrink-0">
            <button className="hidden md:block px-3 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] sm:text-xs font-bold transition-transform active:scale-95 whitespace-nowrap">Upgrade</button>
            <div className="relative flex-shrink-0">
              <Bell onClick={handleClick} size={18} className="text-slate-400 cursor-pointer hover:text-white" />
          
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-slate-700 flex items-center justify-center text-[10px] font-black flex-shrink-0"><Link to="/MyProfile">JD</Link></div>
          </div>
          {ShowPopUp && (
            <POPUP setShowPopUp={setShowPopUp} /> 
          )}

        </header>

        {/* This is where the specific page content loads */}
        <div className="flex-1">
          {children}
        </div>

        <AIIntroModal 
          isOpen={isAIIntroOpen} 
          onClose={() => setIsAIIntroOpen(false)} 
          onCreateMusic={handleCreateMusic} 
          onCreateKaraoke={handleCreateKaraoke} 
          onSeparateVocals={handleSeparateVocals} 
        />

        <AIChatPanel 
          isOpen={aiChatStatus === 'open'}
          onClose={handleCloseAIChat}
          onMinimize={handleCloseAIChat}
        />

        {/* Persistent AI Button */}
        <button 
          onClick={handleAIClick}
          className="fixed bottom-32 right-4 sm:bottom-24 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl z-40 active:scale-90 transition-transform hover:bg-indigo-500 group"
        >
          <div className="hidden sm:block absolute -top-12 right-0 bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            AI ASSISTANT
          </div>
          <MessageSquare size={20} className="sm:hidden" />
          <MessageSquare size={24} className="hidden sm:block" />
        </button>
      </main>
      {cut ? (
  <GlobalPlayer  setCut={setcut} />
) : (
  <button
    onClick={() => setcut(true)}
    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition-all z-[101]"
    title="Open player"
  >
    <ChevronUp size={24} />
  </button>
)}
{aiChatStatus === 'closed' && (
  <button
    onClick={handleReopenAIChat}
    className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-slate-700 transition-all z-[100]"
    title="Open AI Chat"
  >
    <ChevronLeft size={20} className="sm:hidden" />
    <ChevronLeft size={24} className="hidden sm:block" />
  </button>
)}
    </div>
  );
};

export default AppLayout;