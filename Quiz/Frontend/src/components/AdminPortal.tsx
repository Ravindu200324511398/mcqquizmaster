import React, { useState, useEffect, useMemo } from 'react';
import { Quiz, Question, AuthUser } from '../types';
import { api } from '../api';
import { Icon } from './Icons';
import { CustomDropdown, DropdownOption } from './CustomDropdown';

const DIFFICULTY_OPTIONS: DropdownOption[] = [
  { value: 'Easy', label: 'Easy (Foundational)', badge: 'Beginner', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'Medium', label: 'Medium (Intermediate)', badge: 'Core', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'Hard', label: 'Hard (Advanced)', badge: 'Senior', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

const CORRECT_OPTION_CHOICES: DropdownOption[] = [
  { value: 'A', label: 'Option A (First Choice)', badge: 'A', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  { value: 'B', label: 'Option B (Second Choice)', badge: 'B', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  { value: 'C', label: 'Option C (Third Choice)', badge: 'C', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  { value: 'D', label: 'Option D (Fourth Choice)', badge: 'D', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
];

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'web', label: 'Web Development (HTML/CSS/JS)', badge: 'Web Dev' },
  { value: 'java', label: 'Java & OOP Engineering', badge: 'Java / OOP' },
  { value: 'db', label: 'Database & SQL Fundamentals', badge: 'Database' },
  { value: 'dsa', label: 'Data Structures & Algorithms', badge: 'DSA' },
  { value: 'se', label: 'Software Architecture & Patterns', badge: 'Architecture' },
  { value: 'network', label: 'Computer Networks & Security', badge: 'Networking' },
  { value: 'cloud', label: 'Cloud & Distributed Systems', badge: 'Cloud / DevOps' },
  { value: 'ai', label: 'AI & Machine Learning', badge: 'AI / ML' },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  web: 'Web Dev',
  java: 'Java / OOP',
  db: 'Database',
  dsa: 'DSA',
  se: 'Architecture',
  network: 'Networking',
  cloud: 'Cloud / DevOps',
  ai: 'AI / ML',
};

interface AdminPortalProps {
  quizzes: Quiz[];
  onRefreshQuizzes: () => void;
  currentUser?: AuthUser | null;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  quizzes,
  onRefreshQuizzes,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'approvals'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User Approvals State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const data = await api.getAllUsers();
      setUsersList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setUserLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const pendingCount = usersList.filter(u => u.status === 'PENDING').length;

  const handleApproveUser = async (userId: number, userName: string) => {
    setLoading(true);
    try {
      await api.approveUser(userId);
      showToast('success', `Access approved for ${userName}. They can now sign in.`);
      fetchUsers();
    } catch (e: any) {
      showToast('error', e.message || 'Failed to approve user.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (userId: number, userName: string) => {
    setLoading(true);
    try {
      await api.rejectUser(userId);
      showToast('success', `Registration declined for ${userName}.`);
      fetchUsers();
    } catch (e: any) {
      showToast('error', e.message || 'Failed to reject user.');
    } finally {
      setLoading(false);
    }
  };

  // Edit Quiz State
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Delete Confirm State
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  // Add Question to Existing Quiz State
  const [addQuestionQuizId, setAddQuestionQuizId] = useState<number | null>(null);
  const [singleQuestion, setSingleQuestion] = useState<Question>({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    explanation: '',
  });

  // Create New Quiz State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('web');
  const [newCategoryLabel, setNewCategoryLabel] = useState('Web Dev');
  const [newTimeLimit, setNewTimeLimit] = useState(5);
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newQuestions, setNewQuestions] = useState<Question[]>([
    {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      explanation: '',
    },
  ]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Add MCQ block in Create Mode
  const handleAddMCQBlock = () => {
    setNewQuestions(prev => [
      ...prev,
      {
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
        explanation: '',
      },
    ]);
  };

  const handleRemoveMCQBlock = (idx: number) => {
    if (newQuestions.length <= 1) return;
    setNewQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // CREATE QUIZ
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('error', 'Quiz Title is mandatory.');
      return;
    }

    const invalidQ = newQuestions.find(
      q => !q.questionText.trim() || !q.optionA.trim() || !q.optionB.trim()
    );
    if (invalidQ) {
      showToast('error', 'Each question requires a prompt and at least Options A and B.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Quiz> = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        categoryLabel: newCategoryLabel || CATEGORY_LABEL_MAP[newCategory] || 'General',
        timeLimit: Number(newTimeLimit),
        difficulty: newDifficulty,
        questions: newQuestions,
        creatorEmail: currentUser?.email || 'lecturer@quizmaster.lk',
        authorName: currentUser?.name || 'Academic Faculty',
      };

      await api.createQuiz(payload);
      showToast('success', `Quiz "${newTitle}" authored and published successfully!`);
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewQuestions([
        {
          questionText: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctOption: 'A',
          explanation: '',
        },
      ]);
      setActiveTab('list');
      onRefreshQuizzes();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE QUIZ
  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;
    setLoading(true);
    try {
      await api.updateQuiz(editingQuiz.id, editingQuiz);
      showToast('success', `Quiz #${editingQuiz.id} updated successfully!`);
      setEditingQuiz(null);
      onRefreshQuizzes();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update quiz.');
    } finally {
      setLoading(false);
    }
  };

  // DELETE QUIZ
  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    setLoading(true);
    try {
      await api.deleteQuiz(deletingQuiz.id);
      showToast('success', `Quiz "${deletingQuiz.title}" and associated MCQs safely deleted.`);
      setDeletingQuiz(null);
      onRefreshQuizzes();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete quiz.');
    } finally {
      setLoading(false);
    }
  };

  // ADD SINGLE QUESTION TO EXISTING QUIZ
  const handleAddSingleQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addQuestionQuizId) return;
    if (!singleQuestion.questionText.trim() || !singleQuestion.optionA.trim()) {
      showToast('error', 'Question statement and options are required.');
      return;
    }

    setLoading(true);
    try {
      await api.addQuestion({
        ...singleQuestion,
        quizId: addQuestionQuizId,
      });
      showToast('success', 'Question appended successfully to quiz!');
      setAddQuestionQuizId(null);
      setSingleQuestion({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
        explanation: '',
      });
      onRefreshQuizzes();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to append question.');
    } finally {
      setLoading(false);
    }
  };

  const isLecturer = currentUser?.role === 'lecturer';
  const isAdmin = currentUser?.role === 'admin';

  // Role Filtering: Lecturer sees only their own authored quizzes; Admin sees ALL quizzes across all faculty
  const accessibleQuizzes = useMemo(() => {
    if (isLecturer && currentUser?.email) {
      const emailLower = currentUser.email.toLowerCase().trim();
      return quizzes.filter(q => {
        if (q.creatorEmail) {
          return q.creatorEmail.toLowerCase().trim() === emailLower;
        }
        // Default seed: Dr. N. Fernando (lecturer@quizmaster.lk) authors quizzes 1, 2, 4, 5, 8
        if (emailLower === 'lecturer@quizmaster.lk') {
          return [1, 2, 4, 5, 8].includes(q.id);
        }
        return false;
      });
    }
    // Administrator accesses all platform quizzes
    return quizzes;
  }, [quizzes, currentUser, isLecturer]);

  const filteredQuizzes = accessibleQuizzes.filter(
    q =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl text-xs font-sans shadow-2xl flex items-center gap-3 animate-slide-up border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 glow-emerald'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 glow-rose'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Icon.CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <Icon.AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Admin / Lecturer Header Banner */}
      <div className="card liquid-glass p-6 sm:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-2 bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Icon.Layers className="w-3.5 h-3.5" />
              <span>
                {isLecturer
                  ? 'Faculty Lecturer • My Authored Modules'
                  : 'System Administrator • University-Wide Access (All Quizzes)'}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              {isLecturer ? 'Lecturer Assessment Hub' : 'System Administration Portal'}
            </h1>
            <p className="text-sm text-slate-400 font-sans">
              {isLecturer
                ? `Welcome ${currentUser?.name || 'Lecturer'}. You are managing your own authored examination modules (${accessibleQuizzes.length} modules).`
                : `Welcome Administrator. You have university-wide oversight of all ${quizzes.length} examination modules authored across faculty.`}
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-3.5 bg-white/[0.04] border border-white/10 px-4 py-3 rounded-2xl shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center text-white shadow-md">
              <Icon.BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {isLecturer ? 'Authored Modules' : 'University Registry'}
              </div>
              <div className="text-base font-bold font-mono text-white">
                {accessibleQuizzes.length}{' '}
                <span className="text-xs text-slate-400 font-normal">Active Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Control & Navigation Bar */}
      <div className="card liquid-glass p-3 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-white/10">
        {/* Navigation Tabs (Single clean row, no awkward wrapping) */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'list'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon.BookOpen className="w-3.5 h-3.5 text-violet-300" />
            <span>
              {isLecturer
                ? `My Quizzes (${accessibleQuizzes.length})`
                : `All System Quizzes (${quizzes.length})`}
            </span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('approvals');
                fetchUsers();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'approvals'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon.Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staff Approvals</span>
              {pendingCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full animate-pulse ml-0.5 font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center justify-end">
          {activeTab !== 'create' ? (
            <button
              onClick={() => setActiveTab('create')}
              className="btn-primary text-xs py-2.5 px-5 w-full sm:w-auto glow-violet flex items-center justify-center gap-2 font-semibold transition-all"
            >
              <Icon.Plus className="w-4 h-4" />
              <span>Create New Quiz</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('list')}
              className="btn-secondary text-xs py-2.5 px-5 w-full sm:w-auto flex items-center justify-center gap-2 font-medium transition-all"
            >
              <Icon.BookOpen className="w-4 h-4 text-violet-400" />
              <span>Back to Quizzes List</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: LIST / READ / EDIT / DELETE */}
      {activeTab === 'list' && (
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Icon.Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filter quizzes by title or category..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="btn-primary text-xs py-2 px-4 w-full sm:w-auto"
            >
              <Icon.Plus className="w-3.5 h-3.5" />
              <span>Add Assessment</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 pl-2">ID</th>
                  <th className="pb-3">Title & Subject</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Author / Faculty</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Time Limit</th>
                  <th className="pb-3">MCQs</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredQuizzes.map(q => (
                  <tr key={q.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 pl-2 font-mono text-violet-400 font-bold">
                      #{q.id}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{q.title}</div>
                      <div className="text-slate-400 text-[11px] line-clamp-1">
                        {q.description}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="badge-violet">{q.categoryLabel || q.category}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300">
                        {q.authorName || (q.creatorEmail === 'lecturer@quizmaster.lk' ? 'Dr. N. Fernando' : 'Faculty Member')}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={
                          q.difficulty === 'Easy'
                            ? 'badge-emerald'
                            : q.difficulty === 'Hard'
                            ? 'badge-rose'
                            : 'badge-amber'
                        }
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-slate-300">{q.timeLimit} min</td>
                    <td className="py-3.5 font-mono text-amber-300 font-bold">
                      {q.questions?.length || 0}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAddQuestionQuizId(q.id)}
                          title="Add MCQ to this Quiz"
                          className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                        >
                          <Icon.Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingQuiz({ ...q })}
                          title="Edit Quiz"
                          className="p-1.5 rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 border border-violet-500/30"
                        >
                          <Icon.Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingQuiz(q)}
                          title="Delete Quiz"
                          className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30"
                        >
                          <Icon.Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE QUIZ (Dynamic MCQ Builder) */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateQuiz} className="space-y-6">
          <div className="card liquid-glass p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Step 1: General Assessment Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Quiz Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Cloud Architecture"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subject / Academic Category
                </label>
                <CustomDropdown
                  options={CATEGORY_OPTIONS}
                  value={newCategory}
                  onChange={val => {
                    setNewCategory(val);
                    setNewCategoryLabel(CATEGORY_LABEL_MAP[val] || val);
                  }}
                  buttonClassName="py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category Display Label
                </label>
                <input
                  type="text"
                  value={newCategoryLabel}
                  onChange={e => setNewCategoryLabel(e.target.value)}
                  placeholder="e.g. Cloud Computing"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Time Limit (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={newTimeLimit}
                    onChange={e => setNewTimeLimit(Number(e.target.value))}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <CustomDropdown
                    options={DIFFICULTY_OPTIONS}
                    value={newDifficulty}
                    onChange={setNewDifficulty}
                    buttonClassName="py-2.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description & Syllabus Context
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Comprehensive coverage of microservices, serverless, and VPC peering..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
              />
            </div>
          </div>

          {/* Dynamic Questions Builder */}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Step 2: Multiple Choice Questions ({newQuestions.length})
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Each MCQ is normalized into the 3NF questions child table with foreign key cascade.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMCQBlock}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                <Icon.Plus className="w-3.5 h-3.5" />
                <span>Add Question Block</span>
              </button>
            </div>

            <div className="space-y-6">
              {newQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-violet-400">
                      QUESTION #{idx + 1}
                    </span>
                    {newQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMCQBlock(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Icon.Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={e => {
                        const val = e.target.value;
                        setNewQuestions(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, questionText: val } : item))
                        );
                      }}
                      placeholder="Enter question text here..."
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map(optKey => (
                      <div key={optKey} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white/5 font-mono text-xs font-bold text-violet-300 flex items-center justify-center flex-shrink-0">
                          {optKey}
                        </span>
                        <input
                          type="text"
                          required
                          value={(q as any)[`option${optKey}`]}
                          onChange={e => {
                            const val = e.target.value;
                            setNewQuestions(prev =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, [`option${optKey}`]: val } : item
                              )
                            );
                          }}
                          placeholder={`Option ${optKey}`}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Correct Answer
                      </label>
                      <CustomDropdown
                        options={CORRECT_OPTION_CHOICES}
                        value={q.correctOption}
                        onChange={val => {
                          setNewQuestions(prev =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, correctOption: val } : item
                            )
                          );
                        }}
                        buttonClassName="py-2 text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Educational Explanation
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setNewQuestions(prev =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, explanation: val } : item
                            )
                          );
                        }}
                        placeholder="Provide reasoning for students during post-exam review..."
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="btn-secondary text-xs py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2.5 px-8 glow-violet font-semibold"
            >
              {loading ? 'Publishing Assessment...' : 'Deploy & Publish Assessment'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: STAFF APPROVALS & USER ACCESS CONTROL */}
      {activeTab === 'approvals' && (
        <div className="card p-6 sm:p-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Icon.Shield className="w-5 h-5 text-emerald-400" />
                <span>Faculty & Instructor Access Approvals</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Review and approve registration requests for Lecturer and Administrator accounts.
              </p>
            </div>

            <button
              onClick={fetchUsers}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-2"
            >
              <Icon.RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Users</span>
            </button>
          </div>

          {userLoading ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              Loading users and verification records...
            </div>
          ) : usersList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans text-xs">
              No registered user records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                    <th className="pb-3 pl-2">User / Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Identifier</th>
                    <th className="pb-3">Approval Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((u: any) => {
                    const isPending = u.status === 'PENDING';
                    const isApproved = u.status === 'APPROVED';

                    return (
                      <tr
                        key={u.id}
                        className={`transition-colors ${
                          isPending ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{u.name}</span>
                            {u.id === currentUser?.id && (
                              <span className="text-[10px] text-violet-400 font-mono">(You)</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: #{u.id}</div>
                        </td>
                        <td className="py-3.5 font-mono text-slate-300">{u.email}</td>
                        <td className="py-3.5">
                          <span
                            className={
                              u.role === 'admin'
                                ? 'badge-rose'
                                : u.role === 'lecturer'
                                ? 'badge-amber'
                                : 'badge-violet'
                            }
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-300">
                          {u.identifier || 'N/A'}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={
                              isPending
                                ? 'badge-amber font-mono font-bold'
                                : isApproved
                                ? 'badge-emerald font-mono'
                                : 'badge-rose font-mono'
                            }
                          >
                            {u.status || 'APPROVED'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApproveUser(u.id, u.name)}
                                disabled={loading}
                                className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 border-emerald-400"
                              >
                                <Icon.CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectUser(u.id, u.name)}
                                disabled={loading}
                                className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px] font-mono">
                              Active & Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EDIT QUIZ MODAL */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="card liquid-glass max-w-lg w-full p-6 sm:p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-white">
                Edit Assessment Details (#{editingQuiz.id})
              </h3>
              <button
                onClick={() => setEditingQuiz(null)}
                className="text-slate-400 hover:text-white"
              >
                <Icon.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingQuiz.title}
                  onChange={e => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingQuiz.description || ''}
                  onChange={e => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Time Limit (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={editingQuiz.timeLimit}
                    onChange={e =>
                      setEditingQuiz({ ...editingQuiz, timeLimit: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <CustomDropdown
                    options={DIFFICULTY_OPTIONS}
                    value={editingQuiz.difficulty}
                    onChange={val =>
                      setEditingQuiz({ ...editingQuiz, difficulty: val })
                    }
                    buttonClassName="py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingQuiz(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs py-2 px-6 glow-violet"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAFE DELETE CONFIRMATION MODAL */}
      {deletingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="card liquid-glass max-w-md w-full p-6 text-center border-rose-500/40 glow-rose animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <Icon.Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Safe Delete Confirmation
            </h3>
            <p className="text-xs text-slate-300 font-sans mb-4 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">"{deletingQuiz.title}"</span>?
            </p>
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-300 mb-6 font-mono text-left">
              ⚠️ Deletion Notice: All related question bank items for this assessment will be permanently removed.
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingQuiz(null)}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                disabled={loading}
                className="btn-primary text-xs py-2.5 px-6 font-semibold bg-rose-600 hover:bg-rose-500 border-rose-400"
              >
                {loading ? 'Deleting...' : 'Confirm Cascade Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {addQuestionQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="card liquid-glass max-w-lg w-full p-6 sm:p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-white">
                Append Single MCQ to Quiz #{addQuestionQuizId}
              </h3>
              <button
                onClick={() => setAddQuestionQuizId(null)}
                className="text-slate-400 hover:text-white"
              >
                <Icon.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingleQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Question Statement
                </label>
                <input
                  type="text"
                  required
                  value={singleQuestion.questionText}
                  onChange={e =>
                    setSingleQuestion({ ...singleQuestion, questionText: e.target.value })
                  }
                  placeholder="e.g. Which protocol operates at the Transport Layer?"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {(['A', 'B', 'C', 'D'] as const).map(k => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-white/5 font-mono text-xs font-bold text-violet-300 flex items-center justify-center flex-shrink-0">
                    {k}
                  </span>
                  <input
                    type="text"
                    required
                    value={(singleQuestion as any)[`option${k}`]}
                    onChange={e =>
                      setSingleQuestion({ ...singleQuestion, [`option${k}`]: e.target.value })
                    }
                    placeholder={`Option ${k}`}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Correct Option
                  </label>
                  <CustomDropdown
                    options={CORRECT_OPTION_CHOICES}
                    value={singleQuestion.correctOption}
                    onChange={val =>
                      setSingleQuestion({ ...singleQuestion, correctOption: val })
                    }
                    buttonClassName="py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Explanation
                  </label>
                  <input
                    type="text"
                    value={singleQuestion.explanation || ''}
                    onChange={e =>
                      setSingleQuestion({ ...singleQuestion, explanation: e.target.value })
                    }
                    placeholder="Rationale..."
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddQuestionQuizId(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs py-2 px-6 glow-violet"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
