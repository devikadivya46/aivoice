import React from 'react';
import { useJarvis, ScreenType } from '../../context/JarvisContext';
import {
  Home,
  Bot,
  Calendar,
  Video,
  CheckSquare,
  Users,
  BarChart3,
  Laptop,
  Bell,
  Settings,
  Sparkles,
  Layers,
} from 'lucide-react';
import { JarvisOrb } from './JarvisOrb';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, unreadCount, assistantState } = useJarvis();

  const navItems: { screen: ScreenType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { screen: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { screen: 'assistant', label: 'JARVIS Voice & Chat', icon: <Bot className="w-4 h-4 text-cyan-300" /> },
    { screen: 'calendar', label: 'Calendar & Timeline', icon: <Calendar className="w-4 h-4" /> },
    { screen: 'meetings', label: 'Meetings & Meet', icon: <Video className="w-4 h-4" /> },
    { screen: 'tasks', label: 'Tasks & Delegation', icon: <CheckSquare className="w-4 h-4" /> },
    { screen: 'hrms', label: 'HRMS & Team', icon: <Users className="w-4 h-4" /> },
    { screen: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { screen: 'devices', label: 'My Devices', icon: <Laptop className="w-4 h-4" /> },
    { screen: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount },
    { screen: 'settings', label: 'Settings & Security', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-60 lg:w-64 shrink-0 border-r border-white/8 bg-[#070714]/90 p-4 h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto"
    >
      {/* Mini Assistant Status Card in Sidebar */}
      <div
        onClick={() => setCurrentScreen('assistant')}
        className="mb-5 p-3 rounded-2xl bg-gradient-to-br from-[#121225] to-[#0B0B18] border border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all shadow-lg group"
      >
        <div className="flex items-center gap-3">
          <JarvisOrb state={assistantState} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-100">JARVIS Neural</span>
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-emerald-400 font-medium truncate">● Ready for voice</p>
          </div>
        </div>
      </div>

      {/* Main Navigation links */}
      <div className="space-y-1 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              id={`sidebar-link-${item.screen}`}
              onClick={() => setCurrentScreen(item.screen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-purple-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/80 text-white text-[10px] font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Workspace indicator */}
      <div className="pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate">Quantum Tech AI</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
        </div>
      </div>
    </aside>
  );
};
