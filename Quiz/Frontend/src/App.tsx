import React, { useState, useEffect, useMemo } from 'react';
import { Quiz, ActiveView, QuizResult, AuthUser } from './types';
import { api } from './api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MorphingDiscoveryBar } from './components/MorphingDiscoveryBar';
import { QuizCard } from './components/QuizCard';
import { QuizDetailsModal } from './components/QuizDetailsModal';
import { ExamRoom } from './components/ExamRoom';
import { ResultScorecard } from './components/ResultScorecard';
import { StudentDashboard } from './components/StudentDashboard';
import { Leaderboard } from './components/Leaderboard';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { AboutUs } from './components/AboutUs';
import { HelpCenter } from './components/HelpCenter';
import { EditProfileModal } from './components/EditProfileModal';
import { Icon } from './components/Icons';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashMsg, setSplashMsg] = useState('CONNECTING...');
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('quiz_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  // Home Page Filter & Search States
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Examination & Result States
  const [detailsModalQuiz, setDetailsModalQuiz] = useState<Quiz | null>(null);
  const [activeExamQuiz, setActiveExamQuiz] = useState<Quiz | null>(null);
  const [candidate, setCandidate] = useState({ name: '', id: '' });
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);
  const [lastUserAnswers, setLastUserAnswers] = useState<Record<number, string>>({});

  // Dynamic Radial Mouse Follower (StageLink Signature Effect)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch Quizzes and Health Check
  const loadData = async () => {
    setLoading(true);
    try {
      const health = await api.checkHealth();
      setBackendOnline(health.online);
      const data = await api.getAllQuizzes();
      setQuizzes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auth Handlers
  const handleOpenAuth = (mode: 'login' | 'register' = 'login', prompt?: string) => {
    setAuthInitialMode(mode);
    setAuthPromptMessage(prompt);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('quiz_user', JSON.stringify(user));
    localStorage.setItem('quiz_student_name', user.name);
    if (user.identifier) {
      localStorage.setItem('quiz_student_id', user.identifier);
    }
    setAuthModalOpen(false);

    // Trigger StageLink-style QuizMaster splash screen upon login
    setSplashMsg(`AUTHENTICATING ${user.name.toUpperCase()}...`);
    setShowSplash(true);

    setTimeout(() => {
      setShowSplash(false);
      // Route based on role
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      } else if (user.role === 'lecturer' || user.role === 'admin') {
        setActiveView('admin');
      } else {
        setActiveView('home');
      }
    }, 1800);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('quiz_user');
    if (activeView === 'admin' || activeView === 'exam') {
      setActiveView('home');
    }
  };

  const handleUpdateProfile = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('quiz_user', JSON.stringify(updatedUser));
    localStorage.setItem('quiz_student_name', updatedUser.name);
    if (updatedUser.identifier) {
      localStorage.setItem('quiz_student_id', updatedUser.identifier);
    }
  };

  // Require Auth Guard before invoking any service
  const requireAuthForService = (quiz: Quiz) => {
    if (!currentUser) {
      setPendingAction(() => () => setDetailsModalQuiz(quiz));
      handleOpenAuth(
        'login',
        `Please sign in or create an account to attempt the "${quiz.title}" examination.`
      );
    } else {
      setDetailsModalQuiz(quiz);
    }
  };

  // Categories list
  const categories = [
    { id: 'all', label: 'All Modules', icon: '🌐' },
    { id: 'web', label: 'Web Development', icon: '⚡' },
    { id: 'java', label: 'Java & OOP', icon: '☕' },
    { id: 'db', label: 'Database & SQL', icon: '🗄️' },
    { id: 'dsa', label: 'Data Structures', icon: '🌲' },
    { id: 'se', label: 'Software Architecture', icon: '🏛️' },
    { id: 'network', label: 'Cyber & Networks', icon: '🔒' },
    { id: 'cloud', label: 'Cloud & DevOps', icon: '☁️' },
    { id: 'ai', label: 'AI & Machine Learning', icon: '🧠' },
  ];

  // Filter & Sort Quizzes
  const filteredAndSortedQuizzes = useMemo(() => {
    return quizzes
      .filter(q => {
        const matchesCategory =
          activeCategory === 'all' || q.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesDifficulty =
          difficultyFilter === 'All' || q.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
        const matchesSearch =
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'time-asc') return a.timeLimit - b.timeLimit;
        if (sortBy === 'time-desc') return b.timeLimit - a.timeLimit;
        return a.id - b.id;
      });
  }, [quizzes, activeCategory, difficultyFilter, searchQuery, sortBy]);

  // Start Assessment Flow
  const handleProceedToExam = (quiz: Quiz, studentName: string, studentId: string) => {
    setCandidate({ name: studentName, id: studentId });
    setDetailsModalQuiz(null);
    setActiveExamQuiz(quiz);
    setActiveView('exam');
  };

  // Complete Assessment Flow
  const handleFinishExam = async (result: QuizResult, answers: Record<number, string>) => {
    setLoading(true);
    try {
      const persisted = await api.submitResult(result);
      setLatestResult(persisted);
      setLastUserAnswers(answers);
      setActiveExamQuiz(null);
      setActiveView('result');
    } catch (e) {
      console.error(e);
      setLatestResult(result);
      setLastUserAnswers(answers);
      setActiveExamQuiz(null);
      setActiveView('result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative text-slate-100">
      {/* Navbar (Hidden in active exam room for proctoring focus) */}
      {activeView !== 'exam' && (
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
          backendOnline={backendOnline}
          onOpenEditProfile={() => setEditProfileModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME / DISCOVER QUIZZES */}
        {activeView === 'home' && (
          <div>
            <HeroSection
              onExplore={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              setActiveView={setActiveView}
              totalQuizzes={quizzes.length}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
            />

            <section id="catalog-section" className="py-8">
              <MorphingDiscoveryBar
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                difficultyFilter={difficultyFilter}
                onDifficultyChange={setDifficultyFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">
                      Curated Assessments Catalog
                    </h2>
                    <p className="text-xs text-slate-400 font-sans">
                      Showing {filteredAndSortedQuizzes.length} of {quizzes.length} evaluations
                    </p>
                  </div>

                  <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                    Accredited Examination Rubric
                  </span>
                </div>

                {loading ? (
                  <div className="card p-16 text-center text-slate-400 font-mono text-sm">
                    Connecting to examination registry & loading modules...
                  </div>
                ) : filteredAndSortedQuizzes.length === 0 ? (
                  <div className="card p-12 text-center text-slate-400">
                    <Icon.Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <p className="text-base font-medium text-white mb-1">
                      No quizzes match your filters
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      Try clearing your search query or selecting "All Modules".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                        setDifficultyFilter('All');
                      }}
                      className="btn-secondary text-xs py-2 px-4"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredAndSortedQuizzes.map(quiz => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onViewDetails={() => requireAuthForService(quiz)}
                        onStartQuiz={() => requireAuthForService(quiz)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ACTIVE EXAMINATION ROOM */}
        {activeView === 'exam' && activeExamQuiz && (
          <ExamRoom
            quiz={activeExamQuiz}
            studentName={candidate.name || currentUser?.name || 'Student Candidate'}
            studentId={candidate.id || currentUser?.identifier || 'EG/2021/1001'}
            onFinish={handleFinishExam}
            onExit={() => setActiveView('home')}
          />
        )}

        {/* VIEW 3: SCORECARD & GRADING REVIEW */}
        {activeView === 'result' && latestResult && (
          <ResultScorecard
            quiz={quizzes.find(q => q.id === latestResult.quizId) || quizzes[0]}
            result={latestResult}
            userAnswers={lastUserAnswers}
            onRetake={() => {
              const target = quizzes.find(q => q.id === latestResult.quizId) || quizzes[0];
              setActiveExamQuiz(target);
              setActiveView('exam');
            }}
            onGoHome={() => setActiveView('home')}
            onGoLeaderboard={() => setActiveView('leaderboard')}
            onGoDashboard={() => setActiveView('dashboard')}
          />
        )}

        {/* VIEW 4: STUDENT ANALYTICS DASHBOARD */}
        {(activeView === 'dashboard' || activeView === 'analytics') && (
          <StudentDashboard setActiveView={setActiveView} currentUser={currentUser} />
        )}

        {/* VIEW 5: GLOBAL LEADERBOARD */}
        {activeView === 'leaderboard' && <Leaderboard />}

        {/* VIEW 6: LECTURER / ADMIN PORTAL (FULL CRUD) */}
        {activeView === 'admin' && (
          <AdminPortal quizzes={quizzes} onRefreshQuizzes={loadData} currentUser={currentUser} />
        )}

        {/* VIEW 7: ABOUT US */}
        {activeView === 'about' && (
          <AboutUs setActiveView={setActiveView} onOpenAuth={handleOpenAuth} />
        )}

        {/* VIEW 8: HELP & FAQ */}
        {activeView === 'help' && (
          <HelpCenter setActiveView={setActiveView} onOpenAuth={handleOpenAuth} />
        )}
      </main>

      {/* Quiz Details Modal */}
      {detailsModalQuiz && (
        <QuizDetailsModal
          quiz={detailsModalQuiz}
          currentUser={currentUser}
          onClose={() => setDetailsModalQuiz(null)}
          onProceed={handleProceedToExam}
        />
      )}

      {/* StageLink Auth Modal (Sign In / Sign Up / Forgot Password) */}
      {authModalOpen && (
        <AuthModal
          initialMode={authInitialMode}
          promptMessage={authPromptMessage}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Edit Profile & Photo Modal */}
      {editProfileModalOpen && (
        <EditProfileModal
          isOpen={editProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          currentUser={currentUser}
          onSave={handleUpdateProfile}
        />
      )}

      {/* StageLink-style Branded Splash Screen */}
      {showSplash && (
        <SplashScreen
          statusMessage={splashMsg}
          onComplete={() => setShowSplash(false)}
          duration={1800}
        />
      )}

      {/* Sleek StageLink Glass Footer */}
      {activeView !== 'exam' && (
        <footer className="w-full glass-panel border-t border-white/[0.08] py-8 px-4 text-xs font-sans text-slate-400 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center text-white overflow-hidden p-0.5">
                <img
                  src="/quizmaster-logo.jpg"
                  alt="QuizMaster"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white text-sm">QuizMaster</span>
                <span className="text-slate-500 ml-2">
                  Official Academic Assessment Framework
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-violet-300">Academic Integrity Standard</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300">Automated Grading Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-300">Anti-Cheat Monitored</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
