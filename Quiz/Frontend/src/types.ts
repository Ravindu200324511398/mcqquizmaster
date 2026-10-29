export interface Question {
  id?: number;
  quizId?: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D' | string;
  explanation?: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  timeLimit: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  questions?: Question[];
  creatorEmail?: string;
  authorName?: string;
}

export interface QuizResult {
  id?: number;
  studentName: string;
  studentId: string;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
  attemptedAt?: string;
  violationsCount?: number;
}

export interface StudentAnalytics {
  studentName: string;
  studentId: string;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  recentResults: QuizResult[];
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin' | string;
  identifier?: string;
  avatarUrl?: string;
  department?: string;
  bio?: string;
  createdAt?: string;
}

export type ActiveView = 'home' | 'about' | 'help' | 'exam' | 'result' | 'dashboard' | 'analytics' | 'leaderboard' | 'admin';
