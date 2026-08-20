import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import {
  Bell,
  CheckCircle,
  Calendar,
  CheckSquare,
  Users,
  Laptop,
  ArrowRight,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentScreen,
  } = useJarvis();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));

  const getIcon = (type: string) => {
    switch (type) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-pink-400" />;
      case 'hrms':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'device':
        return <Laptop className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleItemClick = async (item: any) => {
    await markNotificationRead(item.id);
    if (item.type === 'calendar') setCurrentScreen('calendar');
    else if (item.type === 'task') setCurrentScreen('tasks');
    else if (item.type === 'hrms') setCurrentScreen('hrms');
    else if (item.type === 'device') setCurrentScreen('devices');
  };

  return (
    <div id="notifications-screen" className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              SYSTEM ALERTS & CHRONO STREAM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Proactive alerts, sprint notifications, and autonomous schedule updates.
          </p>
        </div>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-2xl bg-[#0B0B18] border border-white/10">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-300">All caught up!</h4>
          <p className="text-xs text-slate-500 mt-1">No unread notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <GlassCard
              key={item.id}
              variant="interactive"
              onClick={() => handleItemClick(item)}
              glowColor={!item.isRead ? 'purple' : 'none'}
              className={`p-4 flex items-start justify-between gap-4 ${
                !item.isRead ? 'border-purple-500/40 bg-[#121225]/90' : 'opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#070714] border border-purple-500/20 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1.5 inline-block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-purple-300 group-hover:text-purple-200 shrink-0 self-center">
                <span className="hidden sm:inline">Open</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
