import React, { useState } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { JarvisOrb } from '../shared/JarvisOrb';
import { JarvisWaveform } from '../shared/JarvisWaveform';
import {
  Sparkles,
  Mic,
  Calendar,
  CheckCircle2,
  Video,
  Users,
  Laptop,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useJarvis();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Meet JARVIS',
      subtitle: 'Your intelligent assistant for work, meetings and everyday tasks.',
      renderVisual: () => (
        <div className="py-6 flex flex-col items-center justify-center">
          <JarvisOrb state="speaking" size="lg" />
          <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs text-purple-300 font-mono">
            <span>Core Neural Model Active</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Talk Naturally',
      subtitle: 'Speak to JARVIS or type your request with zero learning curve.',
      renderVisual: () => (
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            <div className="w-full h-full rounded-[14px] bg-[#0A0A1A] flex items-center justify-center">
              <Mic className="w-8 h-8 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <JarvisWaveform state="speaking" intensity={0.7} barsCount={24} className="h-12 w-64" />
          <p className="text-xs text-slate-400 font-mono">"Schedule a meeting with Rahul tomorrow at 3 PM"</p>
        </div>
      ),
    },
    {
      title: 'Let JARVIS Take Action',
      subtitle: 'Schedule meetings, manage tasks and organize your day autonomously.',
      renderVisual: () => (
        <div className="py-4 w-full max-w-sm">
          <div className="rounded-xl border border-purple-500/40 bg-[#121225]/90 p-4 shadow-xl text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                MEETING READY
              </span>
              <span className="text-emerald-400">Conflict Resolved</span>
            </div>
            <p className="text-sm font-semibold text-white">Product & Sprint Review</p>
            <p className="text-xs text-slate-300">Tomorrow • 3:00 PM – 3:30 PM • Google Meet</p>
            <div className="pt-2 flex gap-2">
              <span className="px-3 py-1 rounded-md bg-purple-600 text-white text-xs font-semibold">
                Auto-Scheduled
              </span>
              <span className="px-3 py-1 rounded-md bg-white/10 text-slate-300 text-xs">
                3 Participants
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Connect Your Workspace',
      subtitle: 'Unify Google Workspace, HRMS, and your workstation into one neural hub.',
      renderVisual: () => (
        <div className="py-3 grid grid-cols-2 gap-2.5 w-full max-w-sm">
          {[
            { name: 'Google Calendar', icon: <Calendar className="w-5 h-5 text-purple-400" /> },
            { name: 'Google Meet', icon: <Video className="w-5 h-5 text-cyan-400" /> },
            { name: 'HRMS & Team', icon: <Users className="w-5 h-5 text-pink-400" /> },
            { name: 'Devices & Laptop', icon: <Laptop className="w-5 h-5 text-blue-400" /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#121225]/80 border border-white/10 shadow-md text-left"
            >
              {item.icon}
              <div>
                <p className="text-xs font-semibold text-white">{item.name}</p>
                <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      id="onboarding-screen"
      className="min-h-screen flex flex-col items-center justify-between p-6 bg-[#05050D] text-center"
    >
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-extrabold tracking-wider text-slate-200 uppercase">
            JARVIS AI Setup
          </span>
        </div>
        <button
          onClick={completeOnboarding}
          className="text-xs text-slate-400 hover:text-slate-200 font-medium"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md my-auto flex flex-col items-center">
        {pages[currentPage].renderVisual()}

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
          {pages[currentPage].title}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-xs leading-relaxed">
          {pages[currentPage].subtitle}
        </p>

        {/* Indicator Dots */}
        <div className="flex items-center gap-2 mt-8">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === idx
                  ? 'w-7 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md flex items-center justify-between pb-4 gap-4">
        {currentPage > 0 ? (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        ) : (
          <div />
        )}

        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 ml-auto"
        >
          <span>{currentPage === pages.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
