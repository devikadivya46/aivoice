import React, { useState, useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from './GlassCard';
import {
  Mic,
  Calendar,
  Video,
  CheckSquare,
  Users,
  HardDrive,
  CloudSun,
  Search,
  Sparkles,
  Play,
  Copy,
  Check,
  X,
  Keyboard,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { VoiceIntentCategory } from '../../types';

interface VoiceCommandsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const voiceCommandCategories: VoiceIntentCategory[] = [
  {
    category: 'Autonomous Task Management',
    icon: 'check-square',
    description: 'Create tasks, trigger Gemini subtask decompositions, toggle completion, and undo.',
    commands: [
      {
        phrase: 'Break down task Prepare quarterly review with Gemini',
        description: 'Auto-generates 3 actionable architectural subtasks and attaches them to the task.',
        category: 'Tasks',
        actionType: 'ai_breakdown',
        targetScreen: 'tasks',
      },
      {
        phrase: 'Add task Deploy auth service to production',
        description: 'Queues new high-priority deliverable and triggers proactive follow-up prompt.',
        category: 'Tasks',
        actionType: 'create_task',
        targetScreen: 'tasks',
      },
      {
        phrase: 'Mark task Prepare quarterly review as completed',
        description: 'Completes task, sets progress to 100%, and asks follow-up (notify team, log focus time).',
        category: 'Tasks',
        actionType: 'complete_task',
        targetScreen: 'tasks',
      },
      {
        phrase: 'Delete task Fix memory leak and undo if needed',
        description: 'Removes task and triggers follow-up with instantaneous 1-click Undo recovery.',
        category: 'Tasks',
        actionType: 'delete_task',
        targetScreen: 'tasks',
      },
      {
        phrase: 'Undo task deletion',
        description: 'Instantly restores the last removed task and its subtasks.',
        category: 'Tasks',
        actionType: 'undo_task',
        targetScreen: 'tasks',
      },
    ],
  },
  {
    category: 'Proactive Follow-up Voice Replies',
    icon: 'zap',
    description: 'Answer JARVIS proactive follow-up prompts hands-free using natural voice.',
    commands: [
      {
        phrase: 'Notify the team lead and assignee',
        description: 'Sends milestone completion summary notification directly to team leads.',
        category: 'Follow-ups',
        actionType: 'notify_lead',
        targetScreen: 'tasks',
      },
      {
        phrase: 'Log 1.5 hours of focus time',
        description: 'Records deep focus productivity analytics in HRMS work telemetry.',
        category: 'Follow-ups',
        actionType: 'log_focus',
        targetScreen: 'analytics',
      },
      {
        phrase: 'Schedule next milestone review',
        description: 'Opens calendar scheduling modal with pre-filled context and agenda.',
        category: 'Follow-ups',
        actionType: 'schedule_review',
        targetScreen: 'calendar',
      },
      {
        phrase: 'Auto-convert all meeting action items into tasks',
        description: 'Converts Gemini extracted meeting decisions into assigned task deliverables.',
        category: 'Follow-ups',
        actionType: 'convert_action_items',
        targetScreen: 'tasks',
      },
    ],
  },
  {
    category: 'Calendar & Conflict Resolution',
    icon: 'calendar',
    description: 'Create events, resolve overlaps, and check daily schedule timeline.',
    commands: [
      {
        phrase: 'Schedule a meeting with Rahul tomorrow at 3 PM',
        description: 'Creates a calendar meeting with participants and Google Meet bridge.',
        category: 'Calendar',
        actionType: 'schedule_meeting',
        targetScreen: 'calendar',
      },
      {
        phrase: 'Resolve calendar conflict for HR review',
        description: 'Auto-detects alternative open slots and reschedules the conflicting event to 4:30 PM.',
        category: 'Calendar',
        actionType: 'resolve_conflict',
        targetScreen: 'calendar',
      },
      {
        phrase: 'What is my schedule today?',
        description: 'Summarizes all meetings, milestones, and focus blocks scheduled for today.',
        category: 'Calendar',
        actionType: 'check_schedule',
        targetScreen: 'calendar',
      },
    ],
  },
  {
    category: 'Meetings & Gemini Summaries',
    icon: 'video',
    description: 'Join Google Meet rooms, conclude calls, and generate executive summaries.',
    commands: [
      {
        phrase: 'Join next Google Meet call',
        description: 'Launches audio/video bridge for the upcoming scheduled meeting.',
        category: 'Meetings',
        actionType: 'join_meeting',
        targetScreen: 'meetings',
      },
      {
        phrase: 'Summarize the last meeting with Gemini',
        description: 'Auto-extracts executive summary, decisions, and action items from completed notes.',
        category: 'Meetings',
        actionType: 'summarize_meeting',
        targetScreen: 'meetings',
      },
    ],
  },
  {
    category: 'AI Delegation & Team Analytics',
    icon: 'users',
    description: 'Delegate multi-agent pipelines, check attendance, and sprint velocity.',
    commands: [
      {
        phrase: 'Prepare my team update',
        description: 'Starts autonomous 4-stage pipeline collecting HRMS attendance & sprint velocity.',
        category: 'Tasks',
        actionType: 'delegate_pipeline',
        targetScreen: 'tasks',
      },
      {
        phrase: 'Who is on leave today?',
        description: 'Queries HRMS directory and reports on-leave or online team members.',
        category: 'HRMS',
        actionType: 'check_leave',
        targetScreen: 'hrms',
      },
      {
        phrase: 'Show team sprint velocity and bottleneck diagnosis',
        description: 'Calculates sprint completion rate and highlights blockers.',
        category: 'HRMS',
        actionType: 'team_bottleneck',
        targetScreen: 'hrms',
      },
    ],
  },
  {
    category: 'Smart Hardware & Remote Workstations',
    icon: 'hard-drive',
    description: 'Control workspace lighting, launch developer tools, and reboot workstations.',
    commands: [
      {
        phrase: 'Turn on smart desk lights and set focus mode',
        description: 'Adjusts workstation lighting to 4000K Focus White and activates ambient focus.',
        category: 'Devices',
        actionType: 'focus_mode',
        targetScreen: 'devices',
      },
      {
        phrase: 'Reboot development server',
        description: 'Sends remote RPC reboot signal to the primary developer workstation.',
        category: 'Devices',
        actionType: 'device_reboot',
        targetScreen: 'devices',
      },
      {
        phrase: 'Launch VS Code workstation and lock MacBook Pro',
        description: 'Executes remote developer workspace script and locks remote hardware.',
        category: 'Devices',
        actionType: 'device_telemetry',
        targetScreen: 'devices',
      },
    ],
  },
];

export const VoiceCommandsModal: React.FC<VoiceCommandsModalProps> = ({ isOpen, onClose }) => {
  const { sendMessage, setCurrentScreen } = useJarvis();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const handleExecuteCommand = (phrase: string, targetScreen?: string) => {
    onClose();
    if (targetScreen) {
      setCurrentScreen(targetScreen as any);
    } else {
      setCurrentScreen('assistant');
    }
    sendMessage(phrase);
  };

  // Filter commands
  const filteredCategories = voiceCommandCategories
    .map((cat) => {
      const matchesCategory = selectedCategory === 'all' || cat.category === selectedCategory;
      if (!matchesCategory) return null;

      const filteredCommands = cat.commands.filter(
        (cmd) =>
          cmd.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredCommands.length === 0 && searchQuery) return null;

      return {
        ...cat,
        commands: filteredCommands,
      };
    })
    .filter(Boolean) as VoiceIntentCategory[];

  return (
    <div
      id="voice-commands-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#141228] via-[#0E0D1F] to-[#080814] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">
                  JARVIS VOICE ENGINE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono">
                  Shift + V
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Available Voice Commands & Intents
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter bar */}
        <div className="p-4 sm:px-6 border-b border-white/10 bg-black/20 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search voice intents (e.g., 'meeting', 'update', 'weather', 'reboot')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              All Intents
            </button>
            {voiceCommandCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.category
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Commands List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Mic className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-300">No voice commands found</h4>
              <p className="text-xs text-slate-500 mt-1">Try another search keyword.</p>
            </div>
          ) : (
            filteredCategories.map((categoryGroup) => (
              <div key={categoryGroup.category} className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 font-mono">
                    {categoryGroup.category}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ({categoryGroup.commands.length} intents)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {categoryGroup.commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            "{cmd.phrase}"
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 pl-4">{cmd.description}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleCopy(cmd.phrase)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Copy command text"
                        >
                          {copiedPhrase === cmd.phrase ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleExecuteCommand(cmd.phrase, cmd.targetScreen)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Run Intent</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-4 sm:px-6 bg-black/30 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-purple-400" />
            <span>
              Tip: Press <strong className="text-slate-200">Shift + V</strong> or click the microphone to trigger voice recognition anytime.
            </span>
          </div>
          <span className="text-cyan-400 font-mono text-[11px]">Wake-word: "Hey JARVIS"</span>
        </div>
      </div>
    </div>
  );
};
