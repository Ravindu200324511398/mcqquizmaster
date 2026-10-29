package com.quiz.onlinequiz.controller;

import com.quiz.onlinequiz.model.QuizResult;
import com.quiz.onlinequiz.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Handling Quiz Submissions & Leaderboard
 */
@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private QuizResultRepository resultRepository;

    // GET /api/results
    @GetMapping
    public List<QuizResult> getAllResults() {
        return resultRepository.findAll();
    }

    // GET /api/results/leaderboard
    @GetMapping("/leaderboard")
    public List<QuizResult> getLeaderboard() {
        return resultRepository.findAllByOrderByPercentageDescAttemptedAtDesc();
    }

    // POST /api/results
    @PostMapping
    public QuizResult submitResult(@RequestBody QuizResult result) {
        return resultRepository.save(result);
    }
}
