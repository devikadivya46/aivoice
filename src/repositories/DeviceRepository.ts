import { Device } from '../types';
import { initialDevices } from '../services/mockData';

export interface IDeviceRepository {
  getDevices(): Promise<Device[]>;
  executeCommand(deviceId: string, command: string): Promise<{ success: boolean; message: string }>;
}

class MockDeviceRepository implements IDeviceRepository {
  private storageKey = 'jarvis_devices';

  private load(): Device[] {
    if (typeof window === 'undefined') return initialDevices;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialDevices;
      }
    }
    return initialDevices;
  }

  private save(devices: Device[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(devices));
    }
  }

  async getDevices(): Promise<Device[]> {
    return this.load();
  }

  async executeCommand(deviceId: string, command: string): Promise<{ success: boolean; message: string }> {
    const devices = this.load();
    const device = devices.find((d) => d.id === deviceId);
    if (!device) {
      return { success: false, message: 'Device not found.' };
    }
    if (device.status === 'offline') {
      return { success: false, message: `${device.name} is currently offline.` };
    }

    // Simulate realistic execution
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: `✓ Command "${command}" executed successfully on ${device.name}.`,
    };
  }
}

export const deviceRepository = new MockDeviceRepository();
