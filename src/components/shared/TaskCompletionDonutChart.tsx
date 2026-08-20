import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Task } from '../../types';
import { GlassCard } from './GlassCard';
import { CheckCircle2, Clock, AlertCircle, Calendar, Sparkles, Filter } from 'lucide-react';

interface TaskCompletionDonutChartProps {
  tasks: Task[];
}

export const TaskCompletionDonutChart: React.FC<TaskCompletionDonutChartProps> = ({ tasks }) => {
  const [viewMode, setViewMode] = useState<'status' | 'category'>('status');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const todayTasks = tasks.filter((t) => t.status === 'today').length;
  const upcomingTasks = tasks.filter((t) => t.status === 'upcoming').length;
  const overdueTasks = tasks.filter((t) => t.status === 'overdue').length;
  const pendingTasks = todayTasks + upcomingTasks + overdueTasks;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status data for Donut Chart
  const statusData = [
    { name: 'Completed', value: completedTasks, color: '#10B981', glow: 'rgba(16,185,129,0.5)' },
    { name: 'Today Active', value: todayTasks, color: '#8B5CF6', glow: 'rgba(139,92,246,0.5)' },
    { name: 'Upcoming', value: upcomingTasks, color: '#06B6D4', glow: 'rgba(6,182,212,0.5)' },
    { name: 'Overdue', value: overdueTasks, color: '#F43F5E', glow: 'rgba(244,63,94,0.5)' },
  ].filter((d) => d.value > 0);

  // Category data
  const engineeringCount = tasks.filter((t) => t.category === 'Engineering').length;
  const productCount = tasks.filter((t) => t.category === 'Product').length;
  const operationsCount = tasks.filter((t) => t.category === 'Operations').length;
  const designCount = tasks.filter((t) => t.category === 'Design').length;

  const categoryData = [
    { name: 'Engineering', value: engineeringCount, color: '#06B6D4' },
    { name: 'Product', value: productCount, color: '#8B5CF6' },
    { name: 'Design', value: designCount, color: '#EC4899' },
    { name: 'Operations', value: operationsCount, color: '#F59E0B' },
  ].filter((d) => d.value > 0);

  const activeChartData = viewMode === 'status' ? statusData : categoryData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = totalTasks > 0 ? Math.round((data.value / totalTasks) * 100) : 0;
      return (
        <div className="p-3 rounded-xl bg-[#0F0F23] border border-white/20 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="text-xs font-bold text-white">{data.name}</p>
          </div>
          <p className="text-xs font-mono text-purple-300 mt-1">
            <strong>{data.value}</strong> tasks ({percent}% of total)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="task-completion-donut-chart" className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#121029] via-[#0E0D22] to-[#080816] p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-400 font-mono">
              VELOCITY & COMPLETION TELEMETRY
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono">
              Recharts Engine
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
            Task Completion & Distribution
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('status')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'status'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'category'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            By Category
          </button>
        </div>
      </div>

      {/* Main Chart + Legend Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-4">
        {/* Donut Chart Container (7 cols) */}
        <div className="md:col-span-7 relative flex items-center justify-center">
          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={activeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  animationDuration={800}
                >
                  {activeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center metric label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {completionPercentage}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                COMPLETED
              </span>
              <span className="text-[9px] text-purple-300 font-mono">
                {completedTasks}/{totalTasks} Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Legend & Breakdown Stats (5 cols) */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-white/5">
            {viewMode === 'status' ? 'Status Breakdown' : 'Category Allocation'}
          </div>

          <div className="space-y-2">
            {viewMode === 'status' ? (
              <>
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Completed</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-300">{completedTasks}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({completionPercentage}%)
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Today Active</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-purple-300">{todayTasks}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({totalTasks > 0 ? Math.round((todayTasks / totalTasks) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Upcoming</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-cyan-300">{upcomingTasks}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({totalTasks > 0 ? Math.round((upcomingTasks / totalTasks) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                {overdueTasks > 0 && (
                  <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-rose-300">Overdue Risk</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-rose-300">{overdueTasks}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              categoryData.map((cat) => (
                <div
                  key={cat.name}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-white">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-white">{cat.value}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({totalTasks > 0 ? Math.round((cat.value / totalTasks) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
