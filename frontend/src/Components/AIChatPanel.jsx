import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, MinusCircle, Mic, Square, Trash2, Upload, Download, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import useAiInput from '../Hooks/Ai-sending-Hook/AI-Input';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { useNavigate } from '@tanstack/react-router';


const AIChatPanel = ({ isOpen, onClose, onMinimize }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', type: 'text', content: 'Hello! I am your SonicUI AI assistant. How can I help you with your music today?' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [pendingMessageId, setPendingMessageId] = useState(null);
  const [suggestions] = useState([
    'An electronic dance track with a heavy beat and synthesizer melody',
    'A peaceful piano sonata with gentle flowing notes',
    'An upbeat jazz piece with saxophone and trumpet solos',
    'A rock anthem with electric guitar riffs and powerful drums'
  ]);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { mutate, data, isPending } = useAiInput();
  const navigate = useNavigate();


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isPending) {
      setPendingMessageId(null);
    }
  }, [isPending]);

  // Helper function to get full audio URL
  const getFullAudioUrl = (url) => {
    if (!url) return url;
    // If it's a relative URL, prepend backend URL
    if (url.startsWith('/')) {
      return `http://localhost:3000${url}`;
    }
    return url;
  };

  // Handle AI response
  useEffect(() => {
    if (data) {
      console.log("AI Response Data:", data);

      let botMessage;
      const responseData = data.data;

      if (responseData && responseData.type === 'audio' && responseData.audioUrl) {
        botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          type: 'audio',
          audioUrl: getFullAudioUrl(responseData.audioUrl)
        };
      } else if (responseData && responseData.type === 'text') {
        botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          type: 'text',
          content: responseData.content
        };
      } else if (responseData && responseData.data && responseData.data.length > 0) {
        // Fallback to Gradio format
        const audioData = responseData.data[0];
        if (audioData && (audioData.url || audioData.path || audioData.startsWith?.('data:audio'))) {
          botMessage = {
            id: Date.now() + 1,
            role: 'bot',
            type: 'audio',
            audioUrl: getFullAudioUrl(audioData.url || audioData.path || audioData)
          };
        } else {
          botMessage = {
            id: Date.now() + 1,
            role: 'bot',
            type: 'text',
            content: String(audioData || "Here's your generated music!")
          };
        }
      } else {
        botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          type: 'text',
          content: "I'm processing your request!"
        };
      }

      setMessages(prev => [...prev, botMessage]);
      setPendingMessageId(null);
    }
  }, [data]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setInput('');
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setRecordedAudio(null);
  };

  const sendVoiceMessage = () => {
    if (recordedAudio) {
      const userMessage = {
        id: Date.now(),
        role: 'user',
        type: 'audio',
        audioUrl: recordedAudio
      };
      setMessages(prev => [...prev, userMessage]);
      setPendingMessageId(userMessage.id);
      mutate("Voice message sent");
      setRecordedAudio(null);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', type: 'text', content: input };
    setMessages(prev => [...prev, userMessage]);
    setPendingMessageId(userMessage.id);
    setInput('');
    mutate(input);
  };

  const handleUpload = (audioUrl) => {
    if (!audioUrl) return;

    const generatedAudioPath = (() => {
      try {
        const parsedUrl = new URL(audioUrl);
        return parsedUrl.pathname.replace(/^\/+/, '');
      } catch {
        return audioUrl.startsWith('/') ? audioUrl.replace(/^\/+/, '') : audioUrl;
      }
    })();

    navigate({
      to: "/Create",
      state: {
        generatedMusic: generatedAudioPath,
      },
    });
  };

  const handleDownload = async (audioUrl) => {
    if (!audioUrl) return;
    try {
      const url = getFullAudioUrl(audioUrl);
      const resp = await fetch(url);
      const blob = await resp.blob();
      const mimeParts = blob.type.split('/');
      const ext = mimeParts[1] || 'webm';
      const filename = `generated-audio.${ext}`;
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

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-[120] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                <Sparkles className="text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase italic tracking-tight">AI Music Generator</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMinimize}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <MinusCircle size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'
                  }`}>
                  {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-indigo-400" />}
                </div>
                <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.type === 'audio' ? (
                    <div className={`w-full rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${msg.role === 'user' ? 'bg-indigo-600/10' : ''}`}>
                      <VoiceMessagePlayer
                        audioUrl={msg.audioUrl}
                        isUser={msg.role === 'user'}
                      />
                      {msg.role === 'bot' && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => handleUpload(msg.audioUrl)}
                            className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-300 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/20"
                          >
                            <Upload size={14} />
                            Upload audio
                          </button>
                          <button
                            onClick={() => handleDownload(msg.audioUrl)}
                            className="flex items-center gap-2 rounded-xl border border-slate-700/20 bg-slate-800/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300 transition-all hover:border-slate-600/40 hover:bg-slate-800/30"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none shadow-lg shadow-black/20'
                      }`}>
                      {msg.content}
                    </div>
                  )}
                  {msg.role === 'user' && msg.id === pendingMessageId && isPending && (
                    <div className="mt-2 self-start rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 shadow-lg shadow-black/20">
                      <div className="flex items-center gap-2">
                        <LoaderCircle size={13} className="animate-spin text-indigo-400" />
                        <span>Thinking…</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-900/50 border-t border-slate-800">
            <div className="mb-4 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/70 p-2">
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group flex min-w-[220px] flex-shrink-0 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-left text-sm text-slate-300 shadow-sm shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 transition-colors group-hover:bg-indigo-500/20">
                      {index % 2 === 0 ? '✨' : '🎵'}
                    </span>
                    <span className="leading-5">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recording UI */}
            {isRecording ? (
              <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-500/30 rounded-2xl">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-mono text-sm">{formatRecordingTime(recordingTime)}</span>
                <div className="flex-1" />
                <button
                  onClick={cancelRecording}
                  className="p-2 text-slate-500 hover:text-red-500 transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={stopRecording}
                  className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all"
                >
                  <Square size={18} fill="currentColor" />
                </button>
              </div>
            ) : recordedAudio ? (
              <div className="space-y-3">
                <VoiceMessagePlayer audioUrl={recordedAudio} isUser={true} />
                <div className="flex gap-2">
                  <button
                    onClick={cancelRecording}
                    className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendVoiceMessage}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-6 pr-24 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="p-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-all active:scale-90"
                  >
                    <Mic size={18} fill="currentColor" />
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 transition-all active:scale-90 shadow-lg shadow-indigo-600/20"
                  >
                    <Send size={18} fill="currentColor" />
                  </button>
                </div>
              </form>
            )}
            <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">
              SonicUI AI can make mistakes. Check important info.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
