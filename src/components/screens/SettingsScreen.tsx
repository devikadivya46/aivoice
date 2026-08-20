import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { GlassCard } from '../shared/GlassCard';
import {
  User,
  Mic,
  Shield,
  Layers,
  Sparkles,
  Volume2,
  Lock,
  Calendar,
  Video,
  Mail,
  Users,
  Laptop,
  Smartphone,
  Check,
  Power,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    user,
    setUser,
    voiceSettings,
    setVoiceSettings,
    securityPermissions,
    setSecurityPermissions,
    integrations,
    toggleIntegration,
  } = useJarvis();

  const [activeSection, setActiveSection] = useState<'profile' | 'voice' | 'security' | 'integrations'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getIntegrationIcon = (name: string) => {
    switch (name) {
      case 'Google Calendar':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      case 'Google Meet':
        return <Video className="w-5 h-5 text-cyan-400" />;
      case 'Gmail & Workspace':
        return <Mail className="w-5 h-5 text-pink-400" />;
      case 'HRMS & Team Portal':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'Desktop Remote Agent':
        return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'Android Mobile Daemon':
        return <Smartphone className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div id="settings-screen" className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              SYSTEM CONFIGURATION & SECURITY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & Integrations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Tune neural voice synthesis, risk tiers, connected APIs, and user identity.
          </p>
        </div>

        {isSaved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse">
            <Check className="w-3.5 h-3.5" /> Saved & Synchronized
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'User Profile', icon: <User className="w-4 h-4" /> },
          { id: 'voice', label: 'Voice & AI Assistant', icon: <Mic className="w-4 h-4" /> },
          { id: 'security', label: 'Security & Risk Tiers', icon: <Shield className="w-4 h-4" /> },
          { id: 'integrations', label: 'Connected Integrations', icon: <Layers className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <GlassCard className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-lg"
            />
            <div>
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <p className="text-xs text-purple-300">{user.role}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{user.organization}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Role / Designation</label>
              <input
                type="text"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Organization</label>
              <input
                type="text"
                value={user.organization}
                onChange={(e) => setUser({ ...user, organization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#070714] border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold shadow-md active:scale-95"
          >
            Save Profile
          </button>
        </GlassCard>
      )}

      {/* Voice Settings Section */}
      {activeSection === 'voice' && (
        <GlassCard className="p-5 sm:p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            NEURAL VOICE & WAKE WORD ENGINE
          </h3>

          <div className="space-y-4 text-xs">
            {/* Auto Speak Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070714] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">Auto Speak Audio Output</p>
                <p className="text-[11px] text-slate-400">JARVIS will verbally synthesize replies via Web Audio</p>
              </div>
              <input
                type="checkbox"
                checked={voiceSettings.autoSpeak}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, autoSpeak: e.target.checked })}
                className="w-4 h-4 accent-purple-600 rounded"
              />
            </div>

            {/* Wake Word Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070714] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">Wake Word Activation ("Hey JARVIS")</p>
                <p className="text-[11px] text-slate-400">Listen for hotword when assistant screen is in focus</p>
              </div>
              <input
                type="checkbox"
                checked={voiceSettings.wakeWordEnabled}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, wakeWordEnabled: e.target.checked })}
                className="w-4 h-4 accent-purple-600 rounded"
              />
            </div>

            {/* Voice Speed Slider */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Voice Speech Rate</span>
                <span className="font-mono text-purple-300">{voiceSettings.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={voiceSettings.voiceSpeed}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, voiceSpeed: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Voice Pitch Slider */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Voice Pitch</span>
                <span className="font-mono text-cyan-300">{voiceSettings.voicePitch}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={voiceSettings.voicePitch}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, voicePitch: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </GlassCard>
      )}

      {/* Security & Risk Tiers */}
      {activeSection === 'security' && (
        <GlassCard className="p-5 sm:p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            AI ACTION PERMISSION TIERS
          </h3>

          <div className="space-y-3 text-xs">
            {/* Low Risk */}
            <div className="p-3.5 rounded-xl bg-[#070714] border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <p className="text-xs font-semibold text-white">Low-Risk Actions</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Calendar queries, task reading, reading telemetry, system time
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-semibold">
                Automatically execute
              </span>
            </div>

            {/* Medium Risk */}
            <div className="p-3.5 rounded-xl bg-[#070714] border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <p className="text-xs font-semibold text-white">Medium-Risk Actions</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Creating calendar meetings, delegating tasks, remote app launch (VS Code)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/30 font-semibold">
                Ask confirmation card
              </span>
            </div>

            {/* High Risk */}
            <div className="p-3.5 rounded-xl bg-[#070714] border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <p className="text-xs font-semibold text-white">High-Risk Actions</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Deleting schedule blocks, bulk employee reassignment, device shutdown
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-500/30 font-semibold">
                Always require explicit approval
              </span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Integrations Manager */}
      {activeSection === 'integrations' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Connected Workspaces & Hardware Daemons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => (
              <GlassCard key={item.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#070714] border border-white/10">
                      {getIntegrationIcon(item.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{item.name}</h4>
                      <span className="text-[10px] text-purple-300 font-mono">{item.category}</span>
                    </div>
                  </div>

                  {item.connected ? (
                    <span className="text-xs text-emerald-400 font-mono font-bold">● Active</span>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">○ Off</span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Sync: {item.lastSync}</span>
                  <button
                    onClick={() => toggleIntegration(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.connected
                        ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    }`}
                  >
                    {item.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
