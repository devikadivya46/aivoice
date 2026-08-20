import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Video,
  CheckSquare,
  Sparkles,
  Calendar,
  Zap,
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { productivityMetrics, teamSummary } = useJarvis();
  const [selectedMetric, setSelectedMetric] = useState<'productivity' | 'focus' | 'meetings' | 'tasks'>('productivity');

  return (
    <div id="analytics-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            NEURAL TELEMETRY & PRODUCTIVITY
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Productivity & Velocity Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Algorithmic breakdown of daily focus intervals, meeting ratios, and sprint velocity.
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard
          glowColor={selectedMetric === 'productivity' ? 'purple' : 'none'}
          variant="interactive"
          onClick={() => setSelectedMetric('productivity')}
          className={selectedMetric === 'productivity' ? 'border-purple-500/60 ring-1 ring-purple-500/40' : ''}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Productivity</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">87%</span>
            <p className="text-[11px] text-emerald-400 mt-0.5">↑ +15% over baseline</p>
          </div>
        </GlassCard>

        <GlassCard
          glowColor={selectedMetric === 'focus' ? 'cyan' : 'none'}
          variant="interactive"
          onClick={() => setSelectedMetric('focus')}
          className={selectedMetric === 'focus' ? 'border-cyan-500/60 ring-1 ring-cyan-500/40' : ''}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Focus Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">6h 24m</span>
            <p className="text-[11px] text-cyan-300 mt-0.5">Optimal cognitive window</p>
          </div>
        </GlassCard>

        <GlassCard
          glowColor={selectedMetric === 'meetings' ? 'blue' : 'none'}
          variant="interactive"
          onClick={() => setSelectedMetric('meetings')}
          className={selectedMetric === 'meetings' ? 'border-blue-500/60 ring-1 ring-blue-500/40' : ''}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Meeting Hours</span>
            <Video className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">2.2 hrs / day</span>
            <p className="text-[11px] text-blue-300 mt-0.5">Below 20% friction cap</p>
          </div>
        </GlassCard>

        <GlassCard
          glowColor={selectedMetric === 'tasks' ? 'magenta' : 'none'}
          variant="interactive"
          onClick={() => setSelectedMetric('tasks')}
          className={selectedMetric === 'tasks' ? 'border-pink-500/60 ring-1 ring-pink-500/40' : ''}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tasks Completed</span>
            <CheckSquare className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">56 Tasks</span>
            <p className="text-[11px] text-purple-300 mt-0.5">Sprint velocity 82%</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Interactive High-Contrast Chart Card */}
      <GlassCard glowColor="purple" className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-extrabold text-white">Weekly Velocity Spectrum</h3>
            <p className="text-xs text-slate-400">
              Showing {selectedMetric.toUpperCase()} trends across the current 7-day cycle.
            </p>
          </div>

          <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
            Aug 17 – Aug 23, 2026
          </span>
        </div>

        {/* Futuristic Bar Chart Visualizer */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 sm:h-64 px-2 sm:px-4">
            {productivityMetrics.map((item, idx) => {
              let value = item.productivityScore;
              let maxVal = 100;
              let suffix = '%';

              if (selectedMetric === 'focus') {
                value = item.focusHours;
                maxVal = 8;
                suffix = 'h';
              } else if (selectedMetric === 'meetings') {
                value = item.meetingHours;
                maxVal = 4;
                suffix = 'h';
              } else if (selectedMetric === 'tasks') {
                value = item.tasksCompleted;
                maxVal = 16;
                suffix = ' tasks';
              }

              const heightPercent = Math.min(100, Math.max(15, (value / maxVal) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {value}
                    {suffix}
                  </span>

                  {/* The Bar */}
                  <div className="w-full max-w-[38px] rounded-t-xl bg-[#070716] p-1 border border-white/5 h-full flex flex-col justify-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-purple-700 via-blue-600 to-cyan-400 group-hover:from-purple-500 group-hover:to-cyan-300 transition-all duration-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* AI Performance Synthesis */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#121225] via-[#0E0E22] to-[#070714] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-cyan-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
              JARVIS SYNTHESIS RECOMMENDATION
            </h4>
            <p className="text-sm font-semibold text-white mt-0.5">
              Thursday produced the highest productivity surge (92%) due to a 7.1h uninterrupted deep work block.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              JARVIS has blocked tomorrow 2:00 PM – 3:30 PM for deep architecture work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
