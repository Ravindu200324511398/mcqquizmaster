package com.quiz.onlinequiz.repository;

import com.quiz.onlinequiz.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    List<QuizResult> findAllByOrderByPercentageDescAttemptedAtDesc();

    List<QuizResult> findByStudentIdIgnoreCaseOrderByAttemptedAtDesc(String studentId);

    List<QuizResult> findByStudentNameIgnoreCaseOrderByAttemptedAtDesc(String studentName);

    List<QuizResult> findByStudentIdIgnoreCaseOrStudentNameIgnoreCaseOrderByAttemptedAtDesc(String studentId, String studentName);
}
