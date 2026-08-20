import React, { useState } from 'react';
import { useJarvis, ScreenType } from '../../context/JarvisContext';
import { Search, Sparkles, Calendar, CheckSquare, Laptop, Video, Users, X, ArrowRight } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentScreen,
    sendMessage,
    startVoiceInput,
  } = useJarvis();
  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    {
      label: 'Ask JARVIS anything...',
      desc: 'Natural language query or voice command',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (query.trim()) sendMessage(query);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      label: 'Schedule a meeting with Rahul tomorrow at 3 PM',
      desc: 'Auto-checks calendar and generates Google Meet',
      icon: <Calendar className="w-4 h-4 text-purple-400" />,
      action: () => {
        sendMessage('Schedule a meeting with Rahul tomorrow at 3 PM');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      label: "Give me today's team update",
      desc: 'Retrieves 82% sprint status, blockers, and attendance',
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      action: () => {
        sendMessage("Give me today's team update");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      label: 'Open VS Code on my laptop',
      desc: 'Dispatches remote execution daemon RPC',
      icon: <Laptop className="w-4 h-4 text-blue-400" />,
      action: () => {
        sendMessage('Open VS Code on my laptop');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      label: 'Go to Calendar & Timeline',
      desc: 'View smart conflict resolution & scheduled blocks',
      icon: <Calendar className="w-4 h-4 text-slate-300" />,
      action: () => {
        setCurrentScreen('calendar');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      label: 'Go to Tasks & AI Delegation',
      desc: 'Review high-priority milestones and delegation pipeline',
      icon: <CheckSquare className="w-4 h-4 text-slate-300" />,
      action: () => {
        setCurrentScreen('tasks');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      label: 'Go to Live Meetings',
      desc: 'Join Google Meet or view agenda breakdown',
      icon: <Video className="w-4 h-4 text-slate-300" />,
      action: () => {
        setCurrentScreen('meetings');
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = quickActions.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0E0E22] border border-purple-500/30 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-purple-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                sendMessage(query);
                setIsCommandPaletteOpen(false);
              } else if (e.key === 'Escape') {
                setIsCommandPaletteOpen(false);
              }
            }}
            placeholder="Ask JARVIS or type a command..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-400 font-mono">ESC</kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-950/40 border border-transparent hover:border-purple-500/30 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-900/40 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-purple-200">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-t border-white/5 text-[11px] text-slate-400">
          <span>Press ↵ to run command</span>
          <button
            onClick={() => {
              setIsCommandPaletteOpen(false);
              startVoiceInput();
            }}
            className="flex items-center gap-1.5 text-purple-300 hover:text-purple-200 font-semibold"
          >
            🎙 Voice Command
          </button>
        </div>
      </div>
    </div>
  );
};
