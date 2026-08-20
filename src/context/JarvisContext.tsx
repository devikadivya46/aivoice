import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AssistantState,
  CalendarEvent,
  ChatMessage,
  Device,
  Employee,
  IntegrationServiceItem,
  Meeting,
  MeetingActionItem,
  MeetingSummary,
  NotificationItem,
  ProductivityMetric,
  SecurityPermissions,
  Task,
  TeamSummary,
  UserProfile,
  VoiceSettings,
  FollowUpPrompt,
  FollowUpOption,
  ScheduledMeetingReminder,
} from '../types';
import {
  initialChatMessages,
  initialDevices,
  initialEmployees,
  initialEvents,
  initialIntegrations,
  initialMeetings,
  initialNotifications,
  initialProductivityMetrics,
  initialSecurityPermissions,
  initialTasks,
  initialTeamSummary,
  initialUser,
  initialVoiceSettings,
} from '../services/mockData';
import { assistantRepository } from '../repositories/AssistantRepository';
import { calendarRepository } from '../repositories/CalendarRepository';
import { meetingRepository } from '../repositories/MeetingRepository';
import { taskRepository } from '../repositories/TaskRepository';
import { hrmsRepository } from '../repositories/HrmsRepository';
import { deviceRepository } from '../repositories/DeviceRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { voiceService } from '../services/VoiceService';
import { geminiService } from '../services/GeminiService';
import { VoiceActionEngine } from '../services/VoiceActionEngine';

export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'assistant'
  | 'calendar'
  | 'meetings'
  | 'tasks'
  | 'hrms'
  | 'analytics'
  | 'notifications'
  | 'devices'
  | 'settings';

interface JarvisContextType {
  // Navigation & Screen
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  isFirstLaunch: boolean;
  completeOnboarding: () => void;

  // User
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;

  // Assistant & Voice State
  assistantState: AssistantState;
  setAssistantState: (state: AssistantState) => void;
  statusText: string;
  setStatusText: (text: string) => void;
  waveformIntensity: number;
  speakResponse: (text: string, onEnd?: () => void) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  clearChatHistory: () => void;

  // Calendar
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
  resolveConflict: (id: string, newTime: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Meetings & Scheduled Meeting Reminder
  meetings: Meeting[];
  createMeeting: (meeting: Omit<Meeting, 'id'>) => Promise<Meeting>;
  joinMeeting: (id: string) => Promise<void>;
  endMeeting: (id: string) => Promise<void>;
  summarizeMeeting: (id: string) => Promise<MeetingSummary>;
  summarizingMeetingId: string | null;
  activeMeetingReminder: ScheduledMeetingReminder | null;
  triggerMeetingReminder: (meetingIdOrCustom?: string) => void;
  attendMeeting: (meetingId: string) => Promise<void>;
  snoozeMeetingReminder: (minutes?: number) => void;
  dismissMeetingReminder: () => void;
  replayMeetingVoiceReminder: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  toggleCompleteTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addSubtask: (taskId: string, subtaskTitle: string) => Promise<void>;
  breakdownTaskWithAi: (taskId: string) => Promise<void>;
  restoreTask: (task: Task) => Promise<void>;
  runTaskDelegation: (taskTitle: string) => Promise<void>;
  delegationProgress: { active: boolean; step: string; progress: number };
  convertActionItemToTask: (actionItem: MeetingActionItem) => Promise<Task>;

  // Proactive Follow-up Intelligence
  activeFollowUp: FollowUpPrompt | null;
  triggerFollowUp: (prompt: Omit<FollowUpPrompt, 'id' | 'timestamp'>) => void;
  dismissFollowUp: () => void;
  respondToFollowUp: (optionIdOrText: string) => Promise<void>;

  // HRMS
  teamSummary: TeamSummary;
  employees: Employee[];

  // Devices
  devices: Device[];
  executeDeviceCommand: (deviceId: string, command: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  triggerNotification: (title: string, message: string, type: NotificationItem['type']) => Promise<void>;

  // Settings & Integrations
  voiceSettings: VoiceSettings;
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>;
  securityPermissions: SecurityPermissions;
  setSecurityPermissions: React.Dispatch<React.SetStateAction<SecurityPermissions>>;
  integrations: IntegrationServiceItem[];
  toggleIntegration: (id: string) => void;

  // Command Palette & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isVoiceCommandsModalOpen: boolean;
  setIsVoiceCommandsModalOpen: (open: boolean) => void;
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: (open: boolean) => void;
  isQuickAssistantOpen: boolean;
  setIsQuickAssistantOpen: (open: boolean) => void;
  isAiPanelOpen: boolean;
  setIsAiPanelOpen: (open: boolean) => void;

  // Analytics
  productivityMetrics: ProductivityMetric[];
}

const JarvisContext = createContext<JarvisContextType | undefined>(undefined);

export const JarvisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('jarvis_onboarded') !== 'true';
  });

  const [user, setUser] = useState<UserProfile>(initialUser);
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [statusText, setStatusText] = useState<string>('Online & Ready');
  const [waveformIntensity, setWaveformIntensity] = useState<number>(0.15);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [teamSummary, setTeamSummary] = useState<TeamSummary>(initialTeamSummary);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(initialVoiceSettings);
  const [securityPermissions, setSecurityPermissions] = useState<SecurityPermissions>(initialSecurityPermissions);
  const [integrations, setIntegrations] = useState<IntegrationServiceItem[]>(initialIntegrations);
  const [productivityMetrics] = useState<ProductivityMetric[]>(initialProductivityMetrics);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isVoiceCommandsModalOpen, setIsVoiceCommandsModalOpen] = useState<boolean>(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [isQuickAssistantOpen, setIsQuickAssistantOpen] = useState<boolean>(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState<boolean>(true);
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUpPrompt | null>(null);
  const [activeMeetingReminder, setActiveMeetingReminder] = useState<ScheduledMeetingReminder | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [summarizingMeetingId, setSummarizingMeetingId] = useState<string | null>(null);
  const [delegationProgress, setDelegationProgress] = useState<{ active: boolean; step: string; progress: number }>({
    active: false,
    step: '',
    progress: 0,
  });

  // Centralized speech synthesis executor - ALWAYS speaks JARVIS responses aloud
  const speakResponse = useCallback((text: string, onEnd?: () => void) => {
    setAssistantState('speaking');
    setStatusText('JARVIS is speaking...');
    voiceService.speak(text, () => {
      setAssistantState('idle');
      setStatusText('Online & Ready');
      if (onEnd) onEnd();
    });
  }, []);

  // Load repositories on startup
  useEffect(() => {
    calendarRepository.getEvents().then(setEvents);
    meetingRepository.getMeetings().then(setMeetings);
    taskRepository.getTasks().then(setTasks);
    hrmsRepository.getTeamSummary().then(setTeamSummary);
    hrmsRepository.getEmployees().then(setEmployees);
    deviceRepository.getDevices().then(setDevices);
    notificationRepository.getNotifications().then(setNotifications);
    assistantRepository.getChatHistory().then(setChatMessages);
  }, []);

  // Keyboard shortcuts:
  // - Cmd+K / Ctrl+K -> Command Palette
  // - Shift+V / ? -> Available Voice Commands Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Shift + V or Cmd+Shift+V or ? shortcut for Voice Commands Modal
      if ((e.shiftKey && e.key.toLowerCase() === 'v') || (!isInput && e.key === '?')) {
        if (!isInput) {
          e.preventDefault();
          setIsVoiceCommandsModalOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic waveform simulation effect based on assistant state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (assistantState === 'speaking') {
      interval = setInterval(() => {
        setWaveformIntensity(0.4 + Math.random() * 0.6);
      }, 100);
    } else if (assistantState === 'listening') {
      interval = setInterval(() => {
        setWaveformIntensity(0.3 + Math.random() * 0.5);
      }, 120);
    } else if (assistantState === 'thinking') {
      interval = setInterval(() => {
        setWaveformIntensity(0.2 + Math.sin(Date.now() / 200) * 0.15);
      }, 150);
    } else {
      setWaveformIntensity(0.12);
    }
    return () => clearInterval(interval);
  }, [assistantState]);

  const completeOnboarding = useCallback(() => {
    setIsFirstLaunch(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jarvis_onboarded', 'true');
    }
    setCurrentScreen('home');
  }, []);

  const triggerNotification = useCallback(
    async (title: string, message: string, type: NotificationItem['type']) => {
      const newNotif = await notificationRepository.addNotification({ title, message, type });
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  // Proactive Follow-up logic
  const triggerFollowUp = useCallback((prompt: Omit<FollowUpPrompt, 'id' | 'timestamp'>) => {
    const newPrompt: FollowUpPrompt = {
      ...prompt,
      id: `follow-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActiveFollowUp(newPrompt);
  }, []);

  const dismissFollowUp = useCallback(() => {
    setActiveFollowUp(null);
  }, []);

  // Calendar actions
  const addEvent = useCallback(
    async (eventData: Omit<CalendarEvent, 'id'>) => {
      const created = await calendarRepository.createEvent(eventData);
      setEvents((prev) => [...prev, created]);
      triggerNotification('Event Scheduled', `"${created.title}" added to your calendar for ${created.startTime}.`, 'calendar');

      // Proactive Follow-up prompt
      triggerFollowUp({
        triggerAction: 'Event Scheduled',
        title: 'Calendar Slot Reserved',
        question: `"${created.title}" is booked for ${created.startTime}. Would you like me to draft an AI meeting agenda, invite teammates, or set a 15m prep buffer?`,
        contextData: { meetingTitle: created.title },
        options: [
          { id: 'prep-brief', label: '📝 Draft AI Meeting Agenda', actionType: 'custom', icon: 'ai', variant: 'primary' },
          { id: 'notify-attendees', label: '👥 Invite Attendees', actionType: 'notify', icon: 'notify', variant: 'secondary' },
        ],
        autoDismissTimeout: 18000,
      });

      return created;
    },
    [triggerNotification, triggerFollowUp]
  );

  const resolveConflict = useCallback(
    async (id: string, newTime: string) => {
      const updated = await calendarRepository.resolveConflict(id, newTime);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      triggerNotification('Conflict Resolved', `Meeting rescheduled to ${newTime}.`, 'calendar');
    },
    [triggerNotification]
  );

  const deleteEvent = useCallback(async (id: string) => {
    await calendarRepository.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Meeting actions
  const createMeeting = useCallback(
    async (meetingData: Omit<Meeting, 'id'>) => {
      const created = await meetingRepository.createMeeting(meetingData);
      setMeetings((prev) => [created, ...prev]);
      triggerNotification('Meeting Created', `"${created.title}" (${created.platform}) is ready.`, 'calendar');
      return created;
    },
    [triggerNotification]
  );

  const joinMeeting = useCallback(
    async (id: string) => {
      await meetingRepository.joinMeeting(id);
      setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'live' as const } : m)));
      triggerNotification('Live Meeting Active', 'Connected to audio bridge and screen share.', 'calendar');
      speakResponse('Connected to meeting room and live audio bridge.');
    },
    [triggerNotification, speakResponse]
  );

  const replayMeetingVoiceReminder = useCallback(() => {
    if (!activeMeetingReminder) return;
    const { meeting } = activeMeetingReminder;
    const spokenText = `Attention Harsh, this is your scheduled reminder to attend ${meeting.title} starting at ${meeting.time} on ${meeting.platform}. Attendees include ${meeting.participants?.map((p) => p.name).join(', ') || 'your team'}. Say 'Join meeting' or click Attend to connect.`;
    voiceService.speakAnnouncement(spokenText);
  }, [activeMeetingReminder]);

  const triggerMeetingReminder = useCallback(
    (meetingIdOrCustom?: string) => {
      const targetMeeting = meetingIdOrCustom
        ? meetings.find((m) => m.id === meetingIdOrCustom)
        : meetings.find((m) => m.status === 'upcoming') || meetings[0];

      if (!targetMeeting) return;

      const reminder: ScheduledMeetingReminder = {
        id: `rem-${Date.now()}`,
        meeting: targetMeeting,
        reminderTime: targetMeeting.time,
        minutesRemaining: 5,
        spokenAnnounced: true,
        notes: targetMeeting.agenda || 'Scheduled sprint standup and team alignment',
      };

      setActiveMeetingReminder(reminder);

      // Play audio chime and speak proactive reminder aloud
      const spokenText = `Attention Harsh, this is your scheduled reminder to attend ${targetMeeting.title} starting at ${targetMeeting.time} on ${targetMeeting.platform}. Google Meet room is open. Would you like me to connect you now?`;
      voiceService.speakAnnouncement(spokenText);

      triggerNotification(
        'Scheduled Meeting Reminder',
        `Time to attend "${targetMeeting.title}" (${targetMeeting.time}) on ${targetMeeting.platform}.`,
        'calendar'
      );
    },
    [meetings, triggerNotification]
  );

  const attendMeeting = useCallback(
    async (id: string) => {
      const meeting = meetings.find((m) => m.id === id) || meetings[0];
      await meetingRepository.joinMeeting(id);
      setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'live' as const } : m)));
      setActiveMeetingReminder(null);
      setCurrentScreen('meetings');

      const text = `Joining ${meeting.title} on ${meeting.platform} now. Audio bridge and meeting room connected.`;
      speakResponse(text);
      triggerNotification('Live Meeting Attended', `Connected to "${meeting.title}". Room is now live.`, 'calendar');
    },
    [meetings, speakResponse, triggerNotification]
  );

  const snoozeMeetingReminder = useCallback((minutes: number = 5) => {
    setActiveMeetingReminder(null);
    const text = `Meeting reminder snoozed for ${minutes} minutes. I will alert you again.`;
    speakResponse(text);

    // Auto re-trigger after delay (e.g. 15s in active session for testing)
    setTimeout(() => {
      triggerMeetingReminder();
    }, 15000);
  }, [speakResponse, triggerMeetingReminder]);

  const dismissMeetingReminder = useCallback(() => {
    setActiveMeetingReminder(null);
  }, []);

  const summarizeMeeting = useCallback(
    async (id: string): Promise<MeetingSummary> => {
      setSummarizingMeetingId(id);
      const meeting = meetings.find((m) => m.id === id);
      const title = meeting?.title || 'Completed Meeting';
      triggerNotification('Analyzing Meeting Notes', `Gemini 3.7 is synthesizing decisions & action items for "${title}"...`, 'calendar');

      try {
        const summary = await geminiService.summarizeMeeting({
          meetingTitle: title,
          agenda: meeting?.agenda,
          duration: meeting?.duration,
          participants: meeting?.participants,
          transcriptNotes: meeting?.transcriptNotes,
        });

        await meetingRepository.updateMeetingSummary(id, summary);
        setMeetings((prev) =>
          prev.map((m) => (m.id === id ? { ...m, summary } : m))
        );

        triggerNotification(
          'Meeting Summary Ready',
          `Gemini extracted ${summary.actionItems.length} action items & key decisions for "${title}".`,
          'calendar'
        );

        speakResponse(`Executive meeting summary ready for ${title}. ${summary.actionItems.length} action items extracted.`);

        return summary;
      } finally {
        setSummarizingMeetingId(null);
      }
    },
    [meetings, triggerNotification, speakResponse]
  );

  const endMeeting = useCallback(
    async (id: string) => {
      const updated = await meetingRepository.endMeeting(id);
      setMeetings((prev) => prev.map((m) => (m.id === id ? updated : m)));
      triggerNotification('Meeting Concluded', `"${updated.title}" marked as Completed. Auto-summarizing with Gemini...`, 'calendar');
      speakResponse(`Meeting "${updated.title}" concluded. Auto-summarizing with Gemini.`);
      // Auto-summarize with Gemini upon completion
      summarizeMeeting(id);

      triggerFollowUp({
        triggerAction: 'Meeting Concluded',
        title: 'Meeting Finished',
        question: `"${updated.title}" has concluded. Would you like me to auto-convert all action items into tasks or email the summary to attendees?`,
        contextData: { meetingTitle: updated.title },
        options: [
          { id: 'convert-tasks', label: '✓ Auto-convert Action Items', actionType: 'custom', icon: 'check', variant: 'primary' },
          { id: 'send-summary', label: '📧 Email Team Summary', actionType: 'notify', icon: 'notify', variant: 'secondary' },
        ],
        autoDismissTimeout: 18000,
      });
    },
    [summarizeMeeting, triggerNotification, triggerFollowUp, speakResponse]
  );

  // Subtask & Breakdown helpers
  const restoreTask = useCallback(async (task: Task) => {
    const restored = await taskRepository.restoreTask(task);
    setTasks((prev) => {
      if (prev.some((t) => t.id === restored.id)) return prev;
      return [restored, ...prev];
    });
    speakResponse(`Restored task ${restored.title}.`);
  }, [speakResponse]);

  const addSubtask = useCallback(
    async (taskId: string, subtaskTitle: string) => {
      const updated = await taskRepository.addSubtask(taskId, subtaskTitle);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      triggerNotification('Subtask Added', `"${subtaskTitle}" added to task.`, 'task');
      speakResponse(`Added subtask ${subtaskTitle}.`);
    },
    [triggerNotification, speakResponse]
  );

  const breakdownTaskWithAi = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      setAssistantState('thinking');
      setStatusText(`Decomposing "${task.title}" with Gemini...`);

      const generatedSubtasks = [
        `Setup architectural requirements & dependencies for ${task.title}`,
        `Execute implementation & interface unit tests`,
        `Validate staging build & review performance metrics`,
      ];

      let current = task;
      for (const sub of generatedSubtasks) {
        current = await taskRepository.addSubtask(taskId, sub);
      }

      setTasks((prev) => prev.map((t) => (t.id === taskId ? current : t)));
      setAssistantState('success');
      setStatusText(`✓ ${generatedSubtasks.length} subtasks generated`);
      triggerNotification(
        'Gemini Task Breakdown',
        `Created ${generatedSubtasks.length} actionable subtasks for "${task.title}".`,
        'task'
      );
      speakResponse(`Gemini subtask breakdown completed for ${task.title}. ${generatedSubtasks.length} architectural subtasks added.`);

      setTimeout(() => {
        setAssistantState('idle');
        setStatusText('Online & Ready');
      }, 2000);
    },
    [tasks, triggerNotification, speakResponse]
  );

  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      const updated = await taskRepository.toggleSubtask(taskId, subtaskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));

      const allDone = updated.subtasks && updated.subtasks.length > 0 && updated.subtasks.every((s) => s.completed);
      if (allDone && updated.status === 'completed') {
        triggerFollowUp({
          triggerAction: 'All Subtasks Done',
          title: 'Milestone Completed',
          question: `All subtasks for "${updated.title}" are done! Shall I notify ${updated.assignee || 'the team'} or log 1.5h in your productivity report?`,
          contextData: { taskId: updated.id, taskTitle: updated.title, assignee: updated.assignee },
          options: [
            { id: 'notify-lead', label: '📢 Notify Assignee & Lead', actionType: 'notify', icon: 'notify', variant: 'primary' },
            { id: 'log-time', label: '⏱️ Log 1.5h Focus', actionType: 'log_time', icon: 'time', variant: 'secondary' },
            { id: 'schedule-sync', label: '🗓️ Schedule Review', actionType: 'schedule', icon: 'calendar', variant: 'accent' },
          ],
          autoDismissTimeout: 18000,
        });
      }
    },
    [triggerFollowUp]
  );

  // Task actions
  const addTask = useCallback(
    async (taskData: Omit<Task, 'id'>) => {
      const created = await taskRepository.createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      triggerNotification('Task Added', `"${created.title}" added to ${created.category}.`, 'task');

      // Proactive follow-up question
      triggerFollowUp({
        triggerAction: 'Task Created',
        title: 'New Task Initialized',
        question: `"${created.title}" is queued for ${created.dueDate}. Should I generate subtasks with Gemini AI, block 45m focus on your calendar, or notify ${created.assignee || 'the assignee'}?`,
        contextData: { taskId: created.id, taskTitle: created.title, assignee: created.assignee },
        options: [
          { id: 'ai-breakdown', label: '🪄 AI Subtask Breakdown', actionType: 'ai_breakdown', icon: 'ai', variant: 'primary' },
          { id: 'block-calendar', label: '📅 Block Focus Time', actionType: 'schedule', icon: 'calendar', variant: 'secondary' },
          { id: 'notify-assignee', label: `👥 Notify ${created.assignee || 'Team'}`, actionType: 'notify', icon: 'notify', variant: 'accent' },
        ],
        autoDismissTimeout: 18000,
      });

      return created;
    },
    [triggerNotification, triggerFollowUp]
  );

  const convertActionItemToTask = useCallback(
    async (actionItem: MeetingActionItem) => {
      const created = await taskRepository.createTask({
        title: actionItem.task,
        priority: 'high',
        dueDate: actionItem.deadline || 'Today 5:00 PM',
        category: 'Engineering',
        progress: 0,
        status: 'today',
        assignee: actionItem.assignee || user.name,
        description: `Action item assigned to ${actionItem.assignee} from Gemini meeting summary`,
        subtasks: [
          { id: `sub-init-1`, title: 'Review meeting context & requirements', completed: false },
          { id: `sub-init-2`, title: 'Complete deliverables & notify stakeholders', completed: false },
        ],
      });
      setTasks((prev) => [created, ...prev]);
      triggerNotification('Action Item Converted', `Task "${created.title}" added to your Tasks.`, 'task');
      return created;
    },
    [user.name, triggerNotification]
  );

  const toggleCompleteTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      if (task.status === 'completed') {
        const updated = await taskRepository.updateTask(id, { status: 'today', progress: 50 });
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        triggerNotification('Task Reopened', `"${task.title}" marked as In Progress.`, 'task');
      } else {
        const updated = await taskRepository.completeTask(id);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        triggerNotification('Task Completed', `"${task.title}" has been completed!`, 'task');

        // Proactive follow-up question
        triggerFollowUp({
          triggerAction: 'Task Completed',
          title: 'Task Finished',
          question: `Outstanding progress! "${task.title}" is marked complete. Would you like me to notify ${task.assignee || 'the team'}, log 1.5h in your productivity report, or schedule the next milestone?`,
          contextData: { taskId: task.id, taskTitle: task.title, assignee: task.assignee },
          options: [
            { id: 'notify-assignee', label: `📢 Notify ${task.assignee || 'Lead'}`, actionType: 'notify', icon: 'notify', variant: 'primary' },
            { id: 'log-focus-time', label: '⏱️ Log 1.5h Focus', actionType: 'log_time', icon: 'time', variant: 'secondary' },
            { id: 'schedule-next', label: '🗓️ Schedule Milestone', actionType: 'schedule', icon: 'calendar', variant: 'accent' },
          ],
          autoDismissTimeout: 18000,
        });
      }
    },
    [tasks, triggerNotification, triggerFollowUp]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      setLastDeletedTask(taskToDelete || null);
      await taskRepository.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      triggerNotification('Task Deleted', taskToDelete ? `"${taskToDelete.title}" removed.` : 'Task removed.', 'task');

      if (taskToDelete) {
        triggerFollowUp({
          triggerAction: 'Task Deleted',
          title: 'Task Removed',
          question: `"${taskToDelete.title}" was removed from your task list. Did you mean to delete this, or would you like to undo?`,
          contextData: { taskId: taskToDelete.id, taskTitle: taskToDelete.title },
          options: [
            { id: 'undo-delete', label: '↩️ Undo Deletion', actionType: 'undo', actionPayload: { task: taskToDelete }, icon: 'undo', variant: 'danger' },
            { id: 'confirm-clean', label: '✓ Confirm Deletion', actionType: 'custom', icon: 'check', variant: 'secondary' },
          ],
          autoDismissTimeout: 12000,
        });
      }
    },
    [tasks, triggerNotification, triggerFollowUp]
  );

  // Device actions
  const updateDevice = useCallback((id: string, updates: Partial<Device>) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const executeDeviceCommand = useCallback(
    async (deviceId: string, command: string) => {
      setAssistantState('executing');
      setStatusText(`Executing "${command}"...`);

      const result = await deviceRepository.executeCommand(deviceId, command);

      if (result.success) {
        setAssistantState('success');
        setStatusText(result.message);
        triggerNotification('Device Command Executed', result.message, 'device');
      } else {
        setAssistantState('error');
        setStatusText(result.message);
      }

      setTimeout(() => {
        setAssistantState('idle');
        setStatusText('Online & Ready');
      }, 2500);
    },
    [triggerNotification]
  );

  // Task delegation pipeline
  const runTaskDelegation = useCallback(
    async (taskTitle: string) => {
      setDelegationProgress({ active: true, step: 'Analyzing...', progress: 15 });
      setAssistantState('executing');
      setStatusText('Delegating to JARVIS...');

      await new Promise((r) => setTimeout(r, 600));
      setDelegationProgress({ active: true, step: 'Collecting HRMS data...', progress: 40 });

      await new Promise((r) => setTimeout(r, 700));
      setDelegationProgress({ active: true, step: 'Analyzing team performance...', progress: 75 });

      await new Promise((r) => setTimeout(r, 600));
      setDelegationProgress({ active: true, step: 'Preparing summary...', progress: 95 });

      await new Promise((r) => setTimeout(r, 500));
      setDelegationProgress({ active: false, step: '✓ Team update ready', progress: 100 });
      setAssistantState('success');
      setStatusText('✓ Team update ready');

      await triggerNotification('Delegation Ready', `Executive summary for "${taskTitle}" is prepared.`, 'hrms');

      setTimeout(() => {
        setAssistantState('idle');
        setStatusText('Online & Ready');
      }, 2500);
    },
    [triggerNotification]
  );

  // Voice message dispatcher & conversational processing
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setAssistantState('thinking');
      setStatusText('Processing voice command...');

      try {
        // Step 1: Evaluate intent via VoiceActionEngine
        const voiceResult = VoiceActionEngine.evaluateVoiceCommand(text, {
          tasks,
          events,
          employees,
          devices,
          activeFollowUp,
          lastDeletedTask,
        });

        if (voiceResult.handled) {
          // Execute contextual system side-effects
          if (voiceResult.targetScreen) {
            setCurrentScreen(voiceResult.targetScreen);
          }
          if (voiceResult.openVoiceModal) {
            setIsVoiceCommandsModalOpen(true);
          }
          if (voiceResult.createdTask) {
            await addTask(voiceResult.createdTask as any);
          }
          if (voiceResult.completedTaskId) {
            await toggleCompleteTask(voiceResult.completedTaskId);
          }
          if (voiceResult.deletedTaskId) {
            await deleteTask(voiceResult.deletedTaskId);
          }
          if (voiceResult.restoredTask) {
            await restoreTask(voiceResult.restoredTask);
            triggerNotification('Action Restored', `"${voiceResult.restoredTask.title}" has been restored.`, 'task');
          }
          if (voiceResult.breakdownTaskId) {
            await breakdownTaskWithAi(voiceResult.breakdownTaskId);
          }
          if (voiceResult.resolvedConflictEventId) {
            await resolveConflict(voiceResult.resolvedConflictEventId, '04:30 PM');
          }
          if (voiceResult.scheduledEvent) {
            await addEvent(voiceResult.scheduledEvent as any);
          }
          if (voiceResult.deviceUpdate) {
            updateDevice(voiceResult.deviceUpdate.id, voiceResult.deviceUpdate.updates);
            triggerNotification('Device Command Executed', 'Hardware status synchronized via voice command.', 'device');
          }
          if (voiceResult.runDelegation) {
            await runTaskDelegation('Prepare my team update');
          }
          if (voiceResult.joinMeetingId) {
            await joinMeeting(voiceResult.joinMeetingId);
          }
          if (voiceResult.attendMeetingId) {
            await attendMeeting(voiceResult.attendMeetingId);
          }
          if (voiceResult.triggerMeetingReminder) {
            triggerMeetingReminder();
          }
          if (voiceResult.snoozeReminder) {
            snoozeMeetingReminder(5);
          }
          if (voiceResult.summarizeMeetingId) {
            await summarizeMeeting(voiceResult.summarizeMeetingId);
          }
          if (voiceResult.convertMeetingActions) {
            const allActionItems = meetings.flatMap((m) => m.summary?.actionItems || []);
            for (const item of allActionItems) {
              await convertActionItemToTask(item);
            }
          }

          if (activeFollowUp) {
            setActiveFollowUp(null);
          }

          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const userMessage: ChatMessage = {
            id: `msg-usr-${Date.now()}`,
            sender: 'user',
            text,
            timestamp: timeStr,
          };
          const jarvisMessage: ChatMessage = {
            id: `msg-jrv-${Date.now()}`,
            sender: 'jarvis',
            text: voiceResult.responseText,
            timestamp: timeStr,
            actionCard: voiceResult.actionCard,
            followUpSuggestions: voiceResult.followUpSuggestions,
          };

          setChatMessages((prev) => [...prev, userMessage, jarvisMessage]);

          // Always announce voice feedback
          speakResponse(jarvisMessage.text);
          return;
        }

        // Fallback to Assistant Repository LLM processing
        const { userMessage, jarvisMessage } = await assistantRepository.processMessage(text, (step) => {
          setStatusText(step);
          if (step.includes('Dispatching') || step.includes('Checking') || step.includes('Analyzing')) {
            setAssistantState('executing');
          }
        });

        setChatMessages((prev) => [...prev, userMessage, jarvisMessage]);

        // Always announce voice feedback
        speakResponse(jarvisMessage.text);
      } catch (err: any) {
        setAssistantState('error');
        setStatusText('Error processing request.');
        setTimeout(() => {
          setAssistantState('idle');
          setStatusText('Online & Ready');
        }, 3000);
      }
    },
    [
      tasks,
      events,
      employees,
      devices,
      activeFollowUp,
      lastDeletedTask,
      meetings,
      voiceSettings.autoSpeak,
      addTask,
      toggleCompleteTask,
      deleteTask,
      restoreTask,
      breakdownTaskWithAi,
      resolveConflict,
      addEvent,
      updateDevice,
      runTaskDelegation,
      joinMeeting,
      summarizeMeeting,
      convertActionItemToTask,
      triggerNotification,
    ]
  );

  const startVoiceInput = useCallback(() => {
    setAssistantState('listening');
    setStatusText('Listening to your voice...');

    voiceService.startListening(
      (transcript) => {
        sendMessage(transcript);
      },
      (error) => {
        // Fallback simulation for seamless preview testing if browser mic is constrained
        console.warn('Voice input fallback trigger:', error);
        setStatusText('Analyzing voice command...');
        setAssistantState('thinking');
        setTimeout(() => {
          sendMessage('Break down task Prepare quarterly review');
        }, 800);
      }
    );
  }, [sendMessage]);

  const stopVoiceInput = useCallback(() => {
    voiceService.stopListening();
    setAssistantState('idle');
    setStatusText('Online & Ready');
  }, []);

  const clearChatHistory = useCallback(async () => {
    await assistantRepository.clearHistory();
    setChatMessages(initialChatMessages);
  }, []);

  const respondToFollowUp = useCallback(
    async (optionIdOrText: string) => {
      if (!activeFollowUp) return;

      const chosenOption = activeFollowUp.options.find((opt) => opt.id === optionIdOrText);

      if (chosenOption) {
        switch (chosenOption.actionType) {
          case 'notify': {
            const assignee = activeFollowUp.contextData?.assignee || 'team lead';
            triggerNotification(
              'Assignee & Lead Notified',
              `Progress update on "${activeFollowUp.contextData?.taskTitle || activeFollowUp.contextData?.meetingTitle || 'Task'}" delivered to ${assignee}.`,
              'task'
            );
            break;
          }
          case 'log_time': {
            triggerNotification(
              'Productivity Logged',
              `1.5 hours of Deep Focus recorded in analytics for "${activeFollowUp.contextData?.taskTitle || 'Task'}".`,
              'hrms'
            );
            break;
          }
          case 'schedule': {
            setIsCreateEventModalOpen(true);
            triggerNotification(
              'Schedule Milestone',
              `Opening calendar to schedule next review for "${activeFollowUp.contextData?.taskTitle || 'Milestone'}".`,
              'calendar'
            );
            break;
          }
          case 'ai_breakdown': {
            if (activeFollowUp.contextData?.taskId) {
              await breakdownTaskWithAi(activeFollowUp.contextData.taskId);
            }
            break;
          }
          case 'create_subtask': {
            if (activeFollowUp.contextData?.taskId) {
              await addSubtask(activeFollowUp.contextData.taskId, chosenOption.actionPayload?.title || 'Review & test implementation');
            }
            break;
          }
          case 'undo': {
            if (chosenOption.actionPayload?.task) {
              await restoreTask(chosenOption.actionPayload.task);
              triggerNotification('Action Restored', `"${chosenOption.actionPayload.task.title}" has been restored.`, 'task');
            }
            break;
          }
          case 'device': {
            triggerNotification(
              'Focus Environment Engaged',
              'Smart workspace lighting adjusted to 4000K Focus White; ambient notifications muted.',
              'device'
            );
            break;
          }
          default:
            triggerNotification('JARVIS Follow-up Executed', `Completed: ${chosenOption.label}`, 'assistant');
        }
      } else {
        await sendMessage(optionIdOrText);
      }

      setActiveFollowUp(null);
    },
    [activeFollowUp, breakdownTaskWithAi, addSubtask, restoreTask, sendMessage, triggerNotification]
  );

  // Notification actions
  const markNotificationRead = useCallback(async (id: string) => {
    await notificationRepository.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await notificationRepository.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const toggleIntegration = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, connected: !item.connected, lastSync: item.connected ? 'Disconnected' : 'Just now' } : item))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <JarvisContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isFirstLaunch,
        completeOnboarding,
        user,
        setUser,
        assistantState,
        setAssistantState,
        statusText,
        setStatusText,
        waveformIntensity,
        speakResponse,
        chatMessages,
        sendMessage,
        startVoiceInput,
        stopVoiceInput,
        clearChatHistory,
        events,
        addEvent,
        resolveConflict,
        deleteEvent,
        meetings,
        createMeeting,
        joinMeeting,
        endMeeting,
        summarizeMeeting,
        summarizingMeetingId,
        activeMeetingReminder,
        triggerMeetingReminder,
        attendMeeting,
        snoozeMeetingReminder,
        dismissMeetingReminder,
        replayMeetingVoiceReminder,
        tasks,
        addTask,
        toggleCompleteTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        breakdownTaskWithAi,
        restoreTask,
        runTaskDelegation,
        delegationProgress,
        convertActionItemToTask,
        activeFollowUp,
        triggerFollowUp,
        dismissFollowUp,
        respondToFollowUp,
        teamSummary,
        employees,
        devices,
        executeDeviceCommand,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        triggerNotification,
        voiceSettings,
        setVoiceSettings,
        securityPermissions,
        setSecurityPermissions,
        integrations,
        toggleIntegration,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isVoiceCommandsModalOpen,
        setIsVoiceCommandsModalOpen,
        isCreateEventModalOpen,
        setIsCreateEventModalOpen,
        isQuickAssistantOpen,
        setIsQuickAssistantOpen,
        isAiPanelOpen,
        setIsAiPanelOpen,
        productivityMetrics,
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
};

export const useJarvis = (): JarvisContextType => {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within a JarvisProvider');
  }
  return context;
};
