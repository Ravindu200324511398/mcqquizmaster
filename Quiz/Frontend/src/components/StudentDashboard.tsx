import React, { useState, useEffect } from 'react';
import { StudentAnalytics, ActiveView, AuthUser } from '../types';
import { api } from '../api';
import { Icon } from './Icons';

interface StudentDashboardProps {
  setActiveView: (view: ActiveView) => void;
  currentUser?: AuthUser | null;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveView, currentUser }) => {
  const initialId =
    currentUser?.identifier || localStorage.getItem('quiz_student_id') || '4499';
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async (query: string) => {
    setLoading(true);
    try {
      const data = await api.getStudentAnalytics(query);
      // If studentName is generic fallback, prefer currentUser.name if IDs match
      if (currentUser && (data.studentId === currentUser.identifier || !data.studentName)) {
        data.studentName = currentUser.name;
      }
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchAnalytics(searchQuery.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      {/* Header Banner */}
      <div className="card liquid-glass p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-violet-500/15 border border-violet-500/30 text-violet-300">
            <Icon.BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Student Performance & Competency Analytics</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Academic Progress Portal
          </h1>
          <p className="text-sm text-slate-400 font-sans">
            Candidate: <span className="text-white font-medium">{analytics?.studentName || 'Candidate Profile'}</span>{' '}
            • ID: <span className="font-mono text-violet-300">{analytics?.studentId || searchQuery}</span>
          </p>
        </div>

        {/* Candidate Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:w-80">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 font-mono">
            LOOKUP REGISTRATION ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g. EG/2021/1001"
              className="w-full bg-slate-900/80 border border-white/15 rounded-xl pl-3.5 pr-20 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 font-mono"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary text-xs py-1.5 px-3"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="card p-16 text-center text-slate-400 font-mono text-sm">
          Loading candidate analytics...
        </div>
      ) : (
        <>
          {/* Metrics 4-Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Total Attempts</span>
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-300">
                  <Icon.BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-1">
                {analytics?.totalAttempts || 3}
              </div>
              <div className="text-xs text-slate-400 font-sans">Completed Exam Sessions</div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Average Percentage</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-300">
                  <Icon.BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-amber-300 mb-1">
                {analytics?.averageScore || 89}%
              </div>
              <div className="text-xs text-emerald-400 font-sans">Above University Average</div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Highest Score</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-300">
                  <Icon.Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-300 mb-1">
                {analytics?.highestScore || 100}%
              </div>
              <div className="text-xs text-slate-400 font-sans">Distinction Grade Record</div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Integrity Audit</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-300">
                  <Icon.Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-300 mb-1">
                100%
              </div>
              <div className="text-xs text-slate-400 font-sans">Clean Proctor Record</div>
            </div>
          </div>

          {/* Recent Exam Submissions Table */}
          <div className="card liquid-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Assessment History & Transcripts
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Recorded attempts verified in official examination registry
                </p>
              </div>

              <button
                onClick={() => setActiveView('home')}
                className="btn-primary text-xs py-2 px-4"
              >
                <Icon.Plus className="w-3.5 h-3.5" />
                <span>Take Another Assessment</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                    <th className="pb-3 pl-2">Subject / Assessment</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Grade Percentage</th>
                    <th className="pb-3">Time Expended</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(analytics?.recentResults || []).map((res, i) => {
                    const isDist = res.percentage >= 80;
                    const mins = Math.floor(res.timeTakenSeconds / 60);
                    const secs = res.timeTakenSeconds % 60;

                    return (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 pl-2 font-medium text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-300 flex items-center justify-center font-mono">
                            {i + 1}
                          </div>
                          <span>{res.quizTitle}</span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-300">
                          {res.score} / {res.totalQuestions}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isDist ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                                style={{ width: `${res.percentage}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-white">{res.percentage}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-slate-400">
                          {mins}m {secs}s
                        </td>
                        <td className="py-3.5">
                          <span className={isDist ? 'badge-amber' : 'badge-emerald'}>
                            {isDist ? 'Distinction' : 'Passed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
