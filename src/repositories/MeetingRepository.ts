import { Meeting } from '../types';
import { initialMeetings } from '../services/mockData';

export interface IMeetingRepository {
  getMeetings(): Promise<Meeting[]>;
  createMeeting(meeting: Omit<Meeting, 'id'>): Promise<Meeting>;
  joinMeeting(id: string): Promise<string>;
  endMeeting(id: string): Promise<Meeting>;
}

class MockMeetingRepository implements IMeetingRepository {
  private storageKey = 'jarvis_meetings';

  private load(): Meeting[] {
    if (typeof window === 'undefined') return initialMeetings;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMeetings;
      }
    }
    return initialMeetings;
  }

  private save(meetings: Meeting[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(meetings));
    }
  }

  async getMeetings(): Promise<Meeting[]> {
    return this.load();
  }

  async createMeeting(meetingData: Omit<Meeting, 'id'>): Promise<Meeting> {
    const meetings = this.load();
    const newMeeting: Meeting = {
      ...meetingData,
      id: `meet-${Date.now()}`,
    };
    meetings.unshift(newMeeting);
    this.save(meetings);
    return newMeeting;
  }

  async joinMeeting(id: string): Promise<string> {
    const meetings = this.load();
    const meeting = meetings.find((m) => m.id === id);
    if (meeting) {
      meeting.status = 'live';
      this.save(meetings);
      return meeting.meetUrl;
    }
    return 'https://meet.google.com/jrv-live';
  }

  async endMeeting(id: string): Promise<Meeting> {
    const meetings = this.load();
    const index = meetings.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    meetings[index].status = 'completed';
    this.save(meetings);
    return meetings[index];
  }

  async updateMeetingSummary(id: string, summary: Meeting['summary']): Promise<Meeting> {
    const meetings = this.load();
    const index = meetings.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    meetings[index].summary = summary;
    this.save(meetings);
    return meetings[index];
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    const meetings = this.load();
    const index = meetings.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    meetings[index] = { ...meetings[index], ...updates };
    this.save(meetings);
    return meetings[index];
  }
}

export const meetingRepository = new MockMeetingRepository();
