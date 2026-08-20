import React, { useState, useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import {
  Sparkles,
  X,
  Send,
  Mic,
  CheckCircle2,
  Clock,
  Calendar,
  UserCheck,
  RotateCcw,
  Zap,
  Bot,
  Laptop,
} from 'lucide-react';

export const FollowUpPromptBar: React.FC = () => {
  const { activeFollowUp, dismissFollowUp, respondToFollowUp, startVoiceInput, assistantState, statusText } = useJarvis();
  const [customReply, setCustomReply] = useState('');
  const [progressPercent, setProgressPercent] = useState(100);

  useEffect(() => {
    if (!activeFollowUp) return;

    const duration = activeFollowUp.autoDismissTimeout || 18000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgressPercent(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        dismissFollowUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeFollowUp, dismissFollowUp]);

  if (!activeFollowUp) return null;

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReply.trim()) return;
    const text = customReply.trim();
    setCustomReply('');
    await respondToFollowUp(text);
  };

  const getOptionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'notify':
      case 'user':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'time':
      case 'clock':
        return <Clock className="w-3.5 h-3.5" />;
      case 'calendar':
      case 'schedule':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'undo':
        return <RotateCcw className="w-3.5 h-3.5" />;
      case 'device':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'ai':
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      id="jarvis-follow-up-bar"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-20 z-50 md:max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/50 bg-[#0B0B1E]/95 p-4 shadow-[0_12px_40px_rgba(147,51,234,0.35)] backdrop-blur-2xl">
        {/* Glow ambient accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500" />
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-cyan-400/80 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Top Header & Trigger Tag */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-200 to-white font-mono uppercase">
                JARVIS Proactive Follow-up
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 font-semibold">
                {activeFollowUp.triggerAction}
              </span>
            </div>
          </div>

          <button
            onClick={dismissFollowUp}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss question"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Follow-up Question Body */}
        <div className="mb-3 pl-1">
          <p className="text-sm font-semibold text-white leading-relaxed">
            {activeFollowUp.question}
          </p>
        </div>

        {/* Interactive Quick-Action Buttons */}
        {activeFollowUp.options.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {activeFollowUp.options.map((opt) => {
              const isPrimary = opt.variant === 'primary' || opt.variant === 'accent';
              const isDanger = opt.variant === 'danger';

              return (
                <button
                  key={opt.id}
                  onClick={() => respondToFollowUp(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${
                    isDanger
                      ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200'
                      : isPrimary
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border border-cyan-400/30'
                      : 'bg-white/10 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/40 text-slate-200 hover:text-white'
                  }`}
                >
                  {getOptionIcon(opt.icon)}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Voice Listening indicator banner if active */}
        {assistantState === 'listening' && (
          <div className="mb-2 py-1.5 px-3 rounded-xl bg-purple-900/60 border border-cyan-400/50 flex items-center justify-between text-xs text-cyan-300 font-mono animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Listening for your voice response...
            </span>
            <span className="text-[10px] text-purple-200 uppercase font-bold">Say your choice</span>
          </div>
        )}

        {/* Custom Quick Reply Input & Voice Prompt */}
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1 border-t border-white/10">
          <input
            type="text"
            value={customReply}
            onChange={(e) => setCustomReply(e.target.value)}
            placeholder="Type or speak follow-up (e.g. 'Notify lead', 'Log time', 'Undo')..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
          />

          <button
            type="button"
            onClick={() => startVoiceInput()}
            className={`p-1.5 rounded-xl border transition-all ${
              assistantState === 'listening'
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-pulse'
                : 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/30 text-cyan-300 hover:text-white'
            }`}
            title="Speak Voice Reply"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <button
            type="submit"
            disabled={!customReply.trim()}
            className="flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white disabled:opacity-40 transition-opacity"
            title="Send response"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
