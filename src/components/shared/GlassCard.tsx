import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'cyan' | 'magenta' | 'none';
  variant?: 'default' | 'elevated' | 'interactive';
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'none',
  variant = 'default',
  onClick,
  id,
}) => {
  const glowClasses = {
    purple: 'hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] border-purple-500/20',
    blue: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] border-blue-500/20',
    cyan: 'hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)] border-cyan-500/20',
    magenta: 'hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)] border-pink-500/20',
    none: 'border-white/10 hover:border-white/20',
  };

  const bgClasses = {
    default: 'bg-[#0B0B18]/75 backdrop-blur-md',
    elevated: 'bg-[#121225]/85 backdrop-blur-xl border-purple-500/20 shadow-xl',
    interactive: 'bg-[#0B0B18]/80 backdrop-blur-md hover:bg-[#121225]/90 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${bgClasses[variant]} ${glowClasses[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
};
