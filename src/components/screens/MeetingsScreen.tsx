import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import { Meeting, MeetingSummary } from '../../types';
import {
  Video,
  Clock,
  Users,
  Plus,
  CheckCircle2,
  Play,
  Square,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ListTodo,
  CheckSquare,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const MeetingsScreen: React.FC = () => {
  const {
    meetings,
    joinMeeting,
    endMeeting,
    summarizeMeeting,
    summarizingMeetingId,
    convertActionItemToTask,
    setIsCreateEventModalOpen,
    sendMessage,
    setCurrentScreen,
  } = useJarvis();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [copiedSummaryId, setCopiedSummaryId] = useState<string | null>(null);
  const [convertedTasks, setConvertedTasks] = useState<Record<string, boolean>>({});

  // Filter meetings based on tab
  const filteredMeetings = meetings.filter((m) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'live') return m.status === 'live';
    if (activeTab === 'completed') return m.status === 'completed';
    return m.status === 'upcoming';
  });

  // Find the latest completed meeting with a summary or the latest completed meeting
  const latestCompletedMeeting = meetings.find((m) => m.status === 'completed');

  const handleMarkCompletedAndSummarize = async (meetingId: string) => {
    await endMeeting(meetingId);
    setExpandedSummaryId(meetingId);
  };

  const handleCopySummary = (meeting: Meeting) => {
    if (!meeting.summary) return;
    const text = `Meeting Summary: ${meeting.title}\n\nOverview:\n${meeting.summary.overview}\n\nKey Decisions:\n${meeting.summary.keyDecisions.map((d) => `• ${d}`).join('\n')}\n\nAction Items:\n${meeting.summary.actionItems.map((a) => `• [${a.assignee}] ${a.task}${a.deadline ? ` (Due: ${a.deadline})` : ''}`).join('\n')}\n\nNext Steps: ${meeting.summary.nextSteps}`;
    navigator.clipboard.writeText(text);
    setCopiedSummaryId(meeting.id);
    setTimeout(() => setCopiedSummaryId(null), 2500);
  };

  const handleConvertActionItem = async (meetingId: string, itemIdx: number, actionItem: any) => {
    const key = `${meetingId}-${itemIdx}`;
    await convertActionItemToTask(actionItem);
    setConvertedTasks((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div id="meetings-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              COLLABORATION & INTELLIGENCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-mono">
              Gemini 3.7 Auto-Summaries
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Meetings & Auto-Summarization
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            One-click Google Meet bridges, real-time audio rooms, and automatic Gemini meeting notes syntheses upon completion.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {latestCompletedMeeting && (
            <button
              onClick={() => {
                if (latestCompletedMeeting.id) {
                  setExpandedSummaryId(latestCompletedMeeting.id);
                  if (!latestCompletedMeeting.summary) {
                    summarizeMeeting(latestCompletedMeeting.id);
                  }
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Latest Meeting Summary</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateEventModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </button>
        </div>
      </div>

      {/* PROMINENT HIGHLIGHT: Latest Completed Meeting Gemini Summary Banner */}
      {latestCompletedMeeting && latestCompletedMeeting.summary && (
        <div
          id="latest-meeting-gemini-summary"
          className="rounded-2xl border border-purple-500/40 bg-gradient-to-r from-[#170E2C] via-[#0F0E23] to-[#0A0A18] p-5 shadow-2xl space-y-4 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-400 font-mono">
                    LATEST COMPLETED MEETING SUMMARY
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono">
                    {latestCompletedMeeting.summary.model || 'Gemini 3.7'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  {latestCompletedMeeting.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopySummary(latestCompletedMeeting)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
              >
                {copiedSummaryId === latestCompletedMeeting.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>

              <button
                onClick={() => summarizeMeeting(latestCompletedMeeting.id)}
                disabled={summarizingMeetingId === latestCompletedMeeting.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 border border-purple-500/40 text-xs text-purple-200 font-bold transition-all disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-cyan-400 ${
                    summarizingMeetingId === latestCompletedMeeting.id ? 'animate-spin' : ''
                  }`}
                />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Summary Overview */}
          <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Executive Overview
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {latestCompletedMeeting.summary.overview}
            </p>
          </div>

          {/* Decisions & Action Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Decisions */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-[11px] font-extrabold text-purple-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Key Decisions ({latestCompletedMeeting.summary.keyDecisions.length})
              </span>
              <ul className="space-y-1.5">
                {latestCompletedMeeting.summary.keyDecisions.map((dec, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-purple-400 font-bold shrink-0">•</span>
                    <span>{dec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items with One-Click Convert to Task */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-cyan-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
                  Action Items ({latestCompletedMeeting.summary.actionItems.length})
                </span>
                <span className="text-[10px] text-slate-400">Click to convert to task</span>
              </div>

              <div className="space-y-2">
                {latestCompletedMeeting.summary.actionItems.map((item, idx) => {
                  const isConverted = convertedTasks[`${latestCompletedMeeting.id}-${idx}`];
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{item.task}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span className="text-cyan-300 font-bold">{item.assignee}</span>
                          {item.deadline && <span>• Due: {item.deadline}</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleConvertActionItem(latestCompletedMeeting.id, idx, item)}
                        disabled={isConverted}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                          isConverted
                            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                            : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 active:scale-95'
                        }`}
                      >
                        {isConverted ? '✓ Added' : '+ Add Task'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <strong>Next Steps:</strong> {latestCompletedMeeting.summary.nextSteps}
            </span>
            {latestCompletedMeeting.summary.sentiment && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-purple-300 font-medium">
                Sentiment: {latestCompletedMeeting.summary.sentiment}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {(['all', 'upcoming', 'live', 'completed'] as const).map((tab) => {
          const count = meetings.filter((m) => {
            if (tab === 'all') return true;
            if (tab === 'live') return m.status === 'live';
            if (tab === 'completed') return m.status === 'completed';
            return m.status === 'upcoming';
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meetings List */}
      {filteredMeetings.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-2xl bg-[#0B0B18] border border-white/10">
          <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-300">No {activeTab} meetings found</h4>
          <p className="text-xs text-slate-500 mt-1">Your schedule is clear for this filter.</p>
          <button
            onClick={() => {
              sendMessage('Schedule a meeting with Rahul tomorrow at 3 PM');
              setCurrentScreen('assistant');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:text-white"
          >
            Ask JARVIS to Schedule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeetings.map((meeting) => {
            const isSummarizing = summarizingMeetingId === meeting.id;
            const isExpanded = expandedSummaryId === meeting.id;

            return (
              <GlassCard
                key={meeting.id}
                glowColor={meeting.status === 'live' ? 'cyan' : meeting.status === 'completed' ? 'purple' : 'purple'}
                className="p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {meeting.status === 'live' && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
                )}

                <div>
                  {/* Status and Platform */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-cyan-400" />
                      {meeting.platform}
                    </span>

                    {meeting.status === 'live' ? (
                      <span className="flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        ● LIVE NOW
                      </span>
                    ) : meeting.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-purple-300">{meeting.date}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-white mt-2">{meeting.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                    <span className="flex items-center gap-1 font-mono text-purple-200">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {meeting.time}
                    </span>
                    <span>•</span>
                    <span>{meeting.duration}</span>
                  </div>

                  {meeting.agenda && (
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed bg-[#070714] p-2.5 rounded-xl border border-white/5">
                      <strong className="text-slate-300">Agenda:</strong> {meeting.agenda}
                    </p>
                  )}

                  {/* Summarizing in Progress Notice */}
                  {isSummarizing && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Gemini 3.7 Auto-Summarizing Notes...
                        </p>
                        <p className="text-[10px] text-purple-300 font-mono">
                          Extracting key decisions, sentiment & action items
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Summary Accordion for Completed Meeting */}
                  {meeting.status === 'completed' && meeting.summary && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                      <button
                        onClick={() => setExpandedSummaryId(isExpanded ? null : meeting.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/30 border border-purple-500/20 text-xs text-purple-300 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          AI Summary & Action Items ({meeting.summary.actionItems.length})
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-3 animate-in fade-in duration-200">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Overview</span>
                            <p className="text-xs text-slate-200 mt-0.5">{meeting.summary.overview}</p>
                          </div>

                          {meeting.summary.keyDecisions.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono text-purple-300 uppercase">Key Decisions</span>
                              <ul className="mt-1 space-y-1">
                                {meeting.summary.keyDecisions.map((dec, i) => (
                                  <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                                    <span className="text-cyan-400">•</span>
                                    <span>{dec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {meeting.summary.actionItems.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono text-cyan-300 uppercase">Action Items</span>
                              <div className="mt-1.5 space-y-1.5">
                                {meeting.summary.actionItems.map((item, idx) => {
                                  const key = `${meeting.id}-${idx}`;
                                  const isConverted = convertedTasks[key];
                                  return (
                                    <div
                                      key={idx}
                                      className="p-2 rounded-lg bg-white/5 flex items-center justify-between gap-2"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs text-white">{item.task}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                          Assignee: <span className="text-purple-300">{item.assignee}</span>
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => handleConvertActionItem(meeting.id, idx, item)}
                                        disabled={isConverted}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          isConverted
                                            ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                                            : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300'
                                        }`}
                                      >
                                        {isConverted ? 'Added' : '+ Task'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-between border-t border-white/5">
                            <button
                              onClick={() => handleCopySummary(meeting)}
                              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                            <button
                              onClick={() => summarizeMeeting(meeting.id)}
                              disabled={isSummarizing}
                              className="text-[11px] text-purple-300 hover:text-purple-200 flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Regenerate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Participants and CTA Buttons */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {meeting.participants.map((p, idx) => (
                        <img
                          key={idx}
                          src={p.avatar}
                          alt={p.name}
                          title={p.name}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0B0B18] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {meeting.participants.length} attendees
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {meeting.status === 'live' ? (
                      <>
                        <a
                          href={meeting.meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Call
                        </a>
                        <button
                          onClick={() => handleMarkCompletedAndSummarize(meeting.id)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold"
                          title="End and trigger Gemini auto-summarization"
                        >
                          <Square className="w-3.5 h-3.5" />
                          <span>End & Summarize</span>
                        </button>
                      </>
                    ) : meeting.status === 'upcoming' ? (
                      <>
                        <button
                          onClick={() => handleMarkCompletedAndSummarize(meeting.id)}
                          className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium"
                          title="Mark completed and auto-summarize with Gemini"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => joinMeeting(meeting.id)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 active:scale-95 transition-all"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Start / Join
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setExpandedSummaryId(meeting.id);
                          if (!meeting.summary) {
                            summarizeMeeting(meeting.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{meeting.summary ? 'View AI Summary' : 'Generate Summary'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
