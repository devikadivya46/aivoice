import React, { useState } from 'react';
import { AIActionCardData } from '../../types';
import { useJarvis } from '../../context/JarvisContext';
import { Check, Calendar, Users, Video, Laptop, Sparkles, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiActionCardProps {
  data: AIActionCardData;
  onExecuted?: () => void;
}

export const AiActionCard: React.FC<AiActionCardProps> = ({ data, onExecuted }) => {
  const { addEvent, createMeeting, setCurrentScreen, resolveConflict } = useJarvis();
  const [status, setStatus] = useState<'pending' | 'executed' | 'cancelled'>(data.status || 'pending');

  const handlePrimaryAction = async () => {
    if (data.type === 'meeting_ready' && data.payload) {
      // Create meeting in real state
      await createMeeting({
        title: data.payload.title || 'Product Review',
        date: 'Tomorrow',
        time: `${data.payload.startTime || '03:00 PM'} – ${data.payload.endTime || '03:30 PM'}`,
        duration: '30 mins',
        platform: 'Google Meet',
        status: 'upcoming',
        meetUrl: 'https://meet.google.com/jrv-new-slot',
        participants: (data.payload.participants || ['Rahul Sharma', 'Priya Patel']).map((name: string) => ({
          name,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          role: 'Team Member',
        })),
        agenda: 'Sprint review and roadmap delivery.',
      });

      await addEvent({
        title: data.payload.title || 'Product Review',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        startTime: data.payload.startTime || '03:00 PM',
        endTime: data.payload.endTime || '03:30 PM',
        category: 'meeting',
        platform: 'Google Meet',
        meetLink: 'https://meet.google.com/jrv-new-slot',
        participants: data.payload.participants || ['Rahul Sharma', 'Priya Patel'],
        description: 'Auto-created via JARVIS natural conversation.',
      });

      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch {}

      setStatus('executed');
      if (onExecuted) onExecuted();
    } else if (data.type === 'team_update') {
      setCurrentScreen('hrms');
    } else if (data.type === 'device_command') {
      setCurrentScreen('devices');
    } else if (data.type === 'conflict_resolution') {
      if (data.payload?.eventId) {
        await resolveConflict(data.payload.eventId, data.payload.newTime || '04:30 PM – 05:30 PM');
      }
      setStatus('executed');
    } else {
      setStatus('executed');
    }
  };

  const handleSecondaryAction = () => {
    if (data.type === 'meeting_ready') {
      setCurrentScreen('calendar');
    } else if (data.type === 'team_update') {
      setCurrentScreen('tasks');
    } else {
      setStatus('cancelled');
    }
  };

  const getHeaderIcon = () => {
    switch (data.type) {
      case 'meeting_ready':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'team_update':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'device_command':
        return <Laptop className="w-4 h-4 text-blue-400" />;
      case 'conflict_resolution':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div
      id={`ai-action-card-${data.id}`}
      className="my-3 rounded-xl border border-purple-500/30 bg-[#121225]/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/30">
            {getHeaderIcon()}
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              {data.title}
            </h4>
            {data.subtitle && <p className="text-sm font-medium text-white">{data.subtitle}</p>}
          </div>
        </div>

        {status === 'executed' ? (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
            <Check className="w-3 h-3" /> Ready / Active
          </span>
        ) : status === 'cancelled' ? (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300">
            <X className="w-3 h-3" /> Dismissed
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-400/30">
            Action Pending
          </span>
        )}
      </div>

      {/* Card Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3.5">
        {data.details.map((item, idx) => (
          <div key={idx} className="flex flex-col bg-[#0B0B18]/60 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400 text-[11px]">{item.label}</span>
            <span className="text-slate-100 font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {status === 'pending' && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            id={`btn-primary-${data.id}`}
            onClick={handlePrimaryAction}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all duration-200 active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            {data.primaryActionText || 'Confirm & Execute'}
          </button>

          {data.secondaryActionText && (
            <button
              id={`btn-secondary-${data.id}`}
              onClick={handleSecondaryAction}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
            >
              {data.secondaryActionText}
            </button>
          )}

          <button
            id={`btn-cancel-${data.id}`}
            onClick={() => setStatus('cancelled')}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {status === 'executed' && (
        <div className="flex items-center justify-between text-xs text-emerald-300 pt-1">
          <span>✓ Synchronized with system schedule</span>
          <button
            onClick={() => setCurrentScreen(data.type === 'meeting_ready' ? 'calendar' : data.type === 'team_update' ? 'hrms' : 'devices')}
            className="flex items-center gap-1 text-purple-300 hover:text-purple-200 font-medium"
          >
            View in Workspace <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
