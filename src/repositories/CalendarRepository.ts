import { CalendarEvent } from '../types';
import { initialEvents } from '../services/mockData';

export interface ICalendarRepository {
  getEvents(): Promise<CalendarEvent[]>;
  createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent>;
  updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent>;
  deleteEvent(id: string): Promise<void>;
  resolveConflict(id: string, newTime: string): Promise<CalendarEvent>;
}

class MockCalendarRepository implements ICalendarRepository {
  private storageKey = 'jarvis_calendar_events';

  private load(): CalendarEvent[] {
    if (typeof window === 'undefined') return initialEvents;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialEvents;
      }
    }
    return initialEvents;
  }

  private save(events: CalendarEvent[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(events));
    }
  }

  async getEvents(): Promise<CalendarEvent[]> {
    return this.load();
  }

  async createEvent(eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const events = this.load();
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    events.push(newEvent);
    this.save(events);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const events = this.load();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');
    const updated = { ...events[index], ...updates };
    events[index] = updated;
    this.save(events);
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    const events = this.load().filter((e) => e.id !== id);
    this.save(events);
  }

  async resolveConflict(id: string, newTime: string): Promise<CalendarEvent> {
    const [startTime, endTime] = newTime.includes('–') ? newTime.split('–').map((s) => s.trim()) : [newTime, ''];
    return this.updateEvent(id, {
      startTime: startTime || '04:30 PM',
      endTime: endTime || '05:30 PM',
      isConflict: false,
    });
  }
}

export const calendarRepository = new MockCalendarRepository();
