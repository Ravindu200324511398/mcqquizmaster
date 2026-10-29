package com.quiz.onlinequiz.service;

import com.quiz.onlinequiz.model.Question;
import com.quiz.onlinequiz.model.Quiz;
import com.quiz.onlinequiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Layer for Quiz and Question operations.
 * Implements 3NF relational data persistence within atomic database transactions.
 */
@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    /**
     * Saves a new Quiz along with its dynamic list of MCQ questions.
     * Transactional propagation ensures both parent (quizzes) and child (questions)
     * are persisted atomically in accordance with 3NF database schema.
     */
    @Transactional
    public Quiz createQuizWithQuestions(Quiz quiz) {
        if (quiz.getCategoryLabel() == null || quiz.getCategoryLabel().trim().isEmpty()) {
            quiz.setCategoryLabel(quiz.getCategory() != null ? quiz.getCategory().toUpperCase() : "GENERAL");
        }

        if (quiz.getQuestions() != null && !quiz.getQuestions().isEmpty()) {
            for (Question question : quiz.getQuestions()) {
                question.setQuiz(quiz);
            }
        }

        return quizRepository.save(quiz);
    }

    /**
     * Updates an existing Quiz record.
     * Enforces server-side validation and transactional update in 3NF.
     */
    @Transactional
    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {
        return quizRepository.findById(id).map(existingQuiz -> {
            if (updatedQuiz.getTitle() != null && !updatedQuiz.getTitle().trim().isEmpty()) {
                existingQuiz.setTitle(updatedQuiz.getTitle().trim());
            }
            if (updatedQuiz.getDescription() != null) {
                existingQuiz.setDescription(updatedQuiz.getDescription().trim());
            }
            if (updatedQuiz.getCategory() != null && !updatedQuiz.getCategory().trim().isEmpty()) {
                existingQuiz.setCategory(updatedQuiz.getCategory().trim());
                existingQuiz.setCategoryLabel(updatedQuiz.getCategoryLabel() != null && !updatedQuiz.getCategoryLabel().trim().isEmpty()
                        ? updatedQuiz.getCategoryLabel().trim()
                        : updatedQuiz.getCategory().toUpperCase());
            }
            if (updatedQuiz.getTimeLimit() != null && updatedQuiz.getTimeLimit() > 0) {
                existingQuiz.setTimeLimit(updatedQuiz.getTimeLimit());
            }
            if (updatedQuiz.getDifficulty() != null && !updatedQuiz.getDifficulty().trim().isEmpty()) {
                existingQuiz.setDifficulty(updatedQuiz.getDifficulty().trim());
            }
            return quizRepository.save(existingQuiz);
        }).orElseThrow(() -> new IllegalArgumentException("Quiz not found with ID: " + id));
    }

    @Transactional
    public boolean deleteQuiz(Long id) {
        if (quizRepository.existsById(id)) {
            quizRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
