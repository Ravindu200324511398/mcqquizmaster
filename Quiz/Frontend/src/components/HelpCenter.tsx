import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Icon } from './Icons';

interface HelpCenterProps {
  setActiveView: (view: ActiveView) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

interface FAQItem {
  id: string;
  category: 'general' | 'student' | 'faculty' | 'security';
  question: string;
  answer: string;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ setActiveView, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'student' | 'faculty' | 'security'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'general',
      question: 'What is QuizMaster and how do I get started?',
      answer:
        'QuizMaster is an official online examination and assessment engine for university courses. To begin, sign up with your university email and student/staff ID. Once logged in, choose any module from the Assessments catalog and start your timed evaluation session.',
    },
    {
      id: 'faq-2',
      category: 'student',
      question: 'How does the examination timer and auto-submission work?',
      answer:
        'Each assessment is strictly timed according to faculty requirements. A persistent countdown timer appears at the top of your examination room. When time expires, your answers are automatically calculated and submitted instantly to prevent unrecorded attempts.',
    },
    {
      id: 'faq-3',
      category: 'security',
      question: 'What anti-cheat policies are enforced during assessments?',
      answer:
        'Our anti-cheat proctoring engine monitors browser tab changes, window blurs, and navigation attempts. If you switch tabs or leave the examination window, a focus violation is logged in your session transcript and reported alongside your final submission.',
    },
    {
      id: 'faq-4',
      category: 'faculty',
      question: 'How do Lecturer and Administrator accounts get approved?',
      answer:
        'When you register with a Lecturer or Administrator role, your account is placed in PENDING status for faculty authorization. An active System Administrator reviews and activates your account from the Staff Approvals Hub before you can sign in.',
    },
    {
      id: 'faq-5',
      category: 'general',
      question: 'What should I do if I forget my account password?',
      answer:
        'Click the "Forgot Password?" link on the Sign In modal. Enter your registered institutional email and your student/staff ID to verify your identity. You will be prompted to enter a new password and can immediately sign in.',
    },
    {
      id: 'faq-6',
      category: 'student',
      question: 'Can I retake an assessment to improve my performance?',
      answer:
        'Yes. After finishing an evaluation, you can retake the assessment directly from your Result Scorecard or from the Assessments catalog. Your highest score and overall average are tracked on your personal Analytics Dashboard.',
    },
    {
      id: 'faq-7',
      category: 'faculty',
      question: 'How do instructors author and manage quiz questions?',
      answer:
        'Approved Lecturers can access the Lecturer Portal from the top navigation bar. In the portal, instructors can create new topics, specify time limits and difficulty tiers, add multiple-choice questions with answer keys and explanations, or edit existing question sets.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesTab = activeTab === 'all' || faq.category === activeTab;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/35 text-violet-300 text-xs font-medium mb-5 backdrop-blur-md">
          <Icon.HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Support & Knowledge Base</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          How Can We <span className="gradient-text">Help You?</span>
        </h1>

        <p className="text-sm text-slate-300 font-sans leading-relaxed mb-8">
          Find answers regarding examination sessions, anti-cheat regulations, faculty authorization, and scoring policies.
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Icon.Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question or keyword..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 shadow-xl font-sans"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
        {[
          { id: 'all', label: 'All Questions' },
          { id: 'general', label: 'General & Getting Started' },
          { id: 'student', label: 'For Candidates & Students' },
          { id: 'faculty', label: 'For Faculty & Lecturers' },
          { id: 'security', label: 'Anti-Cheat & Security' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === cat.id
                ? 'bg-violet-600 text-white shadow-md glow-violet scale-105'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 mb-16 max-w-3xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="card p-12 text-center text-slate-400">
            <Icon.AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm text-white font-medium mb-1">No FAQs matched your search</p>
            <p className="text-xs text-slate-500">Try searching with a broader keyword or switch category filter.</p>
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="card liquid-glass rounded-2xl border border-white/10 overflow-hidden transition-all hover:border-violet-500/30"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-white"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-400 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180 text-violet-300 bg-violet-600/30' : ''
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed border-t border-white/5 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Institutional Support Helpdesk Card */}
      <div className="card liquid-glass p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-2">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mb-4">
            Our academic IT support desk is available to assist students and instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-violet-400">📧</span>
              <span>support@quizmaster.lk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">📞</span>
              <span>+94 11 265 0301 (Ext. 4307)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveView('home')}
            className="btn-primary text-xs py-2.5 px-6 font-semibold"
          >
            Back to Assessments
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="btn-secondary text-xs py-2.5 px-6"
          >
            Sign In to Portal
          </button>
        </div>
      </div>
    </div>
  );
};
