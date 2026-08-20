import React, { useRef, useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { JarvisOrb } from '../shared/JarvisOrb';
import { JarvisWaveform } from '../shared/JarvisWaveform';
import { VoiceInput } from '../shared/VoiceInput';
import { AiActionCard } from '../shared/AiActionCard';
import { Sparkles, Trash2, Bot, User, Volume2, VolumeX, Terminal } from 'lucide-react';

export const AssistantScreen: React.FC = () => {
  const {
    assistantState,
    statusText,
    waveformIntensity,
    chatMessages,
    sendMessage,
    clearChatHistory,
    startVoiceInput,
    stopVoiceInput,
    voiceSettings,
    setVoiceSettings,
  } = useJarvis();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, assistantState]);

  const isListening = assistantState === 'listening';

  return (
    <div
      id="jarvis-assistant-screen"
      className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto animate-in fade-in duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30">
            <Bot className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-wide">JARVIS Assistant</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                Neural Quantum v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400">Your AI Assistant • ● Online</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setVoiceSettings((prev) => ({ ...prev, autoSpeak: !prev.autoSpeak }))
            }
            className={`p-2 rounded-xl border transition-colors ${
              voiceSettings.autoSpeak
                ? 'bg-purple-950/70 border-purple-500/40 text-purple-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={voiceSettings.autoSpeak ? 'Auto Voice Enabled' : 'Auto Voice Muted'}
          >
            {voiceSettings.autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={clearChatHistory}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/50 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Conversation & Orb Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1 scroll-smooth">
        {/* Futuristic Centerpiece Orb Hero (Sticky at top of stream or header) */}
        <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-b from-[#121225]/70 via-[#0B0B18]/60 to-transparent border border-purple-500/20 backdrop-blur-xl relative overflow-hidden my-2">
          {/* Animated Background Rays */}
          <div className="absolute inset-0 bg-radial from-purple-600/10 to-transparent blur-xl pointer-events-none" />

          <JarvisOrb
            state={assistantState}
            size="lg"
            interactive
            onClick={() => (isListening ? stopVoiceInput() : startVoiceInput())}
          />

          {/* Dynamic Status Text */}
          <div className="mt-4 text-center">
            <span
              className={`text-sm font-bold tracking-wide transition-colors ${
                assistantState === 'listening'
                  ? 'text-cyan-400'
                  : assistantState === 'thinking'
                  ? 'text-purple-300'
                  : assistantState === 'speaking'
                  ? 'text-blue-300'
                  : assistantState === 'executing'
                  ? 'text-amber-400'
                  : assistantState === 'success'
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }`}
            >
              {statusText}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isListening ? 'Speak now or tap the orb to stop' : 'Tap the orb or use the microphone to speak'}
            </p>
          </div>

          {/* Real-time Waveform */}
          <div className="w-full max-w-sm mt-3">
            <JarvisWaveform
              state={assistantState}
              intensity={waveformIntensity}
              barsCount={32}
              className="h-10"
            />
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="space-y-4 pt-2">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                {msg.sender === 'user' ? (
                  <>
                    <span>You</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    <User className="w-3 h-3 text-purple-400" />
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span className="font-semibold text-purple-300">JARVIS Core</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              {msg.sender === 'user' ? (
                <div className="max-w-[85%] sm:max-w-md rounded-2xl rounded-tr-xs bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white text-sm font-medium shadow-lg shadow-purple-600/20">
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              ) : (
                <div className="max-w-[90%] sm:max-w-xl rounded-2xl rounded-tl-xs bg-[#121225]/90 border border-purple-500/20 px-4 py-3.5 text-slate-100 text-sm shadow-xl backdrop-blur-md">
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Render Action Card if present */}
                  {msg.actionCard && (
                    <div className="mt-3">
                      <AiActionCard data={msg.actionCard} onExecuted={scrollToBottom} />
                    </div>
                  )}

                  {/* Render Proactive Follow-up Suggestions if present */}
                  {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-purple-500/20">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                          Suggested Follow-ups
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpSuggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(sug.query)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 hover:border-cyan-400/50 text-xs font-semibold text-purple-200 hover:text-white transition-all active:scale-95 text-left"
                          >
                            <span>{sug.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing / Thinking Indicator */}
          {(assistantState === 'thinking' || assistantState === 'executing') && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 rounded-2xl bg-[#121225]/80 border border-purple-500/30 px-4 py-2.5 text-xs text-purple-300 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono">{statusText}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Voice & Text Input */}
      <div className="pt-3 border-t border-white/10 shrink-0 bg-[#05050D]/80 backdrop-blur-md">
        <VoiceInput />
      </div>
    </div>
  );
};
