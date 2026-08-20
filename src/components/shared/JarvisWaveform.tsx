import React from 'react';
import { AssistantState } from '../../types';

interface JarvisWaveformProps {
  state?: AssistantState;
  intensity?: number;
  barsCount?: number;
  className?: string;
}

export const JarvisWaveform: React.FC<JarvisWaveformProps> = ({
  state = 'idle',
  intensity = 0.2,
  barsCount = 28,
  className = '',
}) => {
  // Generate bar heights dynamically
  const bars = Array.from({ length: barsCount }).map((_, i) => {
    // Symmetrical bell-curve wave pattern
    const mid = barsCount / 2;
    const distFromMid = Math.abs(i - mid) / mid;
    const baseCurve = Math.cos(distFromMid * (Math.PI / 2.2));

    let heightPercent = 15;
    if (state === 'speaking' || state === 'listening') {
      const dynamicJitter = Math.sin((i * 0.8) + (Date.now() / 150)) * 0.3 + 0.7;
      heightPercent = Math.min(100, Math.max(12, baseCurve * intensity * 100 * dynamicJitter));
    } else if (state === 'thinking' || state === 'executing') {
      const ripple = Math.sin((i * 0.5) - (Date.now() / 200)) * 0.4 + 0.6;
      heightPercent = Math.min(75, Math.max(10, baseCurve * 40 * ripple));
    } else {
      heightPercent = Math.max(8, baseCurve * 20);
    }

    return { id: i, height: heightPercent };
  });

  return (
    <div
      id="jarvis-waveform"
      className={`flex items-center justify-center gap-[3px] sm:gap-[4px] h-14 sm:h-16 px-4 py-2 select-none ${className}`}
    >
      {bars.map((bar, index) => {
        // Multi-gradient coloration: left is purple, middle is blue, right is cyan
        const fraction = index / barsCount;
        let colorClass = 'bg-gradient-to-t from-purple-600 via-blue-500 to-cyan-400';
        if (fraction < 0.33) {
          colorClass = 'bg-gradient-to-t from-purple-600 via-indigo-500 to-purple-400';
        } else if (fraction > 0.66) {
          colorClass = 'bg-gradient-to-t from-blue-600 via-cyan-400 to-teal-300';
        }

        return (
          <div
            key={bar.id}
            className={`w-[3px] sm:w-[4px] rounded-full transition-all duration-100 ease-out shadow-xs ${colorClass}`}
            style={{
              height: `${bar.height}%`,
              opacity: state === 'idle' ? 0.35 : 0.9,
              boxShadow: state === 'speaking' ? '0 0 8px rgba(34, 211, 238, 0.6)' : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
