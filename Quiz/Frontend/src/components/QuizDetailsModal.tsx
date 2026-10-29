import React, { useState } from 'react';
import { Quiz, User } from '../types';
import { Icon } from './Icons';

interface QuizDetailsModalProps {
  quiz: Quiz | null;
  currentUser?: User | null;
  onClose: () => void;
  onProceed: (quiz: Quiz, studentName: string, studentId: string) => void;
}

export const QuizDetailsModal: React.FC<QuizDetailsModalProps> = ({
  quiz,
  currentUser,
  onClose,
  onProceed,
}) => {
  if (!quiz) return null;

  const isIdLocked = Boolean(currentUser?.identifier || localStorage.getItem('quiz_student_id'));
  const [studentName, setStudentName] = useState(
    currentUser?.name || localStorage.getItem('quiz_student_name') || 'Kasun Wickramasinghe'
  );
  const [studentId, setStudentId] = useState(
    currentUser?.identifier || localStorage.getItem('quiz_student_id') || 'EG/2021/1001'
  );
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!studentName.trim() || !studentId.trim()) {
      setError('Please provide both your Student Name and Registration ID to begin.');
      return;
    }
    localStorage.setItem('quiz_student_name', studentName.trim());
    localStorage.setItem('quiz_student_id', studentId.trim());
    onProceed(quiz, studentName.trim(), studentId.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="card liquid-glass max-w-xl w-full p-6 sm:p-8 animate-slide-up relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Icon.X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-violet">{quiz.categoryLabel || quiz.category}</span>
          <span className="badge-amber">{quiz.difficulty} Level</span>
          <span className="badge-emerald font-mono">3NF Verified</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          {quiz.title}
        </h2>

        <p className="text-sm text-slate-300 font-sans mb-6 leading-relaxed">
          {quiz.description || 'University examination module assessing core competency in computer engineering.'}
        </p>

        {/* Assessment Specs Grid */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/10 mb-6 text-center font-mono text-xs">
          <div>
            <div className="text-slate-400 mb-1">Time Allowed</div>
            <div className="text-violet-300 font-bold text-base">{quiz.timeLimit} Minutes</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Total MCQs</div>
            <div className="text-amber-300 font-bold text-base">{quiz.questions?.length || 4} Questions</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Pass Mark</div>
            <div className="text-emerald-300 font-bold text-base">50% Minimum</div>
          </div>
        </div>

        {/* Anti-Cheating & Exam Regulations */}
        <div className="p-4 rounded-xl bg-violet-950/25 border border-violet-500/20 mb-6">
          <div className="flex items-center gap-2 text-violet-300 font-medium text-xs mb-2">
            <Icon.Shield className="w-4 h-4 text-violet-400" />
            <span>Academic Integrity & Proctoring Regulations</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 pl-5 list-disc font-sans">
            <li>Tab-switching or minimizing the browser window triggers an automated security alert.</li>
            <li>Exiting Fullscreen mode during an active session is recorded on your final audit scorecard.</li>
            <li>Copying question text or opening inspector shortcuts is strictly disabled.</li>
          </ul>
        </div>

        {/* Candidate Registration Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Candidate Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={e => {
                setStudentName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Kasun Wickramasinghe"
              className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Student Registration ID{' '}
              {isIdLocked ? (
                <span className="text-violet-400 font-sans font-normal">(read only)</span>
              ) : (
                <span className="text-rose-400">*</span>
              )}
            </label>
            <input
              type="text"
              readOnly={isIdLocked}
              value={studentId}
              onChange={e => {
                if (!isIdLocked) {
                  setStudentId(e.target.value);
                  setError('');
                }
              }}
              placeholder="e.g. EG/2021/1001"
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${
                isIdLocked
                  ? 'bg-slate-900/90 border border-violet-500/30 text-violet-300 cursor-not-allowed select-all'
                  : 'bg-slate-900/70 border border-white/10 text-white focus:outline-none focus:border-violet-500'
              }`}
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <Icon.AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-xs py-2.5 px-4">
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="btn-primary text-xs py-2.5 px-6 glow-violet font-semibold"
          >
            <Icon.Play className="w-3.5 h-3.5 text-white fill-white" />
            <span>Confirm & Enter Examination</span>
          </button>
        </div>
      </div>
    </div>
  );
};
