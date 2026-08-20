import { ChatMessage, AIActionCardData } from '../types';
import { initialChatMessages } from '../services/mockData';

export interface IAssistantRepository {
  getChatHistory(): Promise<ChatMessage[]>;
  processMessage(
    userText: string,
    onStepChange?: (stepText: string) => void
  ): Promise<{
    userMessage: ChatMessage;
    jarvisMessage: ChatMessage;
  }>;
  clearHistory(): Promise<void>;
}

class MockAssistantRepository implements IAssistantRepository {
  private storageKey = 'jarvis_chat_history';

  private load(): ChatMessage[] {
    if (typeof window === 'undefined') return initialChatMessages;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialChatMessages;
      }
    }
    return initialChatMessages;
  }

  private save(messages: ChatMessage[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(messages));
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return this.load();
  }

  async clearHistory(): Promise<void> {
    this.save(initialChatMessages);
  }

  async processMessage(
    userText: string,
    onStepChange?: (stepText: string) => void
  ): Promise<{ userMessage: ChatMessage; jarvisMessage: ChatMessage }> {
    const history = this.load();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr,
    };

    history.push(userMessage);
    this.save(history);

    const lower = userText.toLowerCase().trim();

    // Step 1: Thinking simulation
    if (onStepChange) onStepChange('Thinking & analyzing contextual intent...');
    await new Promise((r) => setTimeout(r, 650));

    let responseText = '';
    let actionCard: AIActionCardData | undefined = undefined;

    let followUpSuggestions: { label: string; query: string }[] = [];

    // Pattern matching realistic JARVIS actions
    if (lower.includes('schedule') || lower.includes('create meeting') || lower.includes('meet with')) {
      if (onStepChange) onStepChange('Checking Google Calendar for open slots...');
      await new Promise((r) => setTimeout(r, 600));

      responseText =
        'I found an available slot tomorrow at 3:00 PM – 3:30 PM with Rahul and Priya. Would you like me to create the calendar event and Google Meet link?';
      followUpSuggestions = [
        { label: '✓ Create Meeting Slot', query: 'Yes, create the meeting at 3:00 PM' },
        { label: '🔍 Check Friday Slots', query: 'Show me Friday availability' },
        { label: '📝 Generate AI Meeting Agenda', query: 'Generate agenda for product review' },
      ];
      actionCard = {
        id: `act-${Date.now()}`,
        type: 'meeting_ready',
        title: '✓ MEETING READY',
        subtitle: 'Product & Sprint Review',
        details: [
          { label: 'Time', value: 'Tomorrow, 3:00 PM – 3:30 PM' },
          { label: 'Platform', value: 'Google Meet (Auto-generated)' },
          { label: 'Participants', value: 'Rahul Sharma, Priya Patel, Harsh' },
          { label: 'Conflict Check', value: 'No conflicts detected' },
        ],
        participants: ['Rahul Sharma', 'Priya Patel'],
        status: 'pending',
        primaryActionText: 'Create Meeting',
        secondaryActionText: 'Choose Another Time',
        payload: {
          title: 'Product & Sprint Review',
          startTime: '03:00 PM',
          endTime: '03:30 PM',
          platform: 'Google Meet',
          participants: ['Rahul Sharma', 'Priya Patel'],
        },
      };
    } else if (lower.includes('team update') || lower.includes('hrms') || lower.includes('standup update') || lower.includes('sprint update')) {
      if (onStepChange) onStepChange('Collecting HRMS sprint logs & employee metrics...');
      await new Promise((r) => setTimeout(r, 700));

      responseText =
        "Here is today's Engineering team summary. Sprint completion is currently at 82% with 18 tasks completed. API integration is currently the largest bottleneck.";
      followUpSuggestions = [
        { label: '⚡ Rebalance Overdue Tasks', query: 'Reassign overdue tasks' },
        { label: '💬 Send Summary to Slack', query: 'Send this team summary to engineering channel' },
        { label: '📊 View HRMS Attendance', query: 'Show attendance report' },
      ];
      actionCard = {
        id: `act-${Date.now()}`,
        type: 'team_update',
        title: 'JARVIS TEAM UPDATE',
        subtitle: 'Product Engineering (14 Members)',
        details: [
          { label: 'Sprint Velocity', value: '82% Complete' },
          { label: 'Completed Tasks', value: '18 Tasks' },
          { label: 'Pending / In Progress', value: '5 Tasks' },
          { label: 'Overdue Items', value: '2 Tasks' },
          { label: 'Key Bottleneck', value: 'API integration deployment' },
        ],
        status: 'executed',
        primaryActionText: 'View Team Dashboard',
        secondaryActionText: 'View Overdue Tasks',
      };
    } else if (lower.includes('open vs code') || lower.includes('vs code') || (lower.includes('open') && lower.includes('laptop'))) {
      if (onStepChange) onStepChange('Dispatching RPC signal to Windows Laptop daemon...');
      await new Promise((r) => setTimeout(r, 700));

      responseText = 'Executing command on Windows Laptop (Workstation Pro)... Visual Studio Code has been launched in your current project workspace.';
      followUpSuggestions = [
        { label: '🔒 Lock Workstation', query: 'Lock laptop' },
        { label: '🎯 Enable Focus Mode', query: 'Turn on focus mode on laptop' },
        { label: '🖥️ Check Hardware Specs', query: 'Show device status' },
      ];
      actionCard = {
        id: `act-${Date.now()}`,
        type: 'device_command',
        title: 'DEVICE COMMAND EXECUTED',
        subtitle: 'Windows Laptop (Workstation Pro)',
        details: [
          { label: 'Target Host', value: '192.168.1.108 (Connected)' },
          { label: 'Application', value: 'Visual Studio Code' },
          { label: 'Workspace', value: '/projects/jarvis-core' },
          { label: 'Status', value: 'Running (PID 18420)' },
        ],
        status: 'executed',
        primaryActionText: 'Control Device',
      };
    } else if (lower.includes('schedule') || lower.includes('calendar') || lower.includes('what is my schedule') || lower.includes("what's on my")) {
      responseText =
        "You have 4 scheduled events today:\n• 10:00 AM — Team Standup (Google Meet)\n• 12:00 PM — Lunch Break\n• 02:00 PM — Deep Work Focus Time\n• 04:00 PM — HR Review & Sprint Retro (Conflict flagged: 4:30 PM recommended).";
      followUpSuggestions = [
        { label: 'Resolve 4:00 PM Conflict', query: 'Resolve 4:00 PM meeting conflict' },
        { label: '📅 Open Full Calendar', query: 'Show calendar' },
        { label: '⏰ Add 30m Buffer', query: 'Add 30 min buffer before standup' },
      ];
    } else if (lower.includes('task') || lower.includes('todo') || lower.includes('show tasks')) {
      responseText =
        'You have 2 high-priority tasks due today: "API Integration" (72% complete) and "Sprint Retrospective Preparation" (90% complete). You also have 1 overdue cloud migration item.';
      followUpSuggestions = [
        { label: '⚡ Complete "Sprint Retrospective"', query: 'Mark sprint retrospective completed' },
        { label: '🪄 AI Task Breakdown', query: 'Break down API Integration into subtasks' },
        { label: '📋 View All Tasks', query: 'Open tasks dashboard' },
      ];
    } else if (lower.includes('join meeting') || lower.includes('join meet') || lower.includes('join standup')) {
      responseText =
        'Launching Google Meet for Team Standup. Joining audio bridge and enabling noise suppression.';
      followUpSuggestions = [
        { label: '📝 Transcribe & Take Notes', query: 'Start live meeting transcription' },
        { label: '🔕 Mute Ambient Background', query: 'Enable ultra noise suppression' },
      ];
      actionCard = {
        id: `act-${Date.now()}`,
        type: 'meeting_ready',
        title: '● GOOGLE MEET LIVE',
        subtitle: 'Team Standup',
        details: [
          { label: 'Status', value: 'Live Now' },
          { label: 'Participants', value: 'Rahul Sharma, Priya Patel, Amit Verma +3' },
          { label: 'Link', value: 'https://meet.google.com/jrv-stand-up1' },
        ],
        status: 'executed',
        primaryActionText: 'Join Google Meet',
      };
    } else if (lower.includes('delegate') || lower.includes('prepare my team update')) {
      if (onStepChange) onStepChange('Analyzing sprint metrics & drafting executive briefing...');
      await new Promise((r) => setTimeout(r, 900));

      responseText =
        'I have analyzed your sprint metrics, attendance logs, and open pull requests. The executive summary is compiled and ready for distribution.';
      followUpSuggestions = [
        { label: '🚀 Dispatch to Slack #engineering', query: 'Send briefing to team channel' },
        { label: '📊 View HRMS Velocity', query: 'Show HRMS team metrics' },
        { label: '🗓️ Schedule Sprint Sync', query: 'Schedule 15m review with team' },
      ];
      actionCard = {
        id: `act-${Date.now()}`,
        type: 'task_delegation',
        title: '✓ DELEGATION COMPLETED',
        subtitle: 'Executive Team Update Compiled',
        details: [
          { label: 'HRMS Ingestion', value: '4 Active Developers Synced' },
          { label: 'Git PRs Audited', value: '12 PRs Merged, 2 Blocked' },
          { label: 'Recommendation', value: 'Reassign API Integration to Amit' },
        ],
        status: 'executed',
        primaryActionText: 'View Full Briefing',
      };
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey jarvis')) {
      responseText =
        "Good day, Harsh. All systems operational. Your productivity is trending 87% higher than yesterday. How can I assist you with your schedule, tasks, or team?";
      followUpSuggestions = [
        { label: "📅 What's on my schedule today?", query: "What's on my schedule today?" },
        { label: "🚀 Show today's priority tasks", query: "Show today's priority tasks" },
        { label: "👥 Get Engineering team update", query: "Give me today's team update" },
      ];
    } else {
      responseText = `I have received your request: "${userText}". I am monitoring your calendar, team sprint velocity, and connected devices to keep your workflow optimal.`;
      followUpSuggestions = [
        { label: '📋 Show My Active Tasks', query: 'Show my tasks' },
        { label: '🗓️ Check Next Meeting', query: 'When is my next meeting?' },
        { label: '🎙️ Delegate Task to JARVIS', query: 'Prepare my team update' },
      ];
    }

    const jarvisMessage: ChatMessage = {
      id: `msg-jrv-${Date.now()}`,
      sender: 'jarvis',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionCard,
      followUpSuggestions,
    };

    history.push(jarvisMessage);
    this.save(history);

    return { userMessage, jarvisMessage };
  }
}

export const assistantRepository = new MockAssistantRepository();
