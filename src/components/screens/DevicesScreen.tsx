import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import {
  Smartphone,
  Laptop,
  Monitor,
  Battery,
  Cpu,
  HardDrive,
  Play,
  CheckCircle,
  Wifi,
  WifiOff,
  Sparkles,
  Lock,
  VolumeX,
} from 'lucide-react';

export const DevicesScreen: React.FC = () => {
  const { devices, executeDeviceCommand, assistantState, statusText } = useJarvis();
  const [selectedDevice, setSelectedDevice] = useState<string>(devices[1]?.id || devices[0]?.id);

  const activeDev = devices.find((d) => d.id === selectedDevice) || devices[0];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'desktop':
        return <Monitor className="w-5 h-5 text-blue-400" />;
      default:
        return <Laptop className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div id="devices-screen" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
            HARDWARE & REMOTE DAEMON NODES
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Device Center & Remote Control
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Dispatched RPC commands, telemetry, and background workspace orchestration.
        </p>
      </div>

      {/* Execution status toast if active */}
      {assistantState === 'executing' && (
        <div className="p-4 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs flex items-center justify-between shadow-xl animate-pulse">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            JARVIS RPC Signal: <strong className="text-white">{statusText}</strong>
          </span>
          <span className="font-mono text-[10px] text-cyan-300">ESTABLISHED</span>
        </div>
      )}

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => {
          const isSelected = selectedDevice === device.id;
          const isConnected = device.status === 'connected';

          return (
            <GlassCard
              key={device.id}
              variant="interactive"
              onClick={() => setSelectedDevice(device.id)}
              glowColor={isConnected ? 'cyan' : 'none'}
              className={`p-5 flex flex-col justify-between space-y-4 ${
                isSelected ? 'border-cyan-400/60 ring-1 ring-cyan-400/40 bg-[#121225]' : ''
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#070714] border border-white/10">
                    {getDeviceIcon(device.type)}
                  </div>

                  {isConnected ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                      <Wifi className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 font-mono">
                      <WifiOff className="w-3.5 h-3.5" /> Offline
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-white mt-3">{device.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{device.os}</p>

                {/* Telemetry meters */}
                {isConnected && (
                  <div className="mt-4 space-y-2 pt-3 border-t border-white/5 text-xs">
                    {device.battery !== undefined && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery
                        </span>
                        <span className="font-mono font-bold text-white">{device.battery}%</span>
                      </div>
                    )}

                    {device.cpuUsage !== undefined && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Load
                        </span>
                        <span className="font-mono font-bold text-white">{device.cpuUsage}%</span>
                      </div>
                    )}

                    {device.ramUsage !== undefined && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <HardDrive className="w-3.5 h-3.5 text-purple-400" /> Memory
                        </span>
                        <span className="font-mono font-bold text-white">{device.ramUsage}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                {device.ipAddress ? `IP: ${device.ipAddress}` : `Last Active: ${device.lastActive}`}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Selected Device Remote Action Control Center */}
      {activeDev && (
        <GlassCard glowColor="purple" className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Remote Command Center:</span>
                <span className="text-cyan-300">{activeDev.name}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct RPC execution dispatched over the secure JARVIS Daemon.
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
              Agent v2.8 Daemon Ready
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {activeDev.availableActions.map((action, idx) => (
              <button
                key={idx}
                disabled={activeDev.status === 'offline' || assistantState === 'executing'}
                onClick={() => executeDeviceCommand(activeDev.id, action)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-purple-950/60 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all text-left group active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-600/30 text-purple-400 group-hover:text-cyan-300 transition-colors">
                  <Play className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{action}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
