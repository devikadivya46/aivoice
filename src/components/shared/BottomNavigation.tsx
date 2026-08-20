import React from 'react';
import { useJarvis, ScreenType } from '../../context/JarvisContext';
import { Home, Calendar, CheckSquare, BarChart3, Mic, Sparkles } from 'lucide-react';
import { JarvisOrb } from './JarvisOrb';

export const BottomNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, assistantState, startVoiceInput } = useJarvis();

  return (
    <div
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05050D]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 pb-safe"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        {/* Home Tab */}
        <button
          id="nav-tab-home"
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 ${
            currentScreen === 'home' ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Calendar Tab */}
        <button
          id="nav-tab-calendar"
          onClick={() => setCurrentScreen('calendar')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 ${
            currentScreen === 'calendar' ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Calendar</span>
        </button>

        {/* Central Glowing Floating JARVIS ORB Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            id="nav-tab-jarvis-orb"
            onClick={() => {
              if (currentScreen !== 'assistant') {
                setCurrentScreen('assistant');
              } else {
                startVoiceInput();
              }
            }}
            className="relative flex items-center justify-center p-1 rounded-full group focus:outline-none"
            title="JARVIS Voice Assistant"
          >
            {/* Pulsing ring aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-cyan-400 to-blue-600 blur-md opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all animate-pulse" />
            
            {/* Glowing Orb */}
            <div className="relative w-14 h-14 rounded-full bg-[#0B0B18] border-2 border-cyan-400/80 p-0.5 shadow-[0_0_25px_rgba(139,92,246,0.6)] flex items-center justify-center overflow-hidden">
              <JarvisOrb state={assistantState} size="sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent flex items-center justify-center pointer-events-none">
                <Mic className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          </button>
          <span className="text-[10px] font-bold tracking-wider text-cyan-300 mt-0.5">JARVIS</span>
        </div>

        {/* Tasks Tab */}
        <button
          id="nav-tab-tasks"
          onClick={() => setCurrentScreen('tasks')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 ${
            currentScreen === 'tasks' ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px]">Tasks</span>
        </button>

        {/* Analytics Tab */}
        <button
          id="nav-tab-analytics"
          onClick={() => setCurrentScreen('analytics')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 py-1 ${
            currentScreen === 'analytics' ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Analytics</span>
        </button>
      </div>
    </div>
  );
};
