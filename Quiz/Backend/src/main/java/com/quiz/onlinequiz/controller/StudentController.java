package com.quiz.onlinequiz.controller;

import com.quiz.onlinequiz.dto.StudentDashboardDTO;
import com.quiz.onlinequiz.model.QuizResult;
import com.quiz.onlinequiz.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller for Student Dashboard Operations.
 * Provides endpoints for fetching profile data, performance summaries, and recent activity.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private QuizResultRepository resultRepository;

    /**
     * GET /api/students/dashboard?query={studentIdOrName}
     * Retrieves student profile, metrics, and recent quiz attempts.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@RequestParam(required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String search = query.trim();
        List<QuizResult> results = resultRepository.findByStudentIdIgnoreCaseOrStudentNameIgnoreCaseOrderByAttemptedAtDesc(search, search);

        StudentDashboardDTO dto = buildDashboardDTO(search, results);
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/students/{identifier}/dashboard
     * Path-variable based endpoint for student dashboard metrics.
     */
    @GetMapping("/{identifier}/dashboard")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboardByPath(@PathVariable String identifier) {
        return getStudentDashboard(identifier);
    }

    /**
     * POST /api/students/login
     * Authenticates/registers student session and returns their profile dashboard.
     */
    @PostMapping("/login")
    public ResponseEntity<StudentDashboardDTO> loginStudent(@RequestBody Map<String, String> payload) {
        String name = payload.getOrDefault("studentName", "").trim();
        String id = payload.getOrDefault("studentId", "").trim();

        String search = !id.isEmpty() ? id : name;
        if (search.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<QuizResult> results = resultRepository.findByStudentIdIgnoreCaseOrStudentNameIgnoreCaseOrderByAttemptedAtDesc(search, search);
        StudentDashboardDTO dto = buildDashboardDTO(search, results);

        if (!name.isEmpty() && (dto.getStudentName() == null || dto.getStudentName().equals(search))) {
            dto.setStudentName(name);
        }
        if (!id.isEmpty() && (dto.getStudentId() == null || dto.getStudentId().equals(search))) {
            dto.setStudentId(id);
        }

        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/students/recent-students
     * Returns list of unique active students with recent quiz history.
     */
    @GetMapping("/recent-students")
    public List<Map<String, String>> getActiveStudents() {
        List<QuizResult> allResults = resultRepository.findAllByOrderByPercentageDescAttemptedAtDesc();
        Map<String, Map<String, String>> uniqueMap = new LinkedHashMap<>();

        for (QuizResult r : allResults) {
            String key = (r.getStudentId() != null && !r.getStudentId().isEmpty()) ? r.getStudentId() : r.getStudentName();
            if (key != null && !uniqueMap.containsKey(key)) {
                Map<String, String> item = new HashMap<>();
                item.put("studentName", r.getStudentName() != null ? r.getStudentName() : "Student");
                item.put("studentId", r.getStudentId() != null ? r.getStudentId() : "N/A");
                item.put("key", key);
                uniqueMap.put(key, item);
            }
        }

        return new ArrayList<>(uniqueMap.values());
    }

    private StudentDashboardDTO buildDashboardDTO(String fallbackIdentifier, List<QuizResult> results) {
        StudentDashboardDTO dto = new StudentDashboardDTO();

        if (results == null || results.isEmpty()) {
            dto.setStudentName(fallbackIdentifier);
            dto.setStudentId(fallbackIdentifier);
            dto.setTotalQuizzesAttempted(0);
            dto.setAverageScorePercentage(0.0);
            dto.setHighestScorePercentage(0);
            dto.setRecentActivities(new ArrayList<>());
            return dto;
        }

        // Determine student name and id from recent result
        QuizResult first = results.get(0);
        dto.setStudentName(first.getStudentName() != null ? first.getStudentName() : fallbackIdentifier);
        dto.setStudentId(first.getStudentId() != null ? first.getStudentId() : fallbackIdentifier);

        dto.setTotalQuizzesAttempted(results.size());

        // Calculate average and highest score
        double totalPercentage = 0;
        int maxPercentage = 0;

        for (QuizResult r : results) {
            int p = r.getPercentage() != null ? r.getPercentage() : 0;
            totalPercentage += p;
            if (p > maxPercentage) {
                maxPercentage = p;
            }
        }

        double avg = results.size() > 0 ? (totalPercentage / results.size()) : 0;
        dto.setAverageScorePercentage(Math.round(avg * 10.0) / 10.0);
        dto.setHighestScorePercentage(maxPercentage);
        dto.setRecentActivities(results);

        return dto;
    }
}
