import React, { useState, useRef, useEffect } from 'react';
import { ActiveView, AuthUser } from '../types';
import { Icon } from './Icons';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register', prompt?: string) => void;
  onSignOut: () => void;
  backendOnline: boolean;
  onOpenEditProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenAuth,
  onSignOut,
  backendOnline,
  onOpenEditProfile,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [profileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center glow-violet shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-0.5">
            <img
              src="/quizmaster-logo.jpg"
              alt="QuizMaster"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight gradient-text">
                QuizMaster
              </span>
              <span className="text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ACADEMIC PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-wide hidden sm:block">
              Official University Examination Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Role-Filtered */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] backdrop-blur-md">
          {/* Always visible: Assessments (Home) */}
          <button
            onClick={() => setActiveView('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeView === 'home'
                ? 'bg-violet-600/30 text-white border border-violet-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon.BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span>Assessments</span>
          </button>

          {/* Student-Only Tab: My Analytics */}
          {currentUser && currentUser.role === 'student' && (
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeView === 'dashboard' || activeView === 'analytics'
                  ? 'bg-violet-600/30 text-white border border-violet-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon.BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>My Analytics</span>
            </button>
          )}

          {/* Authenticated Users Tab: Leaderboard */}
          {currentUser && (
            <button
              onClick={() => setActiveView('leaderboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeView === 'leaderboard'
                  ? 'bg-violet-600/30 text-white border border-violet-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon.Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Leaderboard</span>
            </button>
          )}

          {/* Lecturer Tab: Faculty Portal */}
          {currentUser && currentUser.role === 'lecturer' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeView === 'admin'
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon.Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Lecturer Portal</span>
            </button>
          )}

          {/* Admin Tab: Administrator Hub */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeView === 'admin'
                  ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon.Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Admin Hub</span>
            </button>
          )}

          {/* About Us Tab */}
          <button
            onClick={() => setActiveView('about')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeView === 'about'
                ? 'bg-violet-600/30 text-white border border-violet-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon.Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>About Us</span>
          </button>

          {/* Help & FAQ Tab */}
          <button
            onClick={() => setActiveView('help')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeView === 'help'
                ? 'bg-violet-600/30 text-white border border-violet-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon.HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Help & FAQ</span>
          </button>
        </nav>

        {/* Right Actions: Auth or Profile */}
        <div className="flex items-center gap-3">
          {/* Server status pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/10 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="text-slate-300 font-mono text-[10px]">
              {backendOnline ? 'System Secure' : 'Offline'}
            </span>
          </div>

          {!currentUser ? (
            /* Unauthenticated Visitor: Sign In and Sign Up buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary text-xs py-2 px-3.5 font-medium"
              >
                <Icon.Users className="w-3.5 h-3.5 text-slate-300" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="btn-primary text-xs py-2 px-4 glow-violet font-semibold"
              >
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            /* Authenticated User: Professional Profile Menu */
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(prev => !prev)}
                className="flex items-center gap-2.5 bg-slate-900/80 hover:bg-slate-800/90 pl-2.5 pr-3 py-1.5 rounded-xl border border-white/10 hover:border-violet-500/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden gradient-violet flex items-center justify-center font-bold text-white text-xs shadow-md border border-white/20 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    <span
                      className={
                        currentUser.role === 'admin'
                          ? 'text-rose-400 font-semibold'
                          : currentUser.role === 'lecturer'
                          ? 'text-amber-400 font-semibold'
                          : 'text-violet-400 font-semibold'
                      }
                    >
                      {currentUser.role === 'admin'
                        ? 'Administrator'
                        : currentUser.role === 'lecturer'
                        ? 'Lecturer'
                        : 'Candidate'}
                    </span>{' '}
                    • {currentUser.identifier || 'EG/2021'}
                  </div>
                </div>
                <Icon.ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ml-0.5 ${
                    profileMenuOpen ? 'rotate-180 text-violet-400' : ''
                  }`}
                />
              </button>

              {/* Floating Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 z-50 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80 p-3 origin-top-right animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px -5px rgba(124, 58, 237, 0.25)',
                  }}
                >
                  {/* User Profile Card Header */}
                  <div className="flex items-center gap-3 p-2 bg-white/[0.03] rounded-xl border border-white/5 mb-2">
                    <div
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onOpenEditProfile?.();
                      }}
                      className="relative group w-11 h-11 rounded-xl overflow-hidden gradient-violet flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0 cursor-pointer border border-violet-500/30 hover:border-violet-400 transition-all"
                      title="Click to edit profile & photo"
                    >
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0).toUpperCase()
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Icon.Camera className="w-4 h-4 text-violet-300" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {currentUser.email}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                            currentUser.role === 'admin'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : currentUser.role === 'lecturer'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                          }`}
                        >
                          {currentUser.role}
                        </span>
                        {currentUser.identifier && (
                          <span className="text-[9px] font-mono text-slate-400">
                            {currentUser.identifier}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile & Photo Action */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenEditProfile?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-violet-200 bg-violet-600/15 hover:bg-violet-600/30 border border-violet-500/30 transition-all text-left mb-2 group"
                  >
                    <Icon.Edit className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
                    <span>Edit Profile & Photo</span>
                  </button>

                  {/* Role Specific Actions */}
                  <div className="space-y-1">
                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          setActiveView('analytics');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                      >
                        <Icon.BarChart3 className="w-4 h-4 text-violet-400" />
                        <span>My Analytics & Progress</span>
                      </button>
                    )}

                    {(currentUser.role === 'admin' || currentUser.role === 'lecturer') && (
                      <button
                        onClick={() => {
                          setActiveView('admin');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                      >
                        <Icon.Shield className="w-4 h-4 text-amber-400" />
                        <span>
                          {currentUser.role === 'admin' ? 'Admin Portal & Approvals' : 'Lecturer Portal'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveView('leaderboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Icon.Trophy className="w-4 h-4 text-yellow-400" />
                      <span>Cohort Leaderboard</span>
                    </button>
                  </div>

                  <div className="my-2 border-t border-white/10" />

                  {/* Clean Professional Sign Out Button */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all text-left"
                  >
                    <Icon.LogOut className="w-4 h-4" />
                    <span>Sign Out of QuizMaster</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
