import React from 'react';
import { useJarvis, ScreenType } from '../../context/JarvisContext';
import { Bell, Search, Settings, ShieldCheck, Sparkles, Mic } from 'lucide-react';

interface TopBarProps {
  onOpenSearch?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSearch }) => {
  const {
    currentScreen,
    setCurrentScreen,
    unreadCount,
    user,
    assistantState,
    setIsCommandPaletteOpen,
    setIsVoiceCommandsModalOpen,
  } = useJarvis();

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 w-full border-b border-white/8 bg-[#05050D]/80 backdrop-blur-xl px-4 sm:px-6 py-3 transition-all"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Branding & Online Status */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 p-[1px] shadow-lg shadow-purple-600/30">
              <div className="w-full h-full rounded-[7px] bg-[#070716] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 transition-transform group-hover:rotate-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-purple-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                  JARVIS AI
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline-block">v3.4 Core</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-emerald-400">● Online & Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Command Palette Trigger Bar (Desktop/Tablet) */}
        <button
          id="cmd-palette-trigger"
          onClick={() => {
            if (onOpenSearch) onOpenSearch();
            setIsCommandPaletteOpen(true);
          }}
          className="hidden md:flex items-center justify-between w-72 lg:w-96 px-3.5 py-1.5 rounded-xl bg-[#0B0B18]/90 hover:bg-[#121225] border border-white/10 hover:border-purple-500/40 text-slate-400 text-xs transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <span>Ask JARVIS or search commands...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">⌘K</kbd>
        </button>

        {/* Right Actions: Voice Commands, Notifications, Settings, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Commands modal button */}
          <button
            id="topbar-voice-commands-btn"
            onClick={() => setIsVoiceCommandsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all shadow-sm group"
            title="Available Voice Commands (Shift + V)"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline-block">Voice Intents</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 rounded bg-purple-900/80 text-[9px] text-purple-300 font-mono">
              ⇧V
            </kbd>
          </button>

          {/* Mobile search button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-[#0B0B18] border border-white/10 text-slate-300 hover:text-white"
            title="Search commands"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications button */}
          <button
            id="topbar-notifications-btn"
            onClick={() => setCurrentScreen('notifications')}
            className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all ${
              currentScreen === 'notifications'
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                : 'bg-[#0B0B18] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-bold shadow-md shadow-rose-500/50 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings button */}
          <button
            id="topbar-settings-btn"
            onClick={() => setCurrentScreen('settings')}
            className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all ${
              currentScreen === 'settings'
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                : 'bg-[#0B0B18] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <button
            id="topbar-profile-btn"
            onClick={() => setCurrentScreen('settings')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-[#0B0B18] border border-white/10 hover:border-purple-500/40 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-500/40"
            />
            <span className="text-xs font-semibold text-slate-200 hidden lg:inline-block">
              {user.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
