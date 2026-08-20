import React from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import { WeatherForecastCard } from '../shared/WeatherForecastCard';
import {
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Users,
  CheckSquare,
  Plus,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    user,
    events,
    meetings,
    tasks,
    teamSummary,
    setCurrentScreen,
    joinMeeting,
    resolveConflict,
    sendMessage,
    setIsCreateEventModalOpen,
  } = useJarvis();

  // Find next upcoming meeting
  const nextMeeting = meetings.find((m) => m.status === 'upcoming') || meetings[0];
  const conflictEvent = events.find((e) => e.isConflict);

  return (
    <div id="home-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Greeting & Daily Briefing Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              DAILY INTELLIGENCE BRIEFING
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
              ● Live Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good Afternoon, {user.name}.
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Here's what's happening across your schedule, meetings, and team sprint.
          </p>
        </div>

        {/* Quick Voice / Prompt Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateEventModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>New Event</span>
          </button>
          <button
            onClick={() => {
              sendMessage('What is my schedule today?');
              setCurrentScreen('assistant');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Ask JARVIS</span>
          </button>
        </div>
      </div>

      {/* Real-time Weather Forecast Summary (Google Search Grounding) */}
      <WeatherForecastCard initialLocation="San Francisco, CA" />

      {/* Top Productivity & Velocity Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard glowColor="purple" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Productivity Score</span>
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">87%</span>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">↑ 12% vs last week</p>
          </div>
        </GlassCard>

        <GlassCard glowColor="cyan" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Focus Hours</span>
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">6h 24m</span>
            <p className="text-[11px] text-cyan-400 font-medium mt-0.5">Deep Work Active</p>
          </div>
        </GlassCard>

        <GlassCard glowColor="blue" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Meetings</span>
            <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30">
              <Video className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">4 Scheduled</span>
            <p className="text-[11px] text-blue-400 font-medium mt-0.5">Next in 15 mins</p>
          </div>
        </GlassCard>

        <GlassCard glowColor="magenta" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sprint Tasks</span>
            <div className="p-1.5 rounded-lg bg-pink-950/60 border border-pink-500/30">
              <CheckSquare className="w-4 h-4 text-pink-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{teamSummary.sprintCompletion}%</span>
            <p className="text-[11px] text-purple-300 font-medium mt-0.5">18 Completed / 5 Pending</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: NEXT MEETING CARD + AI INSIGHT CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Meeting Card (Futuristic, glowing, 2 cols on lg) */}
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl border border-purple-500/40 bg-gradient-to-br from-[#121225] via-[#0D0D1F] to-[#070714] p-5 sm:p-6 shadow-2xl overflow-hidden group">
            {/* Ambient background aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-cyan-500/15 to-transparent blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-radial from-purple-600/20 to-transparent blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-extrabold tracking-widest text-cyan-300 uppercase font-mono">
                    NEXT MEETING
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200">
                  Google Meet
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {nextMeeting?.title || 'Team Standup'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                    <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
                      <Clock className="w-4 h-4 text-purple-400" />
                      10:00 AM – 10:30 AM
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      Google Meet
                    </span>
                  </div>
                </div>

                {/* Participant Avatars */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {nextMeeting?.participants?.slice(0, 4).map((p, idx) => (
                      <img
                        key={idx}
                        src={p.avatar}
                        alt={p.name}
                        title={p.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0B18] object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">+3 others</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  id="home-join-meet-btn"
                  onClick={() => joinMeeting(nextMeeting.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('meetings')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="lg:col-span-1">
          <GlassCard glowColor="purple" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-wider font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>✦ JARVIS INSIGHT</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">AI Synthesized</span>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">
                Your productivity is <span className="text-emerald-400">87% higher</span> than yesterday.
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                You have 2 high-priority tasks due before 5:00 PM and 1 conflict flagged for the 4:00 PM HR review.
              </p>

              {/* Mini animated velocity metric */}
              <div className="my-3 p-2.5 rounded-xl bg-[#070714] border border-purple-500/20">
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Sprint Velocity</span>
                  <span className="text-purple-300 font-bold">82% On Track</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 w-[82%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentScreen('analytics')}
                className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1"
              >
                Review <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  sendMessage("Give me today's team update");
                  setCurrentScreen('assistant');
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-xs text-purple-200 font-semibold transition-colors"
              >
                Ask JARVIS
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Smart Conflict Resolution Banner (if conflict exists) */}
      {conflictEvent && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#1E1205] to-[#121225] p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                SMART CONFLICT RESOLUTION
              </h4>
              <p className="text-sm font-semibold text-white mt-0.5">
                Your 4:00 PM meeting ({conflictEvent.title}) conflicts with another event.
              </p>
              <p className="text-xs text-slate-300 mt-1">
                JARVIS recommends shifting to:{' '}
                <span className="text-emerald-400 font-semibold">{conflictEvent.suggestedSlot || '04:30 PM'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => resolveConflict(conflictEvent.id, conflictEvent.suggestedSlot || '04:30 PM – 05:30 PM')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Accept 4:30 PM
            </button>
            <button
              onClick={() => setCurrentScreen('calendar')}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10"
            >
              Choose Another
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S SCHEDULE TIMELINE & RECENT TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                TODAY'S SCHEDULE & TIMELINE
              </h3>
            </div>
            <button
              onClick={() => setCurrentScreen('calendar')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              Full Calendar <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <GlassCard className="divide-y divide-white/5 p-2 sm:p-3">
            {events.map((evt, idx) => (
              <div
                key={evt.id}
                className="flex items-start sm:items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors gap-3"
              >
                {/* Time & Timeline Indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-20 sm:w-24 text-right shrink-0">
                    <span className="text-xs font-bold text-slate-200">{evt.startTime}</span>
                    <p className="text-[10px] text-slate-500">{evt.endTime}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-3 h-3 rounded-full border-2 ${
                        evt.isConflict
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                          : evt.category === 'standup'
                          ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                          : evt.category === 'deep_work'
                          ? 'bg-purple-500 border-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                          : 'bg-slate-400 border-slate-300'
                      }`}
                    />
                    {idx < events.length - 1 && <div className="w-0.5 h-6 bg-white/10 my-0.5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-white">{evt.title}</p>
                      {evt.platform && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-500/30">
                          {evt.platform}
                        </span>
                      )}
                      {evt.isConflict && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold">
                          Conflict Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{evt.description || evt.location}</p>
                  </div>
                </div>

                {evt.meetLink && (
                  <button
                    onClick={() => joinMeeting(evt.id)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Join</span>
                  </button>
                )}
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Actionable Tasks List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                HIGH PRIORITY TASKS
              </h3>
            </div>
            <button
              onClick={() => setCurrentScreen('tasks')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              All Tasks
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => (
              <GlassCard key={task.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-white">{task.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{task.dueDate}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      task.priority === 'high'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                        : 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Progress</span>
                    <span className="font-mono text-purple-300">{task.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Quick Delegation CTA */}
            <button
              onClick={() => {
                sendMessage('Prepare my team update');
                setCurrentScreen('assistant');
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-800/60 hover:to-blue-800/60 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Delegate Team Update to JARVIS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
