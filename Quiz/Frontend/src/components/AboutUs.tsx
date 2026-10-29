import React from 'react';
import { ActiveView } from '../types';
import { Icon } from './Icons';

interface AboutUsProps {
  setActiveView: (view: ActiveView) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ setActiveView, onOpenAuth }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in text-slate-100">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/35 text-violet-300 text-xs font-medium mb-6 backdrop-blur-md">
          <Icon.Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>About QuizMaster Platform</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Standardizing Higher Education <span className="gradient-text">Evaluations</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          QuizMaster is a next-generation academic examination platform built to empower universities,
          instructors, and students with authentic evaluations, anti-cheat security, and instant performance insights.
        </p>
      </div>

      {/* 3D Visual Banner */}
      <div className="relative mb-20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-panel p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/20 bg-black/50">
          <img
            src="/quizmaster-logo.jpg"
            alt="QuizMaster Emblem"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-left">
          <div className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-2">
            Institutional Mission
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            Academic Integrity Meets Modern Engineering
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">
            Traditional examination systems lack responsiveness and transparent analytics. QuizMaster bridges the gap by delivering
            standardized question banks, real-time focus detection, and rigorous scoring algorithms that guarantee fair and reliable outcomes for every candidate.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Certified Curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Anti-Cheat Proctoring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Faculty Oversight</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Platform Pillars */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            Built on Four Academic Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Designed in accordance with modern university accreditation requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card liquid-glass p-8 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl gradient-violet flex items-center justify-center text-white mb-5 shadow-lg">
              <Icon.Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-3">
              1. Uncompromising Academic Integrity
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Real-time browser blur detection, focus tracking, and automated transgression logging ensure that candidate assessments reflect genuine competence without compromises.
            </p>
          </div>

          <div className="card liquid-glass p-8 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white mb-5 shadow-lg">
              <Icon.Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-3">
              2. Instant Scoring & Deep Feedback
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              No waiting weeks for examination results. Students immediately receive detailed question-by-question explanations, knowledge gap identification, and time-efficiency statistics.
            </p>
          </div>

          <div className="card liquid-glass p-8 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-5 shadow-lg">
              <Icon.Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-3">
              3. Faculty Question Authoring Hub
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Lecturers have full administrative control to author, edit, publish, and curate topical questions, set custom time allowances, and monitor candidate performance distributions.
            </p>
          </div>

          <div className="card liquid-glass p-8 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-5 shadow-lg">
              <Icon.Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-3">
              4. Transparent Peer Ranking & Growth
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Our dynamic percentile and leaderboard algorithms motivate students through peer benchmarking, transparent standings, and historical achievement records.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card p-10 sm:p-12 text-center rounded-3xl gradient-violet relative overflow-hidden shadow-2xl">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -top-20 -right-20" />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
            Ready to Validate Your Knowledge?
          </h2>
          <p className="text-sm text-white/85 font-sans mb-8 leading-relaxed">
            Join thousands of university candidates taking standardized evaluations. Sign in with your institutional credentials or explore available topics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveView('home')}
              className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl hover:bg-slate-100 transition-all"
            >
              Explore Assessments
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-full border-2 border-white text-white font-bold text-xs tracking-wider uppercase hover:bg-white/10 transition-all"
            >
              Create Candidate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
