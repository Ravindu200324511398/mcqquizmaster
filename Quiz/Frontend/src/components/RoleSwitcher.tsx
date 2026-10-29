import React, { useState } from 'react';
import { Role } from '../types';
import { Icon } from './Icons';

interface RoleSwitcherProps {
  currentRole: Role;
  onSwitch: (role: Role) => void;
}

const roleConfigs: Record<Role, { label: string; badgeClass: string; color: string; desc: string }> = {
  student: {
    label: 'Student Candidate',
    badgeClass: 'badge-violet',
    color: '#a78bfa',
    desc: 'Take timed tests, track analytics & climb leaderboard'
  },
  admin: {
    label: 'Lecturer / Admin',
    badgeClass: 'badge-amber',
    color: '#fcd34d',
    desc: 'Full CRUD operations: create, edit & delete quizzes & MCQs'
  },
  examiner: {
    label: 'Chief Proctor',
    badgeClass: 'badge-rose',
    color: '#fda4af',
    desc: 'Monitor real-time anti-cheat proctoring & integrity audits'
  }
};

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onSwitch }) => {
  const [open, setOpen] = useState(false);
  const roles: Role[] = ['student', 'admin', 'examiner'];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="card p-2 w-64 mb-3 animate-slide-up shadow-2xl border border-violet-500/20 bg-[#0d1120]/95 backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-medium px-3 py-1.5 mb-1 border-b border-white/5 flex items-center justify-between">
            <span>Switch Role (Live Demo)</span>
            <span className="text-[10px] text-violet-400 font-mono">StageLink Role Mode</span>
          </div>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => {
                onSwitch(r);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all mb-1 flex flex-col ${
                currentRole === r
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{roleConfigs[r].label}</span>
                {currentRole === r && (
                  <span className="text-[10px] bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded-full font-mono">
                    active
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 mt-0.5">{roleConfigs[r].desc}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="btn-primary flex items-center gap-2 shadow-2xl glow-violet px-4 py-2.5 rounded-xl border border-violet-400/40"
      >
        <Icon.Users className="w-4 h-4 text-violet-200" />
        <span className="text-sm font-medium tracking-wide">{roleConfigs[currentRole].label}</span>
        <Icon.ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
