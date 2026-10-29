package com.quiz.onlinequiz.dto;

import com.quiz.onlinequiz.model.QuizResult;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object for Student Dashboard.
 * Consolidates student profile, performance metrics, and recent quiz activity.
 */
public class StudentDashboardDTO {

    private String studentName;
    private String studentId;
    private int totalQuizzesAttempted;
    private double averageScorePercentage;
    private int highestScorePercentage;
    private List<QuizResult> recentActivities = new ArrayList<>();

    public StudentDashboardDTO() {
    }

    public StudentDashboardDTO(String studentName, String studentId, int totalQuizzesAttempted, double averageScorePercentage, int highestScorePercentage, List<QuizResult> recentActivities) {
        this.studentName = studentName;
        this.studentId = studentId;
        this.totalQuizzesAttempted = totalQuizzesAttempted;
        this.averageScorePercentage = averageScorePercentage;
        this.highestScorePercentage = highestScorePercentage;
        this.recentActivities = recentActivities != null ? recentActivities : new ArrayList<>();
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

    public int getTotalQuizzesAttempted() {
        return totalQuizzesAttempted;
    }

    public void setTotalQuizzesAttempted(int totalQuizzesAttempted) {
        this.totalQuizzesAttempted = totalQuizzesAttempted;
    }

    public double getAverageScorePercentage() {
        return averageScorePercentage;
    }

    public void setAverageScorePercentage(double averageScorePercentage) {
        this.averageScorePercentage = averageScorePercentage;
    }

    public int getHighestScorePercentage() {
        return highestScorePercentage;
    }

    public void setHighestScorePercentage(int highestScorePercentage) {
        this.highestScorePercentage = highestScorePercentage;
    }

    public List<QuizResult> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<QuizResult> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
