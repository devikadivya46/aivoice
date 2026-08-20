import { Task } from '../types';
import { initialTasks } from '../services/mockData';

export interface ITaskRepository {
  getTasks(): Promise<Task[]>;
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  completeTask(id: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleSubtask(taskId: string, subtaskId: string): Promise<Task>;
  addSubtask(taskId: string, subtaskTitle: string): Promise<Task>;
  restoreTask(task: Task): Promise<Task>;
}

class MockTaskRepository implements ITaskRepository {
  private storageKey = 'jarvis_tasks';

  private load(): Task[] {
    if (typeof window === 'undefined') return initialTasks;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialTasks;
      }
    }
    return initialTasks;
  }

  private save(tasks: Task[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.load();
  }

  async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const tasks = this.load();
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      subtasks: taskData.subtasks || [],
    };
    tasks.unshift(newTask);
    this.save(tasks);
    return newTask;
  }

  async restoreTask(task: Task): Promise<Task> {
    const tasks = this.load();
    const exists = tasks.some((t) => t.id === task.id);
    if (!exists) {
      tasks.unshift(task);
      this.save(tasks);
    }
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = this.load();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');
    const updated = { ...tasks[index], ...updates };
    tasks[index] = updated;
    this.save(tasks);
    return updated;
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const tasks = this.load();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    const task = tasks[index];
    const subtasks = (task.subtasks || []).map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );

    const completedCount = subtasks.filter((s) => s.completed).length;
    const progress = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : task.progress;
    const status: Task['status'] = progress === 100 ? 'completed' : task.status === 'completed' ? 'today' : task.status;

    const updated: Task = { ...task, subtasks, progress, status };
    tasks[index] = updated;
    this.save(tasks);
    return updated;
  }

  async addSubtask(taskId: string, subtaskTitle: string): Promise<Task> {
    const tasks = this.load();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    const task = tasks[index];
    const newSub = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: subtaskTitle,
      completed: false,
    };
    const subtasks = [...(task.subtasks || []), newSub];
    const completedCount = subtasks.filter((s) => s.completed).length;
    const progress = Math.round((completedCount / subtasks.length) * 100);

    const updated = { ...task, subtasks, progress };
    tasks[index] = updated;
    this.save(tasks);
    return updated;
  }

  async completeTask(id: string): Promise<Task> {
    const tasks = this.load();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const task = tasks[index];
    const subtasks = (task.subtasks || []).map((s) => ({ ...s, completed: true }));

    const updated: Task = {
      ...task,
      status: 'completed',
      progress: 100,
      subtasks,
    };
    tasks[index] = updated;
    this.save(tasks);
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = this.load().filter((t) => t.id !== id);
    this.save(tasks);
  }
}

export const taskRepository = new MockTaskRepository();
