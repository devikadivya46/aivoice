import React, { useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { JarvisOrb } from '../shared/JarvisOrb';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, isFirstLaunch } = useJarvis();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFirstLaunch) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isFirstLaunch, setCurrentScreen]);

  return (
    <div
      id="splash-screen"
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#05050D] p-6 overflow-hidden select-none"
    >
      {/* Ambient background particles and gradient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-purple-600/20 via-blue-600/10 to-transparent blur-3xl" />
      <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-cyan-500/15 blur-2xl animate-pulse" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-60 animate-ping duration-1000" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-purple-400 opacity-50 animate-pulse duration-700" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 rounded-full bg-pink-400 opacity-70 animate-bounce duration-1000" />
      </div>

      {/* Center JARVIS Orb */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8">
          <JarvisOrb state="thinking" size="xl" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              JARVIS AI
            </h1>
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin duration-3000" />
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-medium tracking-wide">
            Your Personal AI Assistant
          </p>

          <div className="pt-3 flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              ● Online & Ready
            </span>
          </div>
        </div>

        {/* Manual Skip Button */}
        <button
          onClick={() => setCurrentScreen(isFirstLaunch ? 'onboarding' : 'home')}
          className="mt-12 flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
        >
          <span>Enter Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[11px] text-slate-500 font-mono">
        NEURAL ARCHITECTURE • QUANTUM CORE v3.4
      </div>
    </div>
  );
};
