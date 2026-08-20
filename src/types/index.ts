export type AssistantState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'executing'
  | 'success'
  | 'error';

export type VoiceState = AssistantState;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar: string;
  greeting?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  actionCard?: AIActionCardData;
  followUpSuggestions?: { label: string; query: string }[];
  isStreaming?: boolean;
}

export interface AIActionCardData {
  id: string;
  type: 'meeting_ready' | 'task_delegation' | 'team_update' | 'device_command' | 'conflict_resolution';
  title: string;
  subtitle?: string;
  details: {
    label: string;
    value: string;
  }[];
  participants?: string[];
  status?: 'pending' | 'executed' | 'cancelled';
  primaryActionText?: string;
  secondaryActionText?: string;
  payload?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // 10:00 AM
  endTime: string; // 10:30 AM
  category: 'meeting' | 'deep_work' | 'review' | 'personal' | 'standup';
  location?: string;
  platform?: 'Google Meet' | 'Conference Room A' | 'Zoom' | 'In-Person';
  meetLink?: string;
  participants?: string[];
  description?: string;
  isConflict?: boolean;
  suggestedSlot?: string;
}

export interface MeetingActionItem {
  assignee: string;
  task: string;
  deadline?: string;
}

export interface MeetingSummary {
  overview: string;
  keyDecisions: string[];
  actionItems: MeetingActionItem[];
  nextSteps: string;
  sentiment?: string;
  suggestedFollowUpDate?: string;
  generatedAt?: string;
  model?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  platform: 'Google Meet' | 'Zoom' | 'Conference Room';
  status: 'upcoming' | 'live' | 'completed';
  participants: {
    name: string;
    avatar: string;
    role?: string;
  }[];
  meetUrl: string;
  agenda?: string;
  summary?: MeetingSummary;
  transcriptNotes?: string;
}

export interface ScheduledMeetingReminder {
  id: string;
  meeting: Meeting;
  reminderTime: string;
  minutesRemaining: number;
  spokenAnnounced: boolean;
  notes?: string;
}

export interface WeatherForecastDay {
  day: string;
  temp: string;
  condition: string;
  icon?: string;
  pop?: string;
}

export interface WeatherForecastData {
  location: string;
  temperature: string;
  condition: string;
  highTemp?: string;
  lowTemp?: string;
  humidity?: string;
  windSpeed?: string;
  uvIndex?: string;
  airQuality?: string;
  summary: string;
  forecast: WeatherForecastDay[];
  hourly?: { time: string; temp: string; condition: string }[];
  clothingAdvice?: string;
  groundingSources?: { title: string; uri: string }[];
  isGrounded?: boolean;
  model?: string;
}

export interface VoiceCommandIntent {
  phrase: string;
  description: string;
  category: string;
  actionType: string;
  targetScreen?: string;
}

export interface VoiceIntentCategory {
  category: string;
  icon: string;
  description: string;
  commands: VoiceCommandIntent[];
}

export interface TaskSubItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // "Today 5:00 PM"
  category: 'Engineering' | 'Product' | 'Operations' | 'Design';
  progress: number; // 0-100
  status: 'today' | 'upcoming' | 'completed' | 'overdue';
  assignee?: string;
  description?: string;
  subtasks?: TaskSubItem[];
}

export interface FollowUpOption {
  id: string;
  label: string;
  actionType: 'notify' | 'log_time' | 'schedule' | 'create_subtask' | 'ai_breakdown' | 'undo' | 'custom' | 'navigate' | 'device';
  actionPayload?: any;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

export interface FollowUpPrompt {
  id: string;
  triggerAction: string; // e.g. "Task Completed", "Task Created", "Meeting Ended", etc.
  title: string;
  question: string;
  contextData?: {
    taskId?: string;
    taskTitle?: string;
    meetingTitle?: string;
    eventName?: string;
    assignee?: string;
    details?: string;
  };
  options: FollowUpOption[];
  timestamp: string;
  autoDismissTimeout?: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: 'online' | 'offline' | 'in_meeting' | 'on_leave';
  tasksCompleted: number;
  totalTasks: number;
  performanceScore: number; // e.g. 91%
  attendanceRate: number; // e.g. 96%
  currentTask?: string;
}

export interface TeamSummary {
  name: string;
  department: string;
  activeCount: number;
  onLeaveCount: number;
  overdueCount: number;
  sprintCompletion: number; // e.g. 82%
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
  bottleneckInsight: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'calendar' | 'task' | 'hrms' | 'system' | 'device';
  actionUrl?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'desktop';
  os: string;
  status: 'connected' | 'offline';
  battery?: number;
  cpuUsage?: number;
  ramUsage?: number;
  ipAddress?: string;
  lastActive: string;
  availableActions: string[];
}

export interface VoiceSettings {
  voiceName: string;
  voiceSpeed: number; // 0.5 to 1.5
  voicePitch: number; // 0.5 to 1.5
  autoSpeak: boolean;
  wakeWordEnabled: boolean;
  wakeWord: string; // "Hey JARVIS"
  continuousListening: boolean;
  responseVolume: number; // 0 to 100
}

export interface SecurityPermissions {
  lowRiskAutoExecute: boolean; // Low-risk actions: Automatically execute
  mediumRiskConfirmation: boolean; // Medium-risk actions: Ask confirmation
  highRiskConfirmation: boolean; // High-risk actions: Always ask confirmation
}

export interface IntegrationServiceItem {
  id: string;
  name: string;
  description: string;
  category: 'Workspace' | 'Hardware' | 'HR';
  connected: boolean;
  iconName: string;
  lastSync?: string;
}

export interface ProductivityMetric {
  date: string;
  productivityScore: number;
  focusHours: number;
  meetingHours: number;
  tasksCompleted: number;
}
