import React from 'react';
import { Quiz } from '../types';
import { Icon } from './Icons';

interface QuizCardProps {
  quiz: Quiz;
  onViewDetails: (quiz: Quiz) => void;
  onStartQuiz: (quiz: Quiz) => void;
}

const difficultyBadgeClasses: Record<string, string> = {
  Easy: 'badge-emerald',
  Medium: 'badge-amber',
  Hard: 'badge-rose',
};

const categoryGradients: Record<string, string> = {
  web: 'from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-300',
  java: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
  db: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
};

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onViewDetails,
  onStartQuiz,
}) => {
  const diffClass = difficultyBadgeClasses[quiz.difficulty] || 'badge-violet';
  const catClass = categoryGradients[quiz.category] || categoryGradients.web;
  const questionCount = quiz.questions?.length || (quiz.category === 'web' ? 4 : quiz.category === 'java' ? 3 : 2);

  return (
    <div className="card p-6 flex flex-col justify-between group h-full">
      {/* Top Header: Category and Difficulty */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium border bg-gradient-to-r ${catClass}`}
          >
            {quiz.categoryLabel || quiz.category}
          </span>
          <span className={diffClass}>{quiz.difficulty}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
          {quiz.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-6 font-sans line-clamp-2 leading-relaxed">
          {quiz.description || 'Comprehensive multiple-choice assessment designed for academic evaluation.'}
        </p>
      </div>

      {/* Meta Specs & Actions */}
      <div>
        <div className="flex items-center gap-4 py-3 mb-5 border-t border-b border-white/[0.06] text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Icon.Clock className="w-4 h-4 text-violet-400" />
            <span>{quiz.timeLimit} Mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon.Layers className="w-4 h-4 text-amber-400" />
            <span>{questionCount} MCQs</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto text-emerald-400">
            <Icon.Shield className="w-3.5 h-3.5" />
            <span>Proctored</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onViewDetails(quiz)}
            className="btn-secondary text-xs py-2.5 px-3"
          >
            <Icon.BookOpen className="w-3.5 h-3.5 text-slate-300" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onStartQuiz(quiz)}
            className="btn-primary text-xs py-2.5 px-3 glow-violet"
          >
            <Icon.Play className="w-3.5 h-3.5 text-white fill-white" />
            <span>Start Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
