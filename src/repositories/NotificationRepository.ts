import { NotificationItem } from '../types';
import { initialNotifications } from '../services/mockData';

export interface INotificationRepository {
  getNotifications(): Promise<NotificationItem[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): Promise<NotificationItem>;
}

class MockNotificationRepository implements INotificationRepository {
  private storageKey = 'jarvis_notifications';

  private load(): NotificationItem[] {
    if (typeof window === 'undefined') return initialNotifications;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialNotifications;
      }
    }
    return initialNotifications;
  }

  private save(items: NotificationItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return this.load();
  }

  async markAsRead(id: string): Promise<void> {
    const items = this.load();
    const item = items.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      this.save(items);
    }
  }

  async markAllAsRead(): Promise<void> {
    const items = this.load().map((n) => ({ ...n, isRead: true }));
    this.save(items);
  }

  async addNotification(data: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): Promise<NotificationItem> {
    const items = this.load();
    const newItem: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    items.unshift(newItem);
    this.save(items);
    return newItem;
  }
}

export const notificationRepository = new MockNotificationRepository();
