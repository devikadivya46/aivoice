import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { JarvisWaveform } from './JarvisWaveform';

interface VoiceInputProps {
  onSendMessage?: (text: string) => void;
  showSuggestions?: boolean;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onSendMessage,
  showSuggestions = true,
  className = '',
}) => {
  const { assistantState, startVoiceInput, stopVoiceInput, sendMessage, statusText, waveformIntensity } = useJarvis();
  const [inputText, setInputText] = useState('');

  const isListening = assistantState === 'listening';

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    if (onSendMessage) {
      onSendMessage(text);
    } else {
      sendMessage(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  const suggestions = [
    'Schedule meeting with Rahul tomorrow at 3 PM',
    "Give me today's team update",
    'Open VS Code on my laptop',
    "What's on my calendar today?",
    'Prepare my team update',
  ];

  return (
    <div id="voice-input-container" className={`w-full ${className}`}>
      {/* Quick Suggestion Pills */}
      {showSuggestions && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 shrink-0 px-1">
            <Sparkles className="w-3 h-3" /> Quick:
          </div>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(suggestion);
                sendMessage(suggestion);
              }}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#121225]/80 hover:bg-purple-950/60 border border-purple-500/20 hover:border-purple-400/50 text-slate-300 hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Waveform when listening or speaking */}
      {isListening && (
        <div className="mb-2 p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
          <span className="text-xs text-purple-300 flex items-center gap-1.5 font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {statusText}
          </span>
          <JarvisWaveform state={assistantState} intensity={waveformIntensity} barsCount={16} className="h-6 py-0" />
        </div>
      )}

      {/* Input Bar */}
      <div className="relative flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#0B0B18]/90 border border-purple-500/25 shadow-xl backdrop-blur-xl focus-within:border-purple-500/60 transition-all">
        {/* Microphone Button */}
        <button
          id="mic-button"
          onClick={handleMicToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 active:scale-90 ${
            isListening
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 hover:border-purple-400/60'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          id="jarvis-text-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to voice...' : 'Type or speak to JARVIS...'}
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />

        {/* Send Button */}
        <button
          id="send-button"
          onClick={handleSend}
          disabled={!inputText.trim() && !isListening}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 active:scale-95 ${
            inputText.trim()
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md shadow-purple-500/30'
              : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
