import React from 'react';
import { Quiz, QuizResult } from '../types';
import { Icon } from './Icons';

interface ResultScorecardProps {
  quiz: Quiz;
  result: QuizResult;
  userAnswers: Record<number, string>;
  onRetake: () => void;
  onGoHome: () => void;
  onGoLeaderboard: () => void;
  onGoDashboard: () => void;
}

export const ResultScorecard: React.FC<ResultScorecardProps> = ({
  quiz,
  result,
  userAnswers,
  onRetake,
  onGoHome,
  onGoLeaderboard,
  onGoDashboard,
}) => {
  const isPass = result.percentage >= 50;
  const isDistinction = result.percentage >= 80;
  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
  const cleanAttempt = (result.violationsCount || 0) === 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="card liquid-glass p-8 text-center mb-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 blur-[90px] rounded-full pointer-events-none ${
            isDistinction ? 'bg-amber-500/20' : isPass ? 'bg-emerald-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center border shadow-xl bg-slate-900/80 border-white/10">
          {isDistinction ? (
            <Icon.Trophy className="w-8 h-8 text-amber-400" />
          ) : isPass ? (
            <Icon.CheckCircle className="w-8 h-8 text-emerald-400" />
          ) : (
            <Icon.AlertTriangle className="w-8 h-8 text-rose-400" />
          )}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-white/5 border border-white/10">
          <span>{result.quizTitle}</span>
          <span className="text-slate-500">•</span>
          <span className="text-violet-300 font-bold">{result.studentName}</span>
          <span className="text-slate-500 font-mono">({result.studentId})</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
          {result.percentage}% Score
        </h1>

        <p className="text-sm font-sans text-slate-300 mb-6">
          {isDistinction
            ? '🏆 Outstanding Performance! Top tier academic distinction achieved.'
            : isPass
            ? '✅ Good Job! You have successfully cleared the examination threshold.'
            : '⚠️ Requires Revision. Review the educational rationales below and retake.'}
        </p>

        {/* Key Result Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400 block mb-1">Score Result</span>
            <span className="text-white font-bold text-base">
              {result.score} / {result.totalQuestions}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400 block mb-1">Time Expended</span>
            <span className="text-amber-300 font-bold text-base">{timeFormatted}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400 block mb-1">Status</span>
            <span
              className={`font-bold text-base ${
                isDistinction ? 'text-amber-300' : isPass ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isDistinction ? 'Distinction' : isPass ? 'Passed' : 'Repeat'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-slate-400 block mb-1">Exam Proctor</span>
            <span
              className={`font-bold text-base ${cleanAttempt ? 'text-emerald-300' : 'text-rose-300'}`}
            >
              {cleanAttempt ? 'Verified Clean' : `${result.violationsCount} Flags`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={onRetake} className="btn-primary text-xs py-2.5 px-5">
            <Icon.RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>

          <button onClick={onGoDashboard} className="btn-secondary text-xs py-2.5 px-5">
            <Icon.BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Student Analytics</span>
          </button>

          <button onClick={onGoLeaderboard} className="btn-ghost text-xs py-2.5 px-4">
            <Icon.Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Hall of Fame</span>
          </button>

          <button onClick={onGoHome} className="btn-ghost text-xs py-2.5 px-4 text-slate-400">
            <span>Back to Catalog</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Question Review & Rationale */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-xl font-bold text-white">
            Educational Rationale & Review
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {result.score} of {result.totalQuestions} Correct
          </span>
        </div>

        {quiz.questions?.map((q, idx) => {
          const selected = userAnswers[idx];
          const isCorrect = selected && selected.toUpperCase() === q.correctOption.toUpperCase();

          return (
            <div
              key={idx}
              className={`card p-5 border transition-all ${
                isCorrect ? 'border-emerald-500/20 bg-emerald-950/10' : 'border-rose-500/20 bg-rose-950/10'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">
                  Question #{idx + 1}
                </span>
                <span className={isCorrect ? 'badge-emerald' : 'badge-rose'}>
                  {isCorrect ? 'Correct Answer' : 'Incorrect Attempt'}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="font-sans text-base font-semibold text-white mb-4">
                {q.questionText}
              </h3>

              {/* Options breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-xs font-sans">
                {(['A', 'B', 'C', 'D'] as const).map(key => {
                  const optText = (q as any)[`option${key}`];
                  if (!optText) return null;
                  const isUserPick = selected === key;
                  const isActualCorrect = q.correctOption.toUpperCase() === key;

                  let borderClass = 'border-white/5 bg-slate-900/40 text-slate-400';
                  if (isActualCorrect) {
                    borderClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium';
                  } else if (isUserPick) {
                    borderClass = 'border-rose-500/40 bg-rose-500/10 text-rose-300 font-medium';
                  }

                  return (
                    <div
                      key={key}
                      className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${borderClass}`}
                    >
                      <span className="font-mono font-bold">{key}.</span>
                      <span className="flex-1">{optText}</span>
                      {isActualCorrect && <Icon.CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      {isUserPick && !isActualCorrect && (
                        <span className="text-[10px] text-rose-400 font-mono">(Your Choice)</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Educational Explanation Box */}
              {q.explanation && (
                <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-300 leading-relaxed font-sans">
                  <span className="font-semibold text-violet-300 block mb-1">
                    💡 Educational Rationale:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
