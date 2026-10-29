import React, { useState } from 'react';
import { AuthUser } from '../types';
import { api } from '../api';
import { Icon } from './Icons';
import { CustomDropdown } from './CustomDropdown';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
  promptMessage,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(
    initialMode === 'register' ? 'register' : 'login'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Helper to generate official university format ID
  const generateIdForRole = (role: 'student' | 'lecturer' | 'admin') => {
    if (role === 'student') return `EG/2024/${Math.floor(1000 + Math.random() * 9000)}`;
    if (role === 'lecturer') return `LEC-${Math.floor(100 + Math.random() * 900)}`;
    return `ADM-${Math.floor(100 + Math.random() * 900)}`;
  };

  // Sign up form state (ID is automatically assigned on creation)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'student' | 'lecturer' | 'admin'>('student');
  const [signupIdentifier, setSignupIdentifier] = useState(() => generateIdForRole('student'));

  // 2-Factor Authentication (2FA) State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingUser2FA, setPendingUser2FA] = useState<AuthUser | null>(null);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    setPendingNotice(null);

    try {
      const data = await api.login({ email: loginEmail, password: loginPassword });
      if (data.user) {
        // Direct to 2-Factor Authentication verification step
        setPendingUser2FA(data.user);
        setIs2FAStep(true);
        setTwoFactorCode('');
      }
    } catch (err: any) {
      const msg = err.message || 'Invalid credentials.';
      if (msg.includes('Pending Approval') || err.pendingApproval) {
        setPendingNotice(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (twoFactorCode.trim().length !== 6) {
      setError('2FA verification code must be exactly 6 digits.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (pendingUser2FA) {
        onSuccess(pendingUser2FA);
      }
    }, 400);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setPendingNotice(null);

    const finalId = signupIdentifier.trim() || generateIdForRole(signupRole);

    try {
      const data = await api.register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        identifier: finalId,
      });

      if (data.pendingApproval) {
        // Lecturer or Admin requires admin approval
        setPendingNotice(
          `Your ${signupRole.toUpperCase()} account has been registered successfully! Because this role requires faculty authorization, it is now pending approval by the System Administrator. You can sign in once an Administrator verifies and approves your access.`
        );
        setAuthMode('login');
      } else if (data.user) {
        // Students are immediately approved
        onSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotIdentifier || !forgotNewPassword) {
      setError('Please fill in all verification fields.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match. Please verify and re-enter.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await api.resetPassword({
        email: forgotEmail,
        identifier: forgotIdentifier,
        newPassword: forgotNewPassword,
      });
      setSuccessMessage(res.message || 'Password reset successfully! You can now sign in.');
      setLoginEmail(forgotEmail);
      setLoginPassword('');
      setTimeout(() => {
        setAuthMode('login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your email and ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card liquid-glass max-w-4xl w-full min-h-[520px] rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/40 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
        >
          <Icon.X className="w-4 h-4" />
        </button>

        {/* Left Side: Interactive Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {promptMessage && !pendingNotice && (
            <div className="mb-4 p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 flex items-center gap-2">
              <Icon.Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{promptMessage}</span>
            </div>
          )}

          {/* Pending Approval Notice */}
          {pendingNotice && (
            <div className="mb-5 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 animate-slide-up space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <Icon.Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Pending Administrator Approval</span>
              </div>
              <p className="font-sans leading-relaxed text-slate-300 text-[11px]">
                {pendingNotice}
              </p>
              <div className="text-[10px] text-amber-400/80 font-mono pt-1 border-t border-amber-500/20">
                Staff & Instructor access requires verification by admin@quizmaster.lk.
              </div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <Icon.CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <Icon.AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              {authMode === 'register'
                ? 'Create Account'
                : authMode === 'forgot'
                ? 'Reset Password'
                : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              {authMode === 'register'
                ? 'Register for an academic assessment account'
                : authMode === 'forgot'
                ? 'Verify your student or staff ID to configure a new password'
                : 'Sign in to access your assessments and academic dashboard'}
            </p>
          </div>

          {/* MODE 1: FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  REGISTERED EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={e => {
                    setForgotEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. student@quizmaster.lk"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  STUDENT / STAFF ID *
                </label>
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={e => {
                    setForgotIdentifier(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. EG/2021/1001 or LEC-4307"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  NEW PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  value={forgotNewPassword}
                  onChange={e => {
                    setForgotNewPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  CONFIRM NEW PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  value={forgotConfirmPassword}
                  onChange={e => {
                    setForgotConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-xs py-2.5 mt-2 glow-violet font-semibold"
              >
                {loading ? 'Verifying & Updating...' : 'RESET PASSWORD'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGN UP */}
          {authMode === 'register' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="e.g. Kasun Wickramasinghe"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="name@university.lk"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    ROLE *
                  </label>
                  <CustomDropdown
                    value={signupRole}
                    onChange={val => {
                      const r = val as 'student' | 'lecturer' | 'admin';
                      setSignupRole(r);
                      setSignupIdentifier(generateIdForRole(r));
                    }}
                    options={[
                      { value: 'student', label: 'Student Candidate', icon: '🎓' },
                      { value: 'lecturer', label: 'Lecturer / Instructor', icon: '👨‍🏫' },
                      { value: 'admin', label: 'Administrator', icon: '🛡️' },
                    ]}
                    buttonClassName="py-2 text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <label className="block text-[11px] font-mono text-slate-400 font-medium">
                        {signupRole === 'student' ? 'STUDENT ID' : 'STAFF ID'}
                      </label>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                        🔒 READ-ONLY
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupIdentifier(generateIdForRole(signupRole))}
                      className="text-[10px] font-mono text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20"
                      title="Auto-generate a new ID"
                    >
                      <span>🎲</span>
                      <span>New ID</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      required
                      value={signupIdentifier}
                      aria-readonly="true"
                      onKeyDown={e => {
                        // Prevent manual editing while allowing copy (Cmd/Ctrl + C)
                        if (!(e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full bg-slate-900/90 border border-violet-500/40 rounded-xl pl-3 pr-24 py-2 text-xs text-violet-300 font-mono font-bold cursor-not-allowed select-all focus:outline-none"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                      <span className="text-[9px] text-slate-400 bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-full font-sans font-medium">
                        System Assigned
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 flex items-center gap-1.5 -mt-1">
                <span>🔒</span>
                <span>System auto-assigned ID is read-only and permanently linked upon registration.</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-amber w-full text-xs py-2.5 mt-2 glow-amber font-semibold text-slate-950"
              >
                {loading ? 'Creating Profile...' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}

          {/* MODE 3: SIGN IN (With Two-Factor Authentication 2FA) */}
          {authMode === 'login' && is2FAStep && pendingUser2FA ? (
            <form onSubmit={handleVerify2FA} className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Icon.Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>2-Factor Authentication (2FA)</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                    Security verification code sent to <span className="font-mono text-emerald-300">{pendingUser2FA.email}</span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono text-slate-400">
                    ENTER 6-DIGIT VERIFICATION CODE *
                  </label>
                  <button
                    type="button"
                    onClick={() => setTwoFactorCode('123456')}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline font-semibold"
                  >
                    Quick-Fill: 123456
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full bg-slate-900/80 border border-emerald-500/40 rounded-xl px-4 py-3 text-base text-center font-mono tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-400 font-bold"
                />
                <p className="text-[10px] text-slate-400 font-sans mt-1 text-center">
                  Enter any 6-digit code or click <span className="text-emerald-400 font-mono font-bold">Quick-Fill: 123456</span> to complete authentication.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Icon.RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <Icon.CheckCircle className="w-4 h-4" />
                    <span>Verify 2FA & Enter Portal</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIs2FAStep(false);
                  setPendingUser2FA(null);
                  setTwoFactorCode('');
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors py-1"
              >
                ← Back to Password Sign In
              </button>
            </form>
          ) : authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => {
                    setLoginEmail(e.target.value);
                    setError('');
                    setPendingNotice(null);
                  }}
                  placeholder="e.g. student@quizmaster.lk"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono text-slate-400">PASSWORD</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setError('');
                      setPendingNotice(null);
                      setSuccessMessage('');
                      if (loginEmail) setForgotEmail(loginEmail);
                    }}
                    className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => {
                    setLoginPassword(e.target.value);
                    setError('');
                    setPendingNotice(null);
                  }}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-xs py-2.5 mt-2 glow-violet font-semibold"
              >
                {loading ? 'Authenticating...' : 'SIGN IN (WITH 2FA)'}
              </button>
            </form>
          )}

          {/* Toggle between Sign In / Sign Up */}
          {authMode !== 'forgot' && (
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <span className="text-xs text-slate-400">
                {authMode === 'register' ? 'Already registered?' : "Don't have an account yet?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'register' ? 'login' : 'register');
                    setError('');
                    setPendingNotice(null);
                    setSuccessMessage('');
                  }}
                  className="text-violet-400 hover:text-violet-300 font-semibold underline ml-1"
                >
                  {authMode === 'register' ? 'Sign In' : 'Sign Up'}
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Right Side: QuizMaster 3D Emblem & Branded Overlay */}
        <div className="w-full md:w-1/2 gradient-violet p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xs flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border border-white/20 mb-6 bg-black/30 backdrop-blur-md">
              <img
                src="/quizmaster-logo.jpg"
                alt="QuizMaster Emblem"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              {authMode === 'register'
                ? 'Academic Gateway'
                : authMode === 'forgot'
                ? 'Secure Recovery'
                : 'University Portal'}
            </h3>

            <p className="text-xs text-white/85 font-sans mb-8 leading-relaxed">
              {authMode === 'register'
                ? 'Register to attempt examination sessions, view instant grading feedback, and track your ranking.'
                : authMode === 'forgot'
                ? 'Confirm your institutional identity to securely configure and restore your account credentials.'
                : 'Access certified academic assessments, automated score analytics, and official faculty oversight.'}
            </p>

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'register' ? 'login' : 'register');
                setError('');
                setPendingNotice(null);
                setSuccessMessage('');
              }}
              className="px-6 py-2.5 rounded-full border-2 border-white/80 text-white font-semibold text-xs tracking-wider uppercase hover:bg-white hover:text-violet-900 transition-all shadow-lg"
            >
              {authMode === 'register' ? 'SIGN IN INSTEAD' : 'CREATE ACCOUNT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
