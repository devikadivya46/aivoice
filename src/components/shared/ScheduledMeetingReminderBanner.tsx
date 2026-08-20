import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJarvis } from '../../context/JarvisContext';
import {
  Video,
  Clock,
  Volume2,
  Mic,
  ArrowRight,
  X,
  Bell,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const ScheduledMeetingReminderBanner: React.FC = () => {
  const {
    activeMeetingReminder,
    attendMeeting,
    snoozeMeetingReminder,
    dismissMeetingReminder,
    replayMeetingVoiceReminder,
    startVoiceInput,
    assistantState,
  } = useJarvis();

  if (!activeMeetingReminder) return null;

  const { meeting, minutesRemaining } = activeMeetingReminder;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="scheduled-meeting-reminder-hud"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0B0B1E]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-4 sm:p-5 text-white">
          {/* Neon animated glow beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-[11px] font-mono font-bold tracking-wider text-rose-300 uppercase">
                <Bell className="w-3 h-3 animate-bounce" />
                Scheduled Meeting Reminder
              </div>
              <span className="text-xs text-cyan-300 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                {minutesRemaining <= 0 ? 'Starting Now' : `Starts in ${minutesRemaining} min`}
              </span>
            </div>

            <button
              onClick={dismissMeetingReminder}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss reminder"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Meeting Info Core Card */}
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-semibold text-white tracking-tight">{meeting.title}</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[11px] font-medium text-cyan-300">
                  <Video className="w-3 h-3" />
                  {meeting.platform}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-3">
                <span className="text-cyan-200 font-mono">{meeting.time}</span>
                <span>•</span>
                <span className="text-slate-400">{meeting.duration}</span>
                {meeting.agenda && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400 truncate max-w-[200px]" title={meeting.agenda}>
                      {meeting.agenda}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Participants list */}
            {meeting.participants && meeting.participants.length > 0 && (
              <div className="flex items-center gap-1.5 self-start sm:self-center">
                <div className="flex -space-x-2 overflow-hidden">
                  {meeting.participants.slice(0, 3).map((p, i) => (
                    <img
                      key={i}
                      src={p.avatar}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0B0B1E] object-cover"
                      title={p.name}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 ml-1">
                  +{meeting.participants.length} attendees
                </span>
              </div>
            )}
          </div>

          {/* Voice Prompt Announcement banner */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 mb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px]">
                JARVIS Voice Reminder is Active. Say <strong className="text-cyan-300">"Join meeting"</strong> or click Attend.
              </span>
            </div>
            <button
              onClick={replayMeetingVoiceReminder}
              className="text-[10px] uppercase font-bold text-cyan-300 hover:text-cyan-200 underline decoration-cyan-400 flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3" />
              Replay Voice
            </button>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                id="btn-attend-meeting-now"
                onClick={() => attendMeeting(meeting.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95"
              >
                <Video className="w-3.5 h-3.5" />
                Attend & Join Meeting
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => startVoiceInput()}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono ${
                  assistantState === 'listening'
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
                }`}
                title="Speak voice command"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Speak</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => snoozeMeetingReminder(5)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-colors font-mono flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Snooze 5m
              </button>

              <button
                onClick={dismissMeetingReminder}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
