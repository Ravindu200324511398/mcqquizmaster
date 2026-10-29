import React from 'react';
import { ActiveView, AuthUser } from '../types';
import { Icon } from './Icons';

interface HeroSectionProps {
  onExplore: () => void;
  setActiveView: (view: ActiveView) => void;
  totalQuizzes: number;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register', prompt?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  setActiveView,
  totalQuizzes,
  currentUser,
  onOpenAuth,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(e => console.log('Autoplay deferred:', e));
    }
  }, []);

  return (
    <section className="relative pt-12 pb-20 px-4 lg:px-8 overflow-hidden text-center">
      {/* Background AI Video Animation (Quiz Tech AI Digital Stream) */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/quizmaster-hero-poster.jpg"
          className="w-full h-full object-cover opacity-50 scale-100 transition-opacity duration-1000"
          src="/quiz-tech-background.mp4"
        />
        {/* Deep Obsidian Multi-Stop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090f]/20 via-[#07090f]/60 to-[#07090f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      </div>

      {/* Decorative ambient light orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-violet-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[380px] h-[260px] bg-amber-500/15 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/35 text-violet-300 text-xs font-medium mb-6 shadow-md backdrop-blur-md animate-pulse-glow">
          <Icon.Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Official University Assessment Platform • Secure Examination Portal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
          Elevate Your <span className="gradient-text">Academic Mastery</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 font-sans leading-relaxed drop-shadow">
          High-performance assessment platform featuring rigorous evaluation standards,
          real-time anti-cheat proctoring, instant score breakdowns, and authenticated faculty administration.
        </p>

        {/* Action Buttons - Role-Filtered */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth('login', 'Please sign in to begin an official assessment session.');
              } else {
                onExplore();
              }
            }}
            className="btn-primary text-sm py-3 px-6 shadow-2xl glow-violet"
          >
            <Icon.Play className="w-4 h-4 text-violet-200 fill-violet-200" />
            <span>Start an Assessment</span>
            <Icon.ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {!currentUser ? (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary text-sm py-3 px-6"
              >
                <Icon.Users className="w-4 h-4 text-violet-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn-amber text-sm py-3 px-6 glow-amber text-slate-950 font-semibold"
              >
                <span>Sign Up Free</span>
              </button>
            </>
          ) : (
            <>
              {currentUser.role === 'student' && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="btn-secondary text-sm py-3 px-6"
                >
                  <Icon.BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>My Analytics</span>
                </button>
              )}
              {currentUser.role === 'lecturer' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className="btn-amber text-sm py-3 px-6 glow-amber text-slate-950 font-semibold"
                >
                  <Icon.Layers className="w-4 h-4" />
                  <span>Lecturer Portal</span>
                </button>
              )}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className="btn-amber text-sm py-3 px-6 glow-amber text-slate-950 font-semibold"
                >
                  <Icon.Shield className="w-4 h-4" />
                  <span>Admin Hub</span>
                </button>
              )}
              <button
                onClick={() => setActiveView('leaderboard')}
                className="btn-ghost text-sm py-3 px-4 text-slate-300 hover:text-white"
              >
                <Icon.Trophy className="w-4 h-4 text-yellow-400" />
                <span>Rankings</span>
              </button>
            </>
          )}
        </div>

        {/* Real-Time Platform Stats Grid - Professional Academic Terms */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
          <div className="card p-4 text-left backdrop-blur-xl bg-slate-900/60 border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Curriculum Topics</span>
              <Icon.BookOpen className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalQuizzes} Modules</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">Web, Software, Data</div>
          </div>

          <div className="card p-4 text-left backdrop-blur-xl bg-slate-900/60 border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Academic Integrity</span>
              <Icon.Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300">Accredited</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Standardized Rubric</div>
          </div>

          <div className="card p-4 text-left backdrop-blur-xl bg-slate-900/60 border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Examination Security</span>
              <Icon.CheckCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-300">Anti-Cheat</div>
            <div className="text-[11px] text-rose-400/80 mt-1 font-mono">Focus & Tab Monitored</div>
          </div>

          <div className="card p-4 text-left backdrop-blur-xl bg-slate-900/60 border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Grading Engine</span>
              <Icon.Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-300">Instant</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Automated Evaluation</div>
          </div>
        </div>
      </div>
    </section>
  );
};
