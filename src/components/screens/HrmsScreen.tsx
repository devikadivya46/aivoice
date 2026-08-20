import React from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const HrmsScreen: React.FC = () => {
  const { teamSummary, employees, sendMessage, setCurrentScreen } = useJarvis();

  return (
    <div id="hrms-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              HUMAN RESOURCE & SPRINT VELOCITY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            HRMS & Team Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time workforce intelligence, employee metrics, and bottleneck diagnosis.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sendMessage("Give me today's team update");
            setCurrentScreen('assistant');
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Ask JARVIS Team Summary</span>
        </button>
      </div>

      {/* TEAM OVERVIEW METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard glowColor="purple">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Members</span>
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30">
              <UserCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {teamSummary.activeCount}
            </span>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">● Fully Deployed</p>
          </div>
        </GlassCard>

        <GlassCard glowColor="cyan">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">On Leave (PTO)</span>
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {teamSummary.onLeaveCount}
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Sara Chen (Returns Tomorrow)</p>
          </div>
        </GlassCard>

        <GlassCard glowColor="magenta">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Overdue Tasks</span>
            <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-300">
              {teamSummary.overdueCount}
            </span>
            <p className="text-[11px] text-rose-400 font-medium mt-0.5">Requires rebalancing</p>
          </div>
        </GlassCard>

        <GlassCard glowColor="blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sprint Completion</span>
            <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {teamSummary.sprintCompletion}%
            </span>
            <p className="text-[11px] text-cyan-300 font-medium mt-0.5">Sprint 14 On Track</p>
          </div>
        </GlassCard>
      </div>

      {/* JARVIS TEAM UPDATE HERO CARD */}
      <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-[#150F2E] via-[#0E0E22] to-[#070714] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-extrabold tracking-wider text-purple-300 uppercase font-mono">
              JARVIS TEAM UPDATE • ENGINEERING SPRINT
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200">
            Sprint 14
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center sm:text-left">
          <div className="bg-[#070714] p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400">Sprint Completion</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{teamSummary.sprintCompletion}%</p>
          </div>
          <div className="bg-[#070714] p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400">Tasks Completed</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{teamSummary.tasksCompleted}</p>
          </div>
          <div className="bg-[#070714] p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400">Pending Tasks</span>
            <p className="text-xl font-extrabold text-cyan-400 mt-0.5">{teamSummary.tasksPending}</p>
          </div>
          <div className="bg-[#070714] p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400">Overdue Tasks</span>
            <p className="text-xl font-extrabold text-rose-400 mt-0.5">{teamSummary.tasksOverdue}</p>
          </div>
        </div>

        {/* AI Bottleneck Insight */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-purple-900/60 text-purple-300 shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider font-mono">
              JARVIS Root Cause Insight
            </span>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
              "{teamSummary.bottleneckInsight}"
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">Next review: Today 4:30 PM (HR Review & Retro)</span>
          <button
            onClick={() => setCurrentScreen('tasks')}
            className="flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200 font-bold"
          >
            View Sprint Backlog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* EMPLOYEE CARDS GRID */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Core Engineering Team ({employees.length} Engineers)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((emp) => (
            <GlassCard key={emp.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/30"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0B0B18] ${
                        emp.status === 'online'
                          ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                          : emp.status === 'in_meeting'
                          ? 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]'
                          : 'bg-amber-500'
                      }`}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white">{emp.name}</h4>
                    <p className="text-xs text-purple-300 font-medium">{emp.role}</p>
                    <span className="text-[10px] text-slate-400 capitalize">
                      ● {emp.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded-lg">
                  {emp.performanceScore}% Score
                </span>
              </div>

              {/* Task progress & attendance */}
              <div className="grid grid-cols-3 gap-2 bg-[#070714] p-2.5 rounded-xl border border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Tasks</span>
                  <p className="font-bold text-white mt-0.5">
                    {emp.tasksCompleted} / {emp.totalTasks}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Performance</span>
                  <p className="font-bold text-purple-300 mt-0.5">{emp.performanceScore}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Attendance</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{emp.attendanceRate}%</p>
                </div>
              </div>

              {emp.currentTask && (
                <p className="text-[11px] text-slate-400 truncate">
                  <strong className="text-slate-300">Active Task:</strong> {emp.currentTask}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
