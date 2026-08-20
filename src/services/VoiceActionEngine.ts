import { Task, CalendarEvent, FollowUpPrompt, Employee, Device } from '../types';

export interface VoiceCommandExecutionResult {
  handled: boolean;
  responseText: string;
  actionCard?: any;
  followUpSuggestions?: { label: string; query: string }[];
  targetScreen?: 'home' | 'assistant' | 'calendar' | 'meetings' | 'tasks' | 'hrms' | 'devices' | 'settings';
  createdTask?: Partial<Task>;
  completedTaskId?: string;
  deletedTaskId?: string;
  restoredTask?: Task;
  breakdownTaskId?: string;
  addedSubtask?: { taskId: string; title: string };
  resolvedConflictEventId?: string;
  scheduledEvent?: Partial<CalendarEvent>;
  deviceUpdate?: { id: string; updates: Partial<Device> };
  followUpTrigger?: Omit<FollowUpPrompt, 'id' | 'timestamp'>;
  runDelegation?: boolean;
  joinMeetingId?: string;
  summarizeMeetingId?: string;
  convertMeetingActions?: boolean;
  openVoiceModal?: boolean;
  triggerMeetingReminder?: boolean;
  attendMeetingId?: string;
  snoozeReminder?: boolean;
}

export class VoiceActionEngine {
  public static evaluateVoiceCommand(
    rawText: string,
    state: {
      tasks: Task[];
      events: CalendarEvent[];
      employees: Employee[];
      devices: Device[];
      activeFollowUp: FollowUpPrompt | null;
      lastDeletedTask: Task | null;
    }
  ): VoiceCommandExecutionResult {
    const text = rawText.trim();
    const lower = text.toLowerCase();

    // -------------------------------------------------------------
    // 1. ACTIVE FOLLOW-UP PROMPT VOICE RESOLUTION
    // -------------------------------------------------------------
    if (state.activeFollowUp) {
      const followUp = state.activeFollowUp;

      // Check if user's voice reply matches one of the prompt's options
      if (
        lower.includes('notify') ||
        lower.includes('tell') ||
        lower.includes('send to') ||
        lower.includes('lead') ||
        lower.includes('assignee') ||
        lower.includes('attendee')
      ) {
        const opt = followUp.options.find((o) => o.actionType === 'notify') || followUp.options[0];
        return {
          handled: true,
          responseText: `Executing follow-up: ${opt.label}. Team members have been notified.`,
          followUpSuggestions: [
            { label: '📋 View Tasks', query: 'Open tasks' },
            { label: '📅 View Calendar', query: 'Show calendar' },
          ],
        };
      }

      if (lower.includes('log') || lower.includes('time') || lower.includes('focus') || lower.includes('hour')) {
        const opt = followUp.options.find((o) => o.actionType === 'log_time') || followUp.options[0];
        return {
          handled: true,
          responseText: `Recorded 1.5 hours of Deep Focus time in your productivity analytics.`,
          followUpSuggestions: [
            { label: '📊 View HRMS Report', query: 'Show team sprint velocity' },
            { label: '🚀 Next Task', query: 'Show today tasks' },
          ],
        };
      }

      if (lower.includes('schedule') || lower.includes('calendar') || lower.includes('milestone') || lower.includes('review')) {
        const opt = followUp.options.find((o) => o.actionType === 'schedule') || followUp.options[0];
        return {
          handled: true,
          targetScreen: 'calendar',
          responseText: `Opening your calendar to schedule the next milestone review.`,
          followUpSuggestions: [
            { label: '✓ Slot for Tomorrow 3 PM', query: 'Schedule meeting with Rahul tomorrow at 3 PM' },
            { label: '📝 Draft Agenda', query: 'Generate meeting agenda' },
          ],
        };
      }

      if (lower.includes('breakdown') || lower.includes('subtask') || lower.includes('decompose') || lower.includes('ai')) {
        if (followUp.contextData?.taskId) {
          return {
            handled: true,
            breakdownTaskId: followUp.contextData.taskId,
            targetScreen: 'tasks',
            responseText: `Decomposing "${followUp.contextData.taskTitle || 'task'}" into actionable subtasks with Gemini AI.`,
            followUpSuggestions: [
              { label: '📋 View All Tasks', query: 'Open tasks' },
              { label: '⚡ Mark First Subtask Done', query: 'Complete task' },
            ],
          };
        }
      }

      if (lower.includes('undo') || lower.includes('restore') || lower.includes('bring back')) {
        return {
          handled: true,
          targetScreen: 'tasks',
          restoredTask: state.lastDeletedTask || undefined,
          responseText: `Undo confirmed. "${state.lastDeletedTask?.title || 'Task'}" has been restored to your active list.`,
          followUpSuggestions: [
            { label: '📋 View Tasks', query: 'Open tasks' },
          ],
        };
      }

      if (lower.includes('agenda') || lower.includes('prep') || lower.includes('brief')) {
        return {
          handled: true,
          responseText: `Drafted AI meeting agenda and talking points for "${followUp.contextData?.meetingTitle || 'Meeting'}".`,
          followUpSuggestions: [
            { label: '👥 Invite Attendees', query: 'Invite Rahul and Priya' },
            { label: '📅 View Calendar', query: 'Show calendar' },
          ],
        };
      }

      if (lower.includes('convert') || lower.includes('action item')) {
        return {
          handled: true,
          convertMeetingActions: true,
          targetScreen: 'tasks',
          responseText: `Converted all meeting action items into trackable tasks on your dashboard.`,
          followUpSuggestions: [
            { label: '📋 View Tasks', query: 'Open tasks' },
          ],
        };
      }

      if (lower === 'yes' || lower === 'sure' || lower === 'do it' || lower === 'proceed' || lower === 'go ahead') {
        const firstOpt = followUp.options[0];
        return {
          handled: true,
          responseText: `Confirmed! Executed: "${firstOpt.label}".`,
          followUpSuggestions: [
            { label: '📋 View Tasks', query: 'Open tasks' },
            { label: '📅 View Calendar', query: 'Show calendar' },
          ],
        };
      }
    }

    // -------------------------------------------------------------
    // 2. TASK OPERATIONS
    // -------------------------------------------------------------

    // A. Add / Create Task
    if (
      lower.startsWith('add task') ||
      lower.startsWith('create task') ||
      lower.startsWith('new task') ||
      lower.startsWith('add a task') ||
      lower.startsWith('create a task') ||
      (lower.includes('task') && (lower.startsWith('add') || lower.startsWith('schedule') || lower.startsWith('queue')))
    ) {
      let taskTitle = text
        .replace(/^(add|create|new|schedule|queue)(\s+a)?\s+task(\s+to|\s+for)?/i, '')
        .trim();

      if (!taskTitle) taskTitle = 'Review project deliverables & roadmap';

      let category: Task['category'] = 'Engineering';
      if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('theme')) category = 'Design';
      if (lower.includes('product') || lower.includes('roadmap') || lower.includes('feature')) category = 'Product';
      if (lower.includes('ops') || lower.includes('operation') || lower.includes('infra') || lower.includes('server')) category = 'Operations';

      const priority: Task['priority'] = lower.includes('high') || lower.includes('urgent') || lower.includes('priority') ? 'high' : 'medium';

      return {
        handled: true,
        targetScreen: 'tasks',
        createdTask: {
          title: taskTitle,
          priority,
          category,
          dueDate: 'Today 5:00 PM',
          status: 'today',
          progress: 0,
          assignee: 'Harsh',
          subtasks: [
            { id: `sub-${Date.now()}-1`, title: 'Define scope & requirements', completed: false },
            { id: `sub-${Date.now()}-2`, title: 'Execute implementation & testing', completed: false },
          ],
        },
        responseText: `Task "${taskTitle}" has been created with ${priority} priority in ${category}. I have initialized 2 subtasks for you.`,
        followUpSuggestions: [
          { label: '🪄 Decompose with Gemini AI', query: `Break down task ${taskTitle}` },
          { label: '📅 Block Focus Time', query: 'Schedule focus time for task' },
          { label: '📢 Notify Team', query: 'Notify team about new task' },
        ],
      };
    }

    // B. Complete Task
    if (
      lower.includes('complete task') ||
      lower.includes('finish task') ||
      lower.includes('mark task') ||
      lower.includes('check off') ||
      (lower.startsWith('complete ') && !lower.includes('meeting')) ||
      (lower.startsWith('finish ') && !lower.includes('meeting'))
    ) {
      const searchFragment = lower
        .replace(/complete task|finish task|mark task|as complete|as done|done|check off|complete|finish/g, '')
        .trim();

      const matchedTask =
        state.tasks.find((t) => searchFragment && t.title.toLowerCase().includes(searchFragment)) ||
        state.tasks.find((t) => t.status === 'today') ||
        state.tasks[0];

      if (matchedTask) {
        return {
          handled: true,
          completedTaskId: matchedTask.id,
          targetScreen: 'tasks',
          responseText: `Marked task "${matchedTask.title}" as completed (100% progress). All subtasks checked off.`,
          followUpSuggestions: [
            { label: `📢 Notify ${matchedTask.assignee || 'Team Lead'}`, query: `Notify lead about ${matchedTask.title}` },
            { label: '⏱️ Log 1.5h Focus Time', query: 'Log 1.5 hours focus time' },
            { label: '🗓️ Schedule Next Milestone', query: 'Schedule milestone review' },
          ],
        };
      }
    }

    // C. AI Breakdown / Subtasks
    if (
      lower.includes('break down') ||
      lower.includes('breakdown') ||
      lower.includes('decompose') ||
      lower.includes('subtask breakdown') ||
      lower.includes('generate subtasks')
    ) {
      const searchFragment = lower
        .replace(/break down task|breakdown task|break down|breakdown|decompose task|decompose|subtask breakdown|generate subtasks for|generate subtasks/g, '')
        .trim();

      const matchedTask =
        state.tasks.find((t) => searchFragment && t.title.toLowerCase().includes(searchFragment)) ||
        state.tasks.find((t) => t.status === 'today') ||
        state.tasks[0];

      if (matchedTask) {
        return {
          handled: true,
          breakdownTaskId: matchedTask.id,
          targetScreen: 'tasks',
          responseText: `Generated 3 actionable subtasks for "${matchedTask.title}" using Gemini AI.`,
          followUpSuggestions: [
            { label: '✓ Complete First Subtask', query: `Complete task ${matchedTask.title}` },
            { label: '📋 View All Tasks', query: 'Open tasks' },
          ],
        };
      }
    }

    // D. Delete Task
    if (lower.startsWith('delete task') || lower.startsWith('remove task') || lower.startsWith('cancel task')) {
      const searchFragment = lower.replace(/delete task|remove task|cancel task/g, '').trim();
      const matchedTask =
        state.tasks.find((t) => searchFragment && t.title.toLowerCase().includes(searchFragment)) ||
        state.tasks[state.tasks.length - 1];

      if (matchedTask) {
        return {
          handled: true,
          deletedTaskId: matchedTask.id,
          targetScreen: 'tasks',
          responseText: `Task "${matchedTask.title}" has been deleted. You can say "Undo" at any time to restore it.`,
          followUpSuggestions: [
            { label: '↩️ Undo Deletion', query: 'Undo task deletion' },
            { label: '📋 View Remaining Tasks', query: 'Open tasks' },
          ],
        };
      }
    }

    // E. Undo Deletion
    if (lower === 'undo' || lower === 'undo delete' || lower === 'undo task deletion' || lower === 'restore task') {
      if (state.lastDeletedTask) {
        return {
          handled: true,
          restoredTask: state.lastDeletedTask,
          targetScreen: 'tasks',
          responseText: `Restored "${state.lastDeletedTask.title}" to your active task list.`,
          followUpSuggestions: [
            { label: '📋 View Tasks', query: 'Open tasks' },
          ],
        };
      }
    }

    // -------------------------------------------------------------
    // 3. CALENDAR & CONFLICT RESOLUTION
    // -------------------------------------------------------------
    if (lower.includes('resolve') && (lower.includes('conflict') || lower.includes('calendar') || lower.includes('meeting'))) {
      const conflictingEvent = state.events.find((e) => e.isConflict) || state.events[3] || state.events[0];
      if (conflictingEvent) {
        return {
          handled: true,
          resolvedConflictEventId: conflictingEvent.id,
          targetScreen: 'calendar',
          responseText: `Calendar conflict resolved. "${conflictingEvent.title}" has been shifted to 4:30 PM – 5:15 PM with zero participant overlaps.`,
          followUpSuggestions: [
            { label: '👥 Notify Attendees of Time Change', query: 'Notify attendees of rescheduled meeting' },
            { label: '📅 View Updated Calendar', query: 'Show calendar' },
          ],
        };
      }
    }

    if (
      (lower.includes('schedule') || lower.includes('create meeting') || lower.includes('book meeting') || lower.includes('meet with')) &&
      !lower.includes('task')
    ) {
      return {
        handled: true,
        targetScreen: 'calendar',
        scheduledEvent: {
          title: 'Product & Sprint Alignment',
          startTime: '03:00 PM',
          endTime: '03:30 PM',
          date: 'Tomorrow',
          platform: 'Google Meet',
          participants: ['Rahul Sharma', 'Priya Patel', 'Harsh'],
          isConflict: false,
        },
        responseText: `Meeting "Product & Sprint Alignment" scheduled for tomorrow at 3:00 PM – 3:30 PM with Google Meet link generated.`,
        followUpSuggestions: [
          { label: '📝 Draft AI Meeting Agenda', query: 'Draft agenda for product review' },
          { label: '👥 Send Google Meet Invites', query: 'Send meeting invites' },
          { label: '⏰ Add 15m Buffer Before Call', query: 'Add 15m buffer' },
        ],
      };
    }

    // -------------------------------------------------------------
    // 4. MEETINGS & VIDEO CONFERENCING & PROACTIVE REMINDERS
    // -------------------------------------------------------------
    if (
      lower.includes('remind me of scheduled meeting') ||
      lower.includes('remind me to attend') ||
      lower.includes('meeting reminder') ||
      lower.includes('remind my meeting') ||
      lower.includes('remind me about meeting') ||
      lower.includes('when is my next meeting') ||
      lower.includes('what is my next meeting') ||
      lower.includes('check scheduled meetings')
    ) {
      const activeEvent = state.events[0];
      return {
        handled: true,
        triggerMeetingReminder: true,
        responseText: `Proactive reminder: Your next scheduled meeting is "${activeEvent?.title || 'Team Standup'}" at ${activeEvent?.startTime || '10:00 AM'} on Google Meet. The room is ready. Would you like to attend now?`,
        followUpSuggestions: [
          { label: '🚀 Attend Meeting Now', query: 'Attend meeting' },
          { label: '⏰ Snooze Reminder 5m', query: 'Snooze meeting reminder' },
          { label: '📝 View Meeting Agenda', query: 'Open meetings' },
        ],
      };
    }

    if (
      lower.includes('attend meeting') ||
      lower.includes('attend the meeting') ||
      lower.includes('attend scheduled meeting') ||
      lower.includes('join scheduled meeting')
    ) {
      const activeEvent = state.events[0];
      return {
        handled: true,
        attendMeetingId: activeEvent?.id,
        targetScreen: 'meetings',
        responseText: `Connecting you to "${activeEvent?.title || 'Team Standup'}" on Google Meet. Connecting microphone and opening live conference room.`,
        followUpSuggestions: [
          { label: '📝 Transcribe & Take Live Notes', query: 'Start live transcription' },
          { label: '🔕 Enable Ambient Noise Suppression', query: 'Enable noise suppression' },
        ],
      };
    }

    if (lower.includes('snooze reminder') || lower.includes('snooze meeting') || lower.includes('remind me later')) {
      return {
        handled: true,
        snoozeReminder: true,
        responseText: `Meeting reminder has been snoozed for 5 minutes. I will remind you again before start.`,
        followUpSuggestions: [
          { label: '🚀 Attend Meeting Now', query: 'Attend meeting' },
          { label: '📅 View Calendar', query: 'Show calendar' },
        ],
      };
    }

    if (lower.includes('join meeting') || lower.includes('join meet') || lower.includes('join standup') || lower.includes('join call')) {
      const activeEvent = state.events[0];
      return {
        handled: true,
        joinMeetingId: activeEvent?.id,
        targetScreen: 'meetings',
        responseText: `Launching Google Meet room for "${activeEvent?.title || 'Team Standup'}". Video link: https://meet.google.com/jrv-stand-up1`,
        followUpSuggestions: [
          { label: '📝 Transcribe & Take Live Notes', query: 'Start live transcription' },
          { label: '🔕 Enable Ambient Noise Suppression', query: 'Enable noise suppression' },
        ],
      };
    }

    if (lower.includes('summarize meeting') || lower.includes('summarise meeting') || lower.includes('meeting summary')) {
      const completedEvent = state.events[1] || state.events[0];
      return {
        handled: true,
        summarizeMeetingId: completedEvent?.id,
        targetScreen: 'meetings',
        responseText: `Gemini AI executive summary compiled for "${completedEvent?.title || 'Sprint Retrospective'}". 3 action items identified.`,
        followUpSuggestions: [
          { label: '✓ Convert Action Items to Tasks', query: 'Convert meeting action items' },
          { label: '📧 Email Team Summary', query: 'Email meeting summary to team' },
        ],
      };
    }

    if (lower.includes('convert action item') || lower.includes('convert meeting action')) {
      return {
        handled: true,
        convertMeetingActions: true,
        targetScreen: 'tasks',
        responseText: `Converted all meeting action items into assigned tasks in your Engineering pipeline.`,
        followUpSuggestions: [
          { label: '📋 View New Tasks', query: 'Open tasks' },
        ],
      };
    }

    // -------------------------------------------------------------
    // 5. DELEGATION PIPELINE
    // -------------------------------------------------------------
    if (
      lower.includes('delegate') ||
      lower.includes('prepare my team update') ||
      lower.includes('prepare team update') ||
      lower.includes('run delegation')
    ) {
      return {
        handled: true,
        runDelegation: true,
        targetScreen: 'tasks',
        responseText: `Initiating autonomous 4-stage delegation pipeline: Ingesting HRMS sprint metrics, auditing pull requests, and compiling your executive briefing.`,
        followUpSuggestions: [
          { label: '🚀 Dispatch to Slack #engineering', query: 'Send briefing to team channel' },
          { label: '📊 View HRMS Velocity', query: 'Show HRMS team metrics' },
        ],
      };
    }

    // -------------------------------------------------------------
    // 6. HRMS & TEAM ANALYTICS
    // -------------------------------------------------------------
    if (lower.includes('leave') || lower.includes('attendance') || lower.includes('who is off') || lower.includes('who is on leave')) {
      return {
        handled: true,
        targetScreen: 'hrms',
        responseText: `According to HRMS attendance: Priya Patel is on Casual Leave today. Rahul Sharma, Amit Verma, Sara Chen, and Neha Gupta are online and active.`,
        followUpSuggestions: [
          { label: '📊 View Full HRMS Directory', query: 'Open HRMS' },
          { label: '💬 Send Team Announcement', query: 'Send message to engineering team' },
        ],
      };
    }

    if (lower.includes('bottleneck') || lower.includes('sprint velocity') || lower.includes('team velocity') || lower.includes('team update')) {
      return {
        handled: true,
        targetScreen: 'hrms',
        responseText: `Engineering sprint velocity is currently 82% complete with 18 tasks done. The largest bottleneck is "API Integration & WebSocket Streaming" (assigned to Rahul).`,
        followUpSuggestions: [
          { label: '⚡ Reassign Overdue Tasks', query: 'Reassign overdue tasks' },
          { label: '📊 View Team Metrics', query: 'Open HRMS' },
        ],
      };
    }

    // -------------------------------------------------------------
    // 7. SMART DEVICES & ENVIRONMENT
    // -------------------------------------------------------------
    if (lower.includes('light') || lower.includes('lights')) {
      const isOff = lower.includes('off');
      const lightDev = state.devices.find((d) => d.name.toLowerCase().includes('light')) || state.devices[2];
      return {
        handled: true,
        targetScreen: 'devices',
        deviceUpdate: {
          id: lightDev?.id || 'dev-3',
          updates: { status: isOff ? 'offline' : 'connected' },
        },
        responseText: isOff
          ? 'Studio Key Lights powered down.'
          : 'Studio Key Lights set to 4000K Focus White (80% Brightness).',
        followUpSuggestions: [
          { label: '🎯 Enable Workstation Focus Mode', query: 'Turn on focus mode on laptop' },
          { label: '🖥️ Show Connected Devices', query: 'Open devices' },
        ],
      };
    }

    if (lower.includes('lock laptop') || lower.includes('lock workstation') || lower.includes('lock computer')) {
      const laptopDev = state.devices.find((d) => d.type === 'laptop') || state.devices[0];
      return {
        handled: true,
        targetScreen: 'devices',
        deviceUpdate: {
          id: laptopDev?.id || 'dev-1',
          updates: { status: 'offline' },
        },
        responseText: 'Remote screen lock signal dispatched to Windows Laptop (Workstation Pro). Device locked.',
        followUpSuggestions: [
          { label: '💡 Power Down Workspace Lights', query: 'Turn off lights' },
          { label: '📱 Check Mobile Battery', query: 'Check phone status' },
        ],
      };
    }

    if (lower.includes('focus mode') || lower.includes('deep work')) {
      return {
        handled: true,
        targetScreen: 'devices',
        responseText: 'Focus Environment engaged: Workstation notifications suppressed, DND active, and Studio Lights adjusted to 4000K.',
        followUpSuggestions: [
          { label: '📅 Block 90m Focus on Calendar', query: 'Add 90 min focus block' },
          { label: '🎵 Play Ambient Focus Soundscape', query: 'Open focus workspace' },
        ],
      };
    }

    if (lower.includes('open vs code') || lower.includes('launch vs code') || lower.includes('launch visual studio')) {
      return {
        handled: true,
        targetScreen: 'devices',
        responseText: 'Visual Studio Code has been launched in your current project workspace on Windows Laptop.',
        followUpSuggestions: [
          { label: '🔒 Lock Workstation', query: 'Lock laptop' },
          { label: '⚡ Run Build Tests', query: 'Check dev server status' },
        ],
      };
    }

    if (lower.includes('reboot') && (lower.includes('server') || lower.includes('dev'))) {
      return {
        handled: true,
        targetScreen: 'devices',
        responseText: 'Remote RPC reboot signal dispatched to Dev Server. Services restarting on port 3000.',
        followUpSuggestions: [
          { label: '🖥️ View Devices Status', query: 'Open devices' },
        ],
      };
    }

    // -------------------------------------------------------------
    // 8. SCREEN NAVIGATION
    // -------------------------------------------------------------
    if (lower === 'go to tasks' || lower === 'open tasks' || lower === 'show tasks' || lower === 'show my tasks' || lower === 'view tasks') {
      return {
        handled: true,
        targetScreen: 'tasks',
        responseText: 'Navigating to Tasks & AI Delegation dashboard.',
      };
    }

    if (lower === 'go to calendar' || lower === 'open calendar' || lower === 'show calendar' || lower === 'show schedule') {
      return {
        handled: true,
        targetScreen: 'calendar',
        responseText: 'Opening your Calendar & Scheduling timeline.',
      };
    }

    if (lower === 'go to meetings' || lower === 'open meetings' || lower === 'show meetings') {
      return {
        handled: true,
        targetScreen: 'meetings',
        responseText: 'Navigating to Google Meet & AI Summaries.',
      };
    }

    if (lower === 'go to hrms' || lower === 'open hrms' || lower === 'show team' || lower === 'show hrms') {
      return {
        handled: true,
        targetScreen: 'hrms',
        responseText: 'Opening HRMS Team Analytics & Sprint Velocity portal.',
      };
    }

    if (lower === 'go to devices' || lower === 'open devices' || lower === 'show devices') {
      return {
        handled: true,
        targetScreen: 'devices',
        responseText: 'Navigating to Connected Devices & Remote Workstations.',
      };
    }

    if (lower === 'go home' || lower === 'open home' || lower === 'show dashboard') {
      return {
        handled: true,
        targetScreen: 'home',
        responseText: 'Returning to JARVIS Executive Overview.',
      };
    }

    if (lower === 'open settings' || lower === 'show settings' || lower === 'go to settings') {
      return {
        handled: true,
        targetScreen: 'settings',
        responseText: 'Opening System Settings & Voice Customization.',
      };
    }

    if (
      lower.includes('voice commands') ||
      lower.includes('what can i say') ||
      lower.includes('voice help') ||
      lower.includes('show commands')
    ) {
      return {
        handled: true,
        openVoiceModal: true,
        responseText: 'Opening the Voice Commands directory. You can speak any of these commands at any time.',
      };
    }

    // Default: not an instant local action, delegate to general assistant pipeline
    return {
      handled: false,
      responseText: '',
    };
  }
}
