import React from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { JarvisOrb } from './JarvisOrb';
import { Mic, X, MessageSquare, Calendar, Users, Laptop, ArrowRight } from 'lucide-react';

export const GlobalFloatingOrb: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    assistantState,
    startVoiceInput,
    isQuickAssistantOpen,
    setIsQuickAssistantOpen,
    sendMessage,
  } = useJarvis();

  // Hide on assistant screen itself or splash/onboarding
  if (currentScreen === 'assistant' || currentScreen === 'splash' || currentScreen === 'onboarding') {
    return null;
  }

  return (
    <>
      {/* Floating Action Orb Button (Bottom right) */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <button
          id="global-floating-orb-button"
          onClick={() => setIsQuickAssistantOpen(!isQuickAssistantOpen)}
          className="relative group p-1 rounded-full focus:outline-none transition-transform active:scale-95"
          title="JARVIS Quick Assistant"
        >
          {/* Pulsing aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-cyan-400 to-blue-600 blur-md opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all animate-pulse" />

          {/* Orb container */}
          <div className="relative w-12 h-12 rounded-full bg-[#0B0B18] border border-cyan-400/60 p-0.5 shadow-2xl flex items-center justify-center">
            <JarvisOrb state={assistantState} size="sm" />
          </div>
        </button>
      </div>

      {/* Quick Compact Assistant Drawer */}
      {isQuickAssistantOpen && (
        <div className="fixed bottom-36 md:bottom-20 right-5 z-50 w-80 sm:w-96 rounded-2xl bg-[#0F0F26] border border-purple-500/30 shadow-2xl backdrop-blur-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">JARVIS Quick Core</span>
            </div>
            <button
              onClick={() => setIsQuickAssistantOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-3">
            <p className="text-xs text-slate-300 font-medium mb-2">How can I assist you right now?</p>
            <div className="space-y-1.5">
              {[
                { text: 'Schedule meeting with Rahul', icon: <Calendar className="w-3.5 h-3.5 text-purple-400" /> },
                { text: "Give me today's team update", icon: <Users className="w-3.5 h-3.5 text-emerald-400" /> },
                { text: 'Open VS Code on laptop', icon: <Laptop className="w-3.5 h-3.5 text-blue-400" /> },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sendMessage(item.text);
                    setIsQuickAssistantOpen(false);
                    setCurrentScreen('assistant');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-purple-950/50 border border-white/5 hover:border-purple-500/30 text-xs text-slate-200 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setIsQuickAssistantOpen(false);
                startVoiceInput();
                setCurrentScreen('assistant');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold shadow-md active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" /> 🎙 Speak to JARVIS
            </button>
            <button
              onClick={() => {
                setIsQuickAssistantOpen(false);
                setCurrentScreen('assistant');
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300"
              title="Open full assistant chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
