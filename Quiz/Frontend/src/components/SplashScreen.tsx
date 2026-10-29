import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number; // milliseconds, default 2000
  title?: string;
  statusMessage?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2000,
  title = 'QUIZMASTER',
  statusMessage = 'CONNECTING...',
}) => {
  const [progress, setProgress] = useState(10);
  const [currentStatus, setCurrentStatus] = useState(statusMessage);

  useEffect(() => {
    const statuses = [
      'CONNECTING...',
      'VERIFYING ACADEMIC CREDENTIALS...',
      'LOADING SECURE PROTOCOLS...',
      'SYNCHRONIZING ROLE DASHBOARD...',
    ];

    let step = 0;
    const statusInterval = setInterval(() => {
      step = (step + 1) % statuses.length;
      setCurrentStatus(statuses[step]);
    }, duration / 4);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(progressInterval);
        clearInterval(statusInterval);
        if (onComplete) onComplete();
      }
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 select-none animate-fade-in">
      {/* Ambient background glow */}
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Glowing 3D Emblem Logo */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
            <img
              src="/quizmaster-logo.jpg"
              alt="QuizMaster 3D Logo"
              className="w-full h-full object-cover scale-105 animate-float"
            />
          </div>
        </div>

        {/* Brand Text */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white uppercase mb-3 font-display drop-shadow-md">
          {title}
        </h1>

        {/* StageLink-style Triple Category Subtitle */}
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] text-slate-400 uppercase mb-10 font-mono">
          LEARN &nbsp;|&nbsp; ASSESS &nbsp;|&nbsp; EXCEL
        </p>

        {/* Sleek StageLink-style Loading Bar */}
        <div className="w-64 sm:w-80 h-1 bg-white/10 rounded-full overflow-hidden mb-4 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <span className="text-[10px] tracking-[0.3em] font-mono text-slate-500 uppercase font-semibold h-4">
          {currentStatus}
        </span>
      </div>
    </div>
  );
};
