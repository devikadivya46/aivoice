import React from 'react';
import { AssistantState } from '../../types';

interface JarvisOrbProps {
  state?: AssistantState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const JarvisOrb: React.FC<JarvisOrbProps> = ({
  state = 'idle',
  size = 'md',
  onClick,
  interactive = false,
  className = '',
}) => {
  // Dimensions
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-44 h-44',
    xl: 'w-64 h-64 sm:w-72 sm:h-72',
  };

  // Color schemas based on state
  const getStateColors = () => {
    switch (state) {
      case 'listening':
        return {
          glow: 'from-blue-500/80 via-cyan-400/60 to-purple-600/70',
          ring: 'border-cyan-400/80 shadow-[0_0_35px_rgba(34,211,238,0.7)]',
          core: 'from-cyan-300 via-blue-500 to-indigo-600',
          halo: 'rgba(34, 211, 238, 0.45)',
          pulseSpeed: 'animate-ping duration-1000',
        };
      case 'thinking':
        return {
          glow: 'from-purple-500/80 via-magenta-500/60 to-indigo-600/70',
          ring: 'border-purple-400/80 shadow-[0_0_35px_rgba(168,85,247,0.7)]',
          core: 'from-purple-300 via-fuchsia-500 to-indigo-700',
          halo: 'rgba(168, 85, 247, 0.45)',
          pulseSpeed: 'animate-spin duration-3000',
        };
      case 'speaking':
        return {
          glow: 'from-cyan-400/80 via-blue-500/70 to-purple-600/80',
          ring: 'border-blue-400/90 shadow-[0_0_40px_rgba(59,130,246,0.8)]',
          core: 'from-white via-cyan-400 to-blue-600',
          halo: 'rgba(59, 130, 246, 0.5)',
          pulseSpeed: 'animate-pulse duration-700',
        };
      case 'executing':
        return {
          glow: 'from-amber-400/80 via-purple-500/70 to-cyan-500/70',
          ring: 'border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.7)]',
          core: 'from-amber-200 via-purple-500 to-blue-600',
          halo: 'rgba(245, 158, 11, 0.4)',
          pulseSpeed: 'animate-spin duration-1500',
        };
      case 'success':
        return {
          glow: 'from-emerald-400/80 via-teal-500/60 to-cyan-500/70',
          ring: 'border-emerald-400/90 shadow-[0_0_40px_rgba(16,185,129,0.8)]',
          core: 'from-emerald-200 via-teal-400 to-cyan-600',
          halo: 'rgba(16, 185, 129, 0.5)',
          pulseSpeed: 'animate-pulse duration-1000',
        };
      case 'error':
        return {
          glow: 'from-rose-500/80 via-red-500/60 to-amber-600/70',
          ring: 'border-red-400/90 shadow-[0_0_40px_rgba(239,68,68,0.8)]',
          core: 'from-red-200 via-rose-500 to-red-700',
          halo: 'rgba(239, 68, 68, 0.5)',
          pulseSpeed: 'animate-bounce duration-500',
        };
      case 'idle':
      default:
        return {
          glow: 'from-purple-600/60 via-blue-600/40 to-indigo-900/50',
          ring: 'border-purple-500/40 shadow-[0_0_25px_rgba(139,92,246,0.4)]',
          core: 'from-purple-300 via-blue-500 to-indigo-800',
          halo: 'rgba(139, 92, 246, 0.25)',
          pulseSpeed: 'animate-pulse duration-3000',
        };
    }
  };

  const colors = getStateColors();

  return (
    <div
      id="jarvis-orb-container"
      onClick={onClick}
      className={`relative flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Outer ambient glow */}
      <div
        className={`absolute rounded-full transition-all duration-700 ${sizeMap[size]} scale-150 blur-2xl opacity-75`}
        style={{ background: colors.halo }}
      />

      {/* Rotating outer holographic orbital ring 1 */}
      <div
        className={`absolute rounded-full border border-dashed transition-all duration-700 ${
          sizeMap[size]
        } scale-125 ${
          state === 'thinking' ? 'animate-rotate-slow border-purple-400/60' : 'border-white/15'
        }`}
      />

      {/* Rotating outer holographic orbital ring 2 */}
      <div
        className={`absolute rounded-full border border-dotted transition-all duration-700 ${
          sizeMap[size]
        } scale-110 ${
          state === 'thinking' || state === 'executing'
            ? 'animate-rotate-reverse border-cyan-400/70'
            : 'border-white/10'
        }`}
      />

      {/* Middle pulsing aura */}
      <div
        className={`absolute rounded-full bg-gradient-to-tr ${colors.glow} ${sizeMap[size]} transition-all duration-500 ${
          interactive ? 'group-hover:scale-105' : ''
        } ${state === 'listening' ? 'scale-115' : 'scale-100'}`}
      />

      {/* High-energy Core Sphere */}
      <div
        className={`relative z-10 rounded-full bg-gradient-to-br ${colors.core} ${
          sizeMap[size]
        } p-[2px] shadow-2xl transition-all duration-500 ${colors.ring}`}
      >
        <div className="w-full h-full rounded-full bg-[#070716]/60 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {/* Inner plasma energy flares */}
          <div
            className={`w-3/4 h-3/4 rounded-full bg-gradient-to-tr ${colors.glow} blur-xs opacity-90 transition-all duration-500 ${
              state === 'speaking' ? 'scale-125 animate-pulse' : 'scale-90 animate-pulse-glow'
            }`}
          />
          {/* Sparkle center nucleus */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#fff]" />
        </div>
      </div>
    </div>
  );
};
