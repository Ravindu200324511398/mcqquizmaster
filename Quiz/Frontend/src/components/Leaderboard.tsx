import React, { useState, useEffect } from 'react';
import { QuizResult } from '../types';
import { api } from '../api';
import { Icon } from './Icons';

export const Leaderboard: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await api.getLeaderboard();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const filtered = results.filter(
    r =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      {/* Hero Header */}
      <div className="card liquid-glass p-8 text-center mb-8 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl gradient-amber flex items-center justify-center glow-amber mx-auto mb-4 text-black shadow-lg">
          <Icon.Trophy className="w-7 h-7 text-white" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-2 bg-amber-500/15 border border-amber-500/30 text-amber-300">
          <span>Global Academic Rankings</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          University Hall of Fame
        </h1>

        <p className="text-sm text-slate-400 font-sans max-w-xl mx-auto mb-6">
          Honoring the highest scorers across all subjects based on accuracy, speed, and clean proctoring audits.
        </p>

        {/* Search bar */}
        <div className="max-w-md mx-auto relative">
          <Icon.Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, ID, or quiz title..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Top 3 Podium (If available) */}
      {filtered.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="card p-5 text-center flex flex-col justify-between order-2 sm:order-1 border-slate-400/30">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-400/20 text-slate-200 border border-slate-400/30 flex items-center justify-center mx-auto mb-2 font-mono font-bold text-sm">
                🥈 2
              </div>
              <h3 className="font-display font-bold text-white text-base mb-1">
                {filtered[1]?.studentName}
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-3">{filtered[1]?.studentId}</p>
              <div className="text-2xl font-bold font-mono text-slate-200 mb-1">
                {filtered[1]?.percentage}%
              </div>
              <div className="text-xs text-slate-400 font-sans">{filtered[1]?.quizTitle}</div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-4 pt-2 border-t border-white/5">
              Time: {filtered[1]?.timeTakenSeconds}s
            </div>
          </div>

          {/* 1st Place */}
          <div className="card liquid-glass p-6 text-center flex flex-col justify-between order-1 sm:order-2 border-amber-500/50 glow-amber sm:-translate-y-2">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto mb-2 font-mono font-bold text-base shadow-lg">
                👑 1
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-1">
                {filtered[0]?.studentName}
              </h3>
              <p className="text-xs text-amber-300/80 font-mono mb-3">{filtered[0]?.studentId}</p>
              <div className="text-3xl font-bold font-mono text-amber-300 mb-1">
                {filtered[0]?.percentage}%
              </div>
              <div className="text-xs text-slate-300 font-sans font-medium">{filtered[0]?.quizTitle}</div>
            </div>
            <div className="text-xs text-amber-300/70 font-mono mt-4 pt-2 border-t border-amber-500/20">
              Gold Distinction • {filtered[0]?.timeTakenSeconds}s
            </div>
          </div>

          {/* 3rd Place */}
          <div className="card p-5 text-center flex flex-col justify-between order-3 sm:order-3 border-amber-700/30">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-700/20 text-amber-500 border border-amber-700/30 flex items-center justify-center mx-auto mb-2 font-mono font-bold text-sm">
                🥉 3
              </div>
              <h3 className="font-display font-bold text-white text-base mb-1">
                {filtered[2]?.studentName}
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-3">{filtered[2]?.studentId}</p>
              <div className="text-2xl font-bold font-mono text-amber-500 mb-1">
                {filtered[2]?.percentage}%
              </div>
              <div className="text-xs text-slate-400 font-sans">{filtered[2]?.quizTitle}</div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-4 pt-2 border-t border-white/5">
              Time: {filtered[2]?.timeTakenSeconds}s
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Subject / Module</th>
                <th className="pb-3">Score & Accuracy</th>
                <th className="pb-3">Speed</th>
                <th className="pb-3">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r, idx) => {
                const isTop3 = idx < 3;
                return (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-sm">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{r.studentName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{r.studentId}</div>
                    </td>
                    <td className="py-3.5 text-slate-300 font-medium">{r.quizTitle}</td>
                    <td className="py-3.5 font-mono">
                      <span className="font-bold text-white">{r.percentage}%</span>{' '}
                      <span className="text-slate-500">
                        ({r.score}/{r.totalQuestions})
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-slate-400">{r.timeTakenSeconds}s</td>
                    <td className="py-3.5">
                      <span className={isTop3 ? 'badge-amber' : 'badge-violet'}>
                        {isTop3 ? 'Top Tier' : 'Distinction'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
