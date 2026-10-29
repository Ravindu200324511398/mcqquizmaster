import React, { useState, useEffect, useRef } from 'react';
import { Quiz, Question, QuizResult } from '../types';
import { Icon } from './Icons';

interface ExamRoomProps {
  quiz: Quiz;
  studentName: string;
  studentId: string;
  onFinish: (result: QuizResult, userAnswers: Record<number, string>) => void;
  onExit: () => void;
}

// Audio synthesizer for anti-cheat proctoring alert
function playAlertBeep() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may require explicit user gesture
  }
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  quiz,
  studentName,
  studentId,
  onFinish,
  onExit,
}) => {
  const questions: Question[] = quiz.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimit || 5) * 60);
  const [violations, setViolations] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const startTimeRef = useRef(Date.now());

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Real-Time Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-Cheat: Tab Switch & Window Blur Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('Tab Switch Detected');
      }
    };

    const handleBlur = () => {
      handleViolation('Window Focus Lost');
    };

    const handleViolation = (reason: string) => {
      playAlertBeep();
      setViolations(prev => {
        const next = prev + 1;
        setShowViolationModal(true);
        return next;
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectOption = (optionKey: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionKey,
    }));
  };

  const handleSubmitExam = () => {
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected && selected.toUpperCase() === q.correctOption.toUpperCase()) {
        correctCount++;
      }
    });

    const total = questions.length || 1;
    const percentage = Math.round((correctCount / total) * 100);

    const result: QuizResult = {
      studentName,
      studentId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: correctCount,
      totalQuestions: total,
      percentage,
      timeTakenSeconds: timeTaken,
      violationsCount: violations,
    };

    onFinish(result, userAnswers);
  };

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeLeft < 60;

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen pb-12 pt-4 px-4 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Top Exam Status Bar */}
        <div className="glass-nav rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-violet flex items-center justify-center glow-violet shadow-sm">
              <Icon.Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">
                {quiz.title}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Candidate: <span className="text-violet-300">{studentName}</span> ({studentId})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Proctoring Status Pill */}
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border ${
                violations === 0
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
              }`}
            >
              <Icon.Shield className="w-3.5 h-3.5" />
              <span>
                {violations === 0 ? 'Proctor: 100% Verified' : `Violations: ${violations}`}
              </span>
            </div>

            {/* Countdown Timer */}
            <div
              className={`px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold flex items-center gap-2 border ${
                isTimeCritical
                  ? 'bg-rose-600/30 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-slate-900/80 text-white border-white/15'
              }`}
            >
              <Icon.Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400' : 'text-violet-400'}`} />
              <span>{timeFormatted}</span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Icon.Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Examination Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Question Area (3 Cols) */}
          <div className="lg:col-span-3">
            <div className="card liquid-glass p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
              {currentQ ? (
                <>
                  <div>
                    {/* Question Header */}
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4 pb-3 border-b border-white/[0.08]">
                      <span>
                        QUESTION <span className="text-violet-400 font-bold">{currentIndex + 1}</span> OF {questions.length}
                      </span>
                      <span className="badge-violet">MCQ • Single Choice</span>
                    </div>

                    {/* Question Statement */}
                    <h2 className="font-sans text-lg sm:text-xl font-semibold text-white mb-6 leading-relaxed">
                      {currentQ.questionText}
                    </h2>

                    {/* Options Grid */}
                    <div className="space-y-3 mb-8">
                      {(['A', 'B', 'C', 'D'] as const).map(key => {
                        const optionText = (currentQ as any)[`option${key}`];
                        if (!optionText) return null;
                        const isSelected = userAnswers[currentIndex] === key;

                        return (
                          <div
                            key={key}
                            onClick={() => handleSelectOption(key)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                              isSelected
                                ? 'bg-violet-600/20 border-violet-400 text-white shadow-lg glow-violet'
                                : 'bg-slate-900/40 border-white/[0.08] text-slate-300 hover:bg-white/[0.05] hover:border-white/20'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 border ${
                                isSelected
                                  ? 'bg-violet-600 text-white border-violet-300'
                                  : 'bg-white/5 text-slate-400 border-white/10'
                              }`}
                            >
                              {key}
                            </div>
                            <span className="text-sm font-sans flex-1 leading-snug">
                              {optionText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="btn-secondary text-xs py-2 px-4 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Previous Question
                    </button>

                    {isLastQuestion ? (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="btn-primary text-xs py-2.5 px-6 glow-violet font-semibold"
                      >
                        <Icon.CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Review & Submit</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="btn-primary text-xs py-2 px-5"
                      >
                        <span>Next Question</span>
                        <Icon.ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-slate-400">No questions available.</div>
              )}
            </div>
          </div>

          {/* Question Palette Sidebar (1 Col) */}
          <div className="lg:col-span-1">
            <div className="card p-5 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-white text-sm mb-3">
                  Question Palette
                </h3>
                <p className="text-xs text-slate-400 mb-4 font-sans">
                  Answered: <span className="text-emerald-400 font-mono font-bold">{answeredCount}</span> / {questions.length}
                </p>

                <div className="grid grid-cols-4 gap-2 mb-6">
                  {questions.map((_, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isAnswered = userAnswers[idx] !== undefined;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-10 rounded-xl font-mono text-xs font-bold transition-all border ${
                          isCurrent
                            ? 'bg-violet-600 text-white border-violet-400 shadow-md glow-violet'
                            : isAnswered
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 text-xs text-slate-400 font-mono pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-violet-600 border border-violet-400" />
                    <span>Current Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-500/25 border border-emerald-500/40" />
                    <span>Attempted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full btn-secondary text-xs py-2.5 text-center font-medium"
                >
                  Finish Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Violation Alert Modal */}
      {showViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="card liquid-glass max-w-md w-full p-6 text-center border-rose-500/40 glow-rose animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <Icon.AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Exam Integrity Infraction
            </h3>
            <p className="text-xs text-rose-300 font-mono mb-2">
              Security Violation #{violations} Recorded
            </p>
            <p className="text-xs text-slate-300 font-sans mb-6 leading-relaxed">
              You navigated away from the exam tab or lost active focus. All tab switches are logged
              and attached to your university candidate record for lecturer review.
            </p>
            <button
              onClick={() => setShowViolationModal(false)}
              className="btn-primary w-full text-xs py-2.5 font-semibold bg-rose-600 hover:bg-rose-500 border-rose-400"
            >
              I Understand & Acknowledge Warning
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="card liquid-glass max-w-md w-full p-6 text-center animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mx-auto mb-4 text-violet-300">
              <Icon.CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Ready to Submit Your Exam?
            </h3>
            <p className="text-xs text-slate-300 font-sans mb-4">
              You have answered <span className="text-violet-300 font-bold font-mono">{answeredCount}</span> of{' '}
              <span className="font-mono">{questions.length}</span> questions.
              {answeredCount < questions.length && (
                <span className="text-amber-300 block mt-1">
                  ⚠️ You have {questions.length - answeredCount} unanswered questions!
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="btn-primary text-xs py-2.5 px-6 glow-violet font-semibold"
              >
                Confirm & Grade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
