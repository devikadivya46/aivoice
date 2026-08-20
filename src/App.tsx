import React from 'react';
import { JarvisProvider, useJarvis } from './context/JarvisContext';
import { TopBar } from './components/shared/TopBar';
import { Sidebar } from './components/shared/Sidebar';
import { AiPanel } from './components/shared/AiPanel';
import { BottomNavigation } from './components/shared/BottomNavigation';
import { GlobalFloatingOrb } from './components/shared/GlobalFloatingOrb';
import { CommandPalette } from './components/shared/CommandPalette';
import { VoiceCommandsModal } from './components/shared/VoiceCommandsModal';
import { FollowUpPromptBar } from './components/shared/FollowUpPromptBar';
import { ScheduledMeetingReminderBanner } from './components/shared/ScheduledMeetingReminderBanner';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { AssistantScreen } from './components/screens/AssistantScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { MeetingsScreen } from './components/screens/MeetingsScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { HrmsScreen } from './components/screens/HrmsScreen';
import { DevicesScreen } from './components/screens/DevicesScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const MainAppContent: React.FC = () => {
  const {
    currentScreen,
    isAiPanelOpen,
    isVoiceCommandsModalOpen,
    setIsVoiceCommandsModalOpen,
  } = useJarvis();

  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen />;
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'assistant':
        return <AssistantScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'meetings':
        return <MeetingsScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'hrms':
        return <HrmsScreen />;
      case 'devices':
        return <DevicesScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05050D] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-cyan-300 relative overflow-x-hidden">
      {/* Background Neural Grid Pattern & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-30">
        <TopBar />
      </div>

      {/* Main Responsive Body Layout */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Center Screen Viewport */}
        <main
          id="main-scroll-container"
          className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 transition-all duration-300 ${
            isAiPanelOpen && currentScreen !== 'assistant' ? 'xl:mr-0' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">{renderActiveScreen()}</div>
        </main>

        {/* Right Desktop AI Panel (Only shown on large desktop when not on assistant screen) */}
        {currentScreen !== 'assistant' && <AiPanel />}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Draggable Global Floating Orb (When outside Assistant screen) */}
      <GlobalFloatingOrb />

      {/* Global Command Palette (Cmd + K / Ctrl + K) */}
      <CommandPalette />

      {/* Proactive Follow-up Question Floating Prompt Bar */}
      <FollowUpPromptBar />

      {/* Proactive Scheduled Meeting Reminder Banner */}
      <ScheduledMeetingReminderBanner />

      {/* Available Voice Commands Modal (Shift + V / ?) */}
      <VoiceCommandsModal
        isOpen={isVoiceCommandsModalOpen}
        onClose={() => setIsVoiceCommandsModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <JarvisProvider>
      <MainAppContent />
    </JarvisProvider>
  );
}

export default App;
