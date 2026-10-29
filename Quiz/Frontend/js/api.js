/**
 * Online Quiz System - API Service Layer
 * Interacts with Spring Boot Backend REST APIs (http://localhost:8080/api)
 * Automatically falls back to LocalStorage mock data if the backend server is offline.
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Default mock data to seed if local storage is empty
const DEFAULT_QUIZZES = [
  {
    id: 1,
    title: 'Web Development Basics',
    description: 'Test your foundational knowledge on HTML5, CSS3, and JavaScript modern syntax.',
    category: 'web',
    categoryLabel: 'Web Dev',
    timeLimit: 5, // minutes
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'Java & Object-Oriented Programming',
    description: 'Master classes, inheritance, polymorphism, encapsulation, and Java 17 features.',
    category: 'java',
    categoryLabel: 'Java / OOP',
    timeLimit: 7,
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Database & SQL Fundamentals',
    description: 'Assess relational database schemas, JOINs, primary/foreign keys, and JPA concepts.',
    category: 'db',
    categoryLabel: 'Database',
    timeLimit: 6,
    difficulty: 'Medium'
  }
];

const DEFAULT_QUESTIONS = [
  // Web Dev Questions (Quiz 1)
  {
    id: 101,
    quizId: 1,
    questionText: 'What does HTML stand for in modern web technology?',
    optionA: 'Hyper Tool Modern Language',
    optionB: 'HyperText Markup Language',
    optionC: 'High Texture Machine Language',
    optionD: 'Hyperlink Transfer Mark Logic',
    correctOption: 'B',
    explanation: 'HTML stands for HyperText Markup Language, the standard markup language for documents designed to be displayed in a web browser.'
  },
  {
    id: 102,
    quizId: 1,
    questionText: 'Which CSS property is used to create space INSIDE the border of an element?',
    optionA: 'margin',
    optionB: 'border-spacing',
    optionC: 'padding',
    optionD: 'outline',
    correctOption: 'C',
    explanation: 'The padding property sets the inner space between the element content and its border.'
  },
  {
    id: 103,
    quizId: 1,
    questionText: 'Which JavaScript method is used to make asynchronous HTTP requests to a REST API?',
    optionA: 'fetch()',
    optionB: 'http.get()',
    optionC: 'request.send()',
    optionD: 'asyncCall()',
    correctOption: 'A',
    explanation: 'The fetch() API provides a modern JavaScript interface for accessing and manipulating HTTP pipeline requests and responses.'
  },
  {
    id: 104,
    quizId: 1,
    questionText: 'Which HTTP method is typically used to retrieve data from a RESTful API?',
    optionA: 'POST',
    optionB: 'PUT',
    optionC: 'DELETE',
    optionD: 'GET',
    correctOption: 'D',
    explanation: 'GET requests are safe and idempotent methods used in REST to fetch/retrieve resources from a server.'
  },

  // Java Questions (Quiz 2)
  {
    id: 201,
    quizId: 2,
    questionText: 'Which principle of OOP is demonstrated by hiding internal implementation details and exposing only public methods?',
    optionA: 'Inheritance',
    optionB: 'Encapsulation',
    optionC: 'Polymorphism',
    optionD: 'Abstraction',
    correctOption: 'B',
    explanation: 'Encapsulation is the bundling of data with the methods that operate on that data, restricting direct access to some components.'
  },
  {
    id: 202,
    quizId: 2,
    questionText: 'What is the default port for a Spring Boot web application embedded Tomcat server?',
    optionA: '3000',
    optionB: '8000',
    optionC: '8080',
    optionD: '5000',
    correctOption: 'C',
    explanation: 'Spring Boot starts embedded Tomcat server on port 8080 by default.'
  },
  {
    id: 203,
    quizId: 2,
    questionText: 'Which Spring annotation is used to create a RESTful web controller that returns JSON directly?',
    optionA: '@Controller',
    optionB: '@RestController',
    optionC: '@Service',
    optionD: '@Component',
    correctOption: 'B',
    explanation: '@RestController is a convenience annotation that combines @Controller and @ResponseBody, serializing return values directly to JSON.'
  },

  // Database Questions (Quiz 3)
  {
    id: 301,
    quizId: 3,
    questionText: 'Which SQL command is used to retrieve data from a database table?',
    optionA: 'EXTRACT',
    optionB: 'GET',
    optionC: 'SELECT',
    optionD: 'PULL',
    correctOption: 'C',
    explanation: 'The SELECT statement is used to select and query data from a database.'
  },
  {
    id: 302,
    quizId: 3,
    questionText: 'Which key uniquely identifies each record in a relational database table?',
    optionA: 'Foreign Key',
    optionB: 'Composite Key',
    optionC: 'Primary Key',
    optionD: 'Index Key',
    correctOption: 'C',
    explanation: 'A Primary Key column or set of columns uniquely identifies every single row in a table.'
  }
];

const DEFAULT_RESULTS = [
  {
    id: 1,
    studentName: 'Kamal Perera',
    quizTitle: 'Web Development Basics',
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    date: '2026-10-09'
  },
  {
    id: 2,
    studentName: 'Nimal Silva',
    quizTitle: 'Java & Object-Oriented Programming',
    score: 2,
    totalQuestions: 3,
    percentage: 67,
    date: '2026-10-08'
  },
  {
    id: 3,
    studentName: 'Kasun Wickramasinghe',
    quizTitle: 'Database & SQL Fundamentals',
    score: 2,
    totalQuestions: 2,
    percentage: 100,
    date: '2026-10-07'
  }
];

// Initialize storage if empty
function initializeLocalStorage() {
  if (!localStorage.getItem('quiz_system_quizzes')) {
    localStorage.setItem('quiz_system_quizzes', JSON.stringify(DEFAULT_QUIZZES));
  }
  if (!localStorage.getItem('quiz_system_questions')) {
    localStorage.setItem('quiz_system_questions', JSON.stringify(DEFAULT_QUESTIONS));
  }
  if (!localStorage.getItem('quiz_system_results')) {
    localStorage.setItem('quiz_system_results', JSON.stringify(DEFAULT_RESULTS));
  }
}

initializeLocalStorage();

const QuizApi = {
  // Check backend server availability
  async checkBackendHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      return response.ok;
    } catch (e) {
      return false;
    }
  },

  // Get all quizzes
  async getQuizzes() {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        console.log('[API] Fetched quizzes from Spring Boot Backend');
        return await response.json();
      }
    } catch (e) {
      console.warn('[Offline Mode] Using LocalStorage quizzes data');
    }
    return JSON.parse(localStorage.getItem('quiz_system_quizzes') || '[]');
  },

  // Get single quiz by ID
  async getQuizById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Using LocalStorage for quiz ID:', id);
    }
    const quizzes = JSON.parse(localStorage.getItem('quiz_system_quizzes') || '[]');
    return quizzes.find(q => q.id == id);
  },

  // Get questions for a specific quiz
  async getQuestions(quizId) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Using LocalStorage for questions');
    }
    const questions = JSON.parse(localStorage.getItem('quiz_system_questions') || '[]');
    return questions.filter(q => q.quizId == quizId);
  },

  // Submit test result
  async submitResult(resultData) {
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
        signal: AbortSignal.timeout(2500)
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Saving quiz result to LocalStorage');
    }
    const results = JSON.parse(localStorage.getItem('quiz_system_results') || '[]');
    resultData.id = Date.now();
    resultData.date = new Date().toISOString().split('T')[0];
    results.unshift(resultData);
    localStorage.setItem('quiz_system_results', JSON.stringify(results));
    return resultData;
  },

  // Get Leaderboard
  async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/results/leaderboard`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Reading leaderboard from LocalStorage');
    }
    const results = JSON.parse(localStorage.getItem('quiz_system_results') || '[]');
    return results.sort((a, b) => b.percentage - a.percentage);
  },

  // Create complete Quiz with dynamic questions list (Lecturer Portal)
  async createQuizWithQuestions(quizData) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
        signal: AbortSignal.timeout(3500)
      });
      if (response.ok) {
        console.log('[API] Quiz with questions saved to Spring Boot backend successfully');
        return await response.json();
      }
    } catch (e) {
      console.warn('[Offline Mode] Saving complete quiz locally');
    }

    // Local fallback
    const quizzes = JSON.parse(localStorage.getItem('quiz_system_quizzes') || '[]');
    const questions = JSON.parse(localStorage.getItem('quiz_system_questions') || '[]');

    const newQuizId = Date.now();
    quizData.id = newQuizId;

    if (quizData.questions && Array.isArray(quizData.questions)) {
      quizData.questions.forEach((q, idx) => {
        q.id = newQuizId + idx + 1;
        q.quizId = newQuizId;
        questions.push(q);
      });
    }

    quizzes.push(quizData);
    localStorage.setItem('quiz_system_quizzes', JSON.stringify(quizzes));
    localStorage.setItem('quiz_system_questions', JSON.stringify(questions));

    return quizData;
  },

  // Add a new Quiz (Admin)
  async createQuiz(quiz) {
    return this.createQuizWithQuestions(quiz);
  },

  // Add Question (Admin)
  async createQuestion(question) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
        signal: AbortSignal.timeout(2500)
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Saving question locally');
    }
    const questions = JSON.parse(localStorage.getItem('quiz_system_questions') || '[]');
    question.id = Date.now();
    questions.push(question);
    localStorage.setItem('quiz_system_questions', JSON.stringify(questions));
    return question;
  },

  // Delete Question by ID (Admin)
  async deleteQuestion(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) return true;
    } catch (e) {
      console.warn('[Offline Mode] Deleting question locally');
    }
    let questions = JSON.parse(localStorage.getItem('quiz_system_questions') || '[]');
    questions = questions.filter(q => q.id != id);
    localStorage.setItem('quiz_system_questions', JSON.stringify(questions));
    return true;
  },

  // Update Quiz (Admin / Lecturer - PUT /api/quizzes/{id})
  async updateQuiz(id, quizData) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        console.log('[API] Quiz updated in Spring Boot backend');
        return await response.json();
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Server returned ' + response.status);
      }
    } catch (e) {
      console.warn('[Offline Mode] Updating quiz locally:', e);
    }

    // Local fallback update
    const quizzes = JSON.parse(localStorage.getItem('quiz_system_quizzes') || '[]');
    const idx = quizzes.findIndex(q => q.id == id);
    if (idx !== -1) {
      quizzes[idx] = { ...quizzes[idx], ...quizData, id: Number(id) };
      localStorage.setItem('quiz_system_quizzes', JSON.stringify(quizzes));
      return quizzes[idx];
    }
    return quizData;
  },

  // Delete Quiz
  async deleteQuiz(id) {
    try {
      await fetch(`${API_BASE_URL}/quizzes/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('[Offline Mode] Deleting locally');
    }
    let quizzes = JSON.parse(localStorage.getItem('quiz_system_quizzes') || '[]');
    quizzes = quizzes.filter(q => q.id != id);
    localStorage.setItem('quiz_system_quizzes', JSON.stringify(quizzes));
  },

  // Get Student Dashboard Profile and Metrics
  async getStudentDashboard(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/dashboard?query=${encodeURIComponent(identifier)}`, { signal: AbortSignal.timeout(2500) });
      if (response.ok) {
        console.log('[API] Fetched student dashboard from Spring Boot Backend');
        return await response.json();
      }
    } catch (e) {
      console.warn('[Offline Mode] Calculating student dashboard locally');
    }

    // LocalStorage fallback calculation
    const results = JSON.parse(localStorage.getItem('quiz_system_results') || '[]');
    const studentResults = results.filter(r => 
      (r.studentId && r.studentId.toLowerCase() === identifier.toLowerCase()) ||
      (r.studentName && r.studentName.toLowerCase() === identifier.toLowerCase())
    );

    const total = studentResults.length;
    let totalScore = 0;
    let maxScore = 0;

    studentResults.forEach(r => {
      const p = r.percentage || 0;
      totalScore += p;
      if (p > maxScore) maxScore = p;
    });

    const avg = total > 0 ? Math.round((totalScore / total) * 10) / 10 : 0;
    const name = studentResults.length > 0 ? (studentResults[0].studentName || identifier) : identifier;
    const id = studentResults.length > 0 ? (studentResults[0].studentId || identifier) : identifier;

    return {
      studentName: name,
      studentId: id,
      totalQuizzesAttempted: total,
      averageScorePercentage: avg,
      highestScorePercentage: maxScore,
      recentActivities: studentResults
    };
  },

  // Student Login API
  async loginStudent(studentName, studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, studentId }),
        signal: AbortSignal.timeout(2500)
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Logging in locally');
    }
    return this.getStudentDashboard(studentId || studentName);
  },

  // Get active students list
  async getActiveStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/recent-students`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[Offline Mode] Reading active students from local storage');
    }
    const results = JSON.parse(localStorage.getItem('quiz_system_results') || '[]');
    const map = {};
    results.forEach(r => {
      const key = r.studentId || r.studentName;
      if (key && !map[key]) {
        map[key] = { studentName: r.studentName, studentId: r.studentId, key };
      }
    });
    return Object.values(map);
  },

  // ================================================
  // AUTH: Register / Login (email + password)
  // ================================================

  /**
   * Register a new user (student or lecturer) with email + password.
   * Falls back to local storage if backend is unavailable.
   */
  async registerUser({ name, email, password, role, identifier }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, identifier }),
        signal: AbortSignal.timeout(3000)
      });
      const data = await response.json();
      if (response.ok) {
        // Also cache locally for offline mode
        this._localSaveUser({ ...data.user, password });
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch (e) {
      console.warn('[Offline Mode] Registering user locally');
      return this._localRegister({ name, email, password, role, identifier });
    }
  },

  /**
   * Login with email + password. Validates role on the backend.
   * Falls back to local storage if backend is unavailable.
   */
  async loginAuth({ email, password, role }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
        signal: AbortSignal.timeout(3000)
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data.message || 'Login failed.' };
    } catch (e) {
      console.warn('[Offline Mode] Authenticating locally');
      return this._localLogin({ email, password, role });
    }
  },

  // --- Local Auth Helpers (offline fallback) ---

  _getLocalUsers() {
    return JSON.parse(localStorage.getItem('qm_users') || '[]');
  },

  _saveLocalUsers(users) {
    localStorage.setItem('qm_users', JSON.stringify(users));
  },

  _localSaveUser(user) {
    const users = this._getLocalUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx === -1) users.push(user);
    else users[idx] = user;
    this._saveLocalUsers(users);
  },

  _localRegister({ name, email, password, role, identifier }) {
    const users = this._getLocalUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }
    if (!identifier) {
      identifier = role === 'lecturer'
        ? 'LEC-' + (1000 + Math.floor(Math.random() * 9000))
        : 'EG/2021/' + (1000 + Math.floor(Math.random() * 9000));
    }
    const newUser = { id: Date.now(), name, email: email.toLowerCase(), password, role, identifier, createdAt: new Date().toISOString() };
    users.push(newUser);
    this._saveLocalUsers(users);
    return { success: true, user: this._stripPassword(newUser), message: 'Registration successful! You can now sign in.' };
  },

  _localLogin({ email, password, role }) {
    const users = this._getLocalUsers();
    // Seed demo accounts if empty
    if (users.length === 0) {
      this._localRegister({ name: 'Dr. N. Fernando', email: 'lecturer@quizmaster.lk', password: 'admin123', role: 'lecturer', identifier: 'LEC-4307' });
      this._localRegister({ name: 'Kamal Perera', email: 'student@quizmaster.lk', password: 'student123', role: 'student', identifier: 'EG/2021/1001' });
    }
    const freshUsers = this._getLocalUsers();
    const user = freshUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: 'No account found with this email. Please register first.' };
    if (user.password !== password) return { success: false, message: 'Incorrect password. Please try again.' };
    if (role && user.role !== role) {
      return { success: false, message: `Access Denied: This account is registered as a ${user.role.toUpperCase()}. Use the correct portal.` };
    }
    return { success: true, user: this._stripPassword(user), message: `Welcome back, ${user.name}!` };
  },

  _stripPassword(user) {
    const { password, ...rest } = user;
    return rest;
  },

  /** Save authenticated user to localStorage session */
  saveSession(user) {
    localStorage.setItem('qm_auth_user', JSON.stringify(user));
    // Also keep backward-compat keys for quiz.html / leaderboard
    if (user.name) localStorage.setItem('current_student_name', user.name);
    if (user.identifier) localStorage.setItem('current_student_id', user.identifier);
    if (user.role && user.email) {
      this.saveEmailHistory(user.role, user.email);
    }
  },

  /** Get email history for auto-suggest (Student or Lecturer) */
  getEmailHistory(role) {
    const key = role === 'lecturer' ? 'qm_lecturer_email_history' : 'qm_student_email_history';
    const defaults = role === 'lecturer' ? ['lecturer@quizmaster.lk'] : ['student@quizmaster.lk'];
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      const combined = Array.from(new Set([...saved, ...defaults])).filter(Boolean);
      return combined;
    } catch (e) {
      return defaults;
    }
  },

  /** Get last logged in email for role */
  getLastEmail(role) {
    const key = role === 'lecturer' ? 'qm_last_lecturer_email' : 'qm_last_student_email';
    return localStorage.getItem(key) || '';
  },

  /** Record email in auto-suggest history */
  saveEmailHistory(role, email) {
    if (!email || !email.includes('@')) return;
    email = email.trim().toLowerCase();
    const lastKey = role === 'lecturer' ? 'qm_last_lecturer_email' : 'qm_last_student_email';
    localStorage.setItem(lastKey, email);

    const historyKey = role === 'lecturer' ? 'qm_lecturer_email_history' : 'qm_student_email_history';
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (e) { history = []; }

    history = history.filter(e => e.toLowerCase() !== email.toLowerCase());
    history.unshift(email);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem(historyKey, JSON.stringify(history));
  },

  /** Get currently logged-in user from session */
  getSession() {
    try {
      const raw = localStorage.getItem('qm_auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },

  /** Clear session (logout) */
  clearSession() {
    localStorage.removeItem('qm_auth_user');
  }
};
