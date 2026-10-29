package com.quiz.onlinequiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * QuizResult Entity representing a completed assessment attempt by a student
 */
@Entity
@Table(name = "quiz_results")
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentName;

    private String studentId;

    private Long quizId;

    private String quizTitle;

    private Integer score;

    private Integer totalQuestions;

    private Integer percentage;

    private Integer timeTakenSeconds;

    private LocalDateTime attemptedAt = LocalDateTime.now();

    public QuizResult() {
    }

    public QuizResult(Long id, String studentName, String studentId, Long quizId, String quizTitle, Integer score, Integer totalQuestions, Integer percentage, Integer timeTakenSeconds, LocalDateTime attemptedAt) {
        this.id = id;
        this.studentName = studentName;
        this.studentId = studentId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.timeTakenSeconds = timeTakenSeconds;
        this.attemptedAt = attemptedAt != null ? attemptedAt : LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getPercentage() {
        return percentage;
    }

    public void setPercentage(Integer percentage) {
        this.percentage = percentage;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}
