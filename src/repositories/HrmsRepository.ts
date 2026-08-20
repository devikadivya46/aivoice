import { Employee, TeamSummary } from '../types';
import { initialEmployees, initialTeamSummary } from '../services/mockData';

export interface IHrmsRepository {
  getTeamSummary(): Promise<TeamSummary>;
  getEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | undefined>;
  updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee>;
}

class MockHrmsRepository implements IHrmsRepository {
  private summaryStorageKey = 'jarvis_hrms_summary';
  private employeesStorageKey = 'jarvis_hrms_employees';

  private loadSummary(): TeamSummary {
    if (typeof window === 'undefined') return initialTeamSummary;
    const stored = localStorage.getItem(this.summaryStorageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialTeamSummary;
      }
    }
    return initialTeamSummary;
  }

  private loadEmployees(): Employee[] {
    if (typeof window === 'undefined') return initialEmployees;
    const stored = localStorage.getItem(this.employeesStorageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialEmployees;
      }
    }
    return initialEmployees;
  }

  async getTeamSummary(): Promise<TeamSummary> {
    return this.loadSummary();
  }

  async getEmployees(): Promise<Employee[]> {
    return this.loadEmployees();
  }

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    const employees = this.loadEmployees();
    return employees.find((e) => e.id === id);
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const employees = this.loadEmployees();
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    const updated = { ...employees[index], ...updates };
    employees[index] = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.employeesStorageKey, JSON.stringify(employees));
    }
    return updated;
  }
}

export const hrmsRepository = new MockHrmsRepository();
