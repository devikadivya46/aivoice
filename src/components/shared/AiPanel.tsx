import React from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { JarvisOrb } from './JarvisOrb';
import { JarvisWaveform } from './JarvisWaveform';
import { Mic, Sparkles, Zap, ArrowRight } from 'lucide-react';

export const AiPanel: React.FC = () => {
  const { assistantState, startVoiceInput, stopVoiceInput, statusText, waveformIntensity, setCurrentScreen, sendMessage } = useJarvis();

  const isListening = assistantState === 'listening';

  return (
    <aside
      id="desktop-ai-panel"
      className="hidden xl:flex flex-col w-72 lg:w-80 shrink-0 border-l border-white/8 bg-[#070714]/80 p-5 h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">JARVIS Neural Core</h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
          Online
        </span>
      </div>

      {/* Center Interactive Orb Visualizer */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <JarvisOrb state={assistantState} size="md" interactive onClick={() => (isListening ? stopVoiceInput() : startVoiceInput())} />
        <div className="text-center mt-4">
          <p className="text-xs font-semibold text-slate-200 capitalize">{assistantState} Mode</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[220px]">{statusText}</p>
        </div>
      </div>

      {/* Dynamic Waveform */}
      <div className="my-2">
        <JarvisWaveform state={assistantState} intensity={waveformIntensity} barsCount={22} className="h-10 py-1" />
      </div>

      {/* Voice Assistant Quick Action Button */}
      <button
        id="ai-panel-voice-btn"
        onClick={() => (isListening ? stopVoiceInput() : startVoiceInput())}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 my-3 ${
          isListening
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-600/30'
        }`}
      >
        <Mic className="w-4 h-4" />
        {isListening ? 'Stop Listening' : '🎙 Speak to JARVIS'}
      </button>

      {/* Proactive AI Insight Widget */}
      <div className="rounded-xl border border-purple-500/20 bg-[#121225]/70 p-3.5 my-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>PROACTIVE INSIGHT</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sprint velocity is tracking at <span className="text-emerald-400 font-semibold">82%</span>. Your next standup is in 15 mins.
        </p>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
          <button
            onClick={() => sendMessage("Give me today's team update")}
            className="text-[11px] text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1"
          >
            Ask JARVIS <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setCurrentScreen('assistant')}
            className="text-[11px] text-slate-400 hover:text-slate-200"
          >
            Open Chat
          </button>
        </div>
      </div>

      {/* Quick shortcuts list */}
      <div className="mt-auto pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Instant Prompts</p>
        <div className="space-y-1.5">
          {[
            'Schedule meeting with Rahul',
            "Show today's schedule",
            'Open VS Code on laptop',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              className="w-full text-left text-xs p-2 rounded-lg bg-white/5 hover:bg-purple-950/40 hover:text-purple-200 border border-transparent hover:border-purple-500/30 text-slate-300 transition-colors truncate"
            >
              • {prompt}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
