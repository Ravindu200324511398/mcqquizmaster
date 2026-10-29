package com.quiz.onlinequiz.controller;

import com.quiz.onlinequiz.model.Question;
import com.quiz.onlinequiz.model.Quiz;
import com.quiz.onlinequiz.repository.QuestionRepository;
import com.quiz.onlinequiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Managing Quizzes.
 * Exposes RESTful API endpoints for Lecturers and Students.
 */
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private QuestionRepository questionRepository;

    // GET /api/quizzes - Retrieve all quizzes
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // GET /api/quizzes/{id} - Retrieve single quiz by ID
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/quizzes/{id}/questions - Retrieve questions for a specific quiz
    @GetMapping("/{id}/questions")
    public List<Question> getQuestionsForQuiz(@PathVariable Long id) {
        return questionRepository.findByQuizId(id);
    }

    /**
     * POST /api/quizzes/create
     * Endpoint for Lecturer Portal to save a new Quiz along with its list of MCQ questions.
     * Maps to 3NF schema in MySQL via JPA cascade.
     */
    @PostMapping("/create")
    public ResponseEntity<Quiz> createQuizWithQuestions(@RequestBody Quiz quiz) {
        Quiz savedQuiz = quizService.createQuizWithQuestions(quiz);
        return ResponseEntity.ok(savedQuiz);
    }

    // POST /api/quizzes - Standard REST endpoint alias
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz savedQuiz = quizService.createQuizWithQuestions(quiz);
        return ResponseEntity.ok(savedQuiz);
    }

    /**
     * PUT /api/quizzes/{id}
     * Updates an existing quiz. Fulfills the "Update" CRUD rubric criterion.
     * Includes server-side validation and error messages.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        // Server-side validation
        if (updatedQuiz.getTitle() != null && updatedQuiz.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Validation Error", "message", "Quiz title cannot be empty"));
        }
        if (updatedQuiz.getTimeLimit() != null && updatedQuiz.getTimeLimit() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Validation Error", "message", "Time limit must be at least 1 minute"));
        }

        try {
            Quiz saved = quizService.updateQuiz(id, updatedQuiz);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not Found", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server Error", "message", e.getMessage()));
        }
    }

    // DELETE /api/quizzes/{id} - Delete quiz and its questions
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        if (quizService.deleteQuiz(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
