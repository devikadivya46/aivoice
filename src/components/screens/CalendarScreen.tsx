import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import { CreateEventModal } from './CreateEventModal';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  MapPin,
  AlertTriangle,
  Check,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const {
    events,
    deleteEvent,
    resolveConflict,
    joinMeeting,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
  } = useJarvis();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(20); // 20th August

  const daysOfWeek = [
    { day: 'Mon', date: 17 },
    { day: 'Tue', date: 18 },
    { day: 'Wed', date: 19 },
    { day: 'Thu', date: 20 },
    { day: 'Fri', date: 21 },
    { day: 'Sat', date: 22 },
    { day: 'Sun', date: 23 },
  ];

  const conflictEvent = events.find((e) => e.isConflict);

  return (
    <div id="calendar-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              TIME ARCHITECTURE & AGENDA
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Calendar & Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Autonomous schedule optimization and smart conflict arbitration.
          </p>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-2">
          {/* Day / Week / Month Toggle */}
          <div className="flex p-1 rounded-xl bg-[#0B0B18] border border-white/10 text-xs font-semibold">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            id="add-calendar-block-btn"
            onClick={() => setIsCreateEventModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Block</span>
          </button>
        </div>
      </div>

      {/* Date Selector Row */}
      <GlassCard className="p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <CalendarIcon className="w-4 h-4 text-purple-400" />
            <span>August 2026</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1 rounded-lg hover:bg-white/10">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg hover:bg-white/10">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center">
          {daysOfWeek.map((item) => {
            const isSelected = selectedDate === item.date;
            return (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center py-2.5 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-105 border border-purple-300/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  {item.day}
                </span>
                <span className="text-base sm:text-lg font-extrabold mt-0.5">{item.date}</span>
                {item.date === 20 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Smart Conflict Banner */}
      {conflictEvent && (
        <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-r from-[#1C1204] via-[#150F22] to-[#0A0A18] p-5 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>SMART CONFLICT RESOLUTION</span>
          </div>

          <p className="text-sm font-semibold text-white">
            Your 4:00 PM meeting (<span className="text-purple-300">{conflictEvent.title}</span>) conflicts with another scheduled session.
          </p>

          <p className="text-xs text-slate-300">
            JARVIS analyzed participant availability and recommends moving to:{' '}
            <span className="text-emerald-400 font-bold font-mono">
              {conflictEvent.suggestedSlot || '04:30 PM – 05:30 PM'}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => resolveConflict(conflictEvent.id, conflictEvent.suggestedSlot || '04:30 PM – 05:30 PM')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" /> Accept 4:30 PM
            </button>
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10"
            >
              Choose Another
            </button>
            <button
              onClick={() => resolveConflict(conflictEvent.id, '04:00 PM – 05:00 PM')}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs"
            >
              Keep Original
            </button>
          </div>
        </div>
      )}

      {/* Schedule Blocks Timeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Scheduled Blocks ({events.length} Events)
        </h3>

        <div className="space-y-3">
          {events.map((evt) => (
            <GlassCard
              key={evt.id}
              glowColor={evt.isConflict ? 'magenta' : 'purple'}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                {/* Time Badge */}
                <div className="flex flex-col items-center justify-center w-20 sm:w-24 p-2.5 rounded-xl bg-[#070714] border border-purple-500/20 text-center shrink-0">
                  <span className="text-xs font-bold text-white font-mono">{evt.startTime}</span>
                  <span className="text-[10px] text-slate-400">{evt.endTime}</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-white">{evt.title}</h4>
                    {evt.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/70 text-purple-300 border border-purple-500/30 uppercase font-semibold">
                        {evt.category.replace('_', ' ')}
                      </span>
                    )}
                    {evt.isConflict && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                        Conflict
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-1">{evt.description}</p>

                  {/* Participants & Location */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2.5">
                    {evt.platform && (
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Video className="w-3.5 h-3.5" />
                        {evt.platform}
                      </span>
                    )}
                    {evt.location && !evt.platform && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {evt.location}
                      </span>
                    )}
                    {evt.participants && evt.participants.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        {evt.participants.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {evt.meetLink && (
                  <button
                    onClick={() => joinMeeting(evt.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meet</span>
                  </button>
                )}

                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="p-2 rounded-xl hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 text-slate-500 hover:text-rose-300 transition-colors"
                  title="Remove block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />
    </div>
  );
};
