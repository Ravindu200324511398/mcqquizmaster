package com.quiz.onlinequiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/**
 * Main Entry Point for Online Quiz System Backend
 * Module: EE4207 - Web Application Development
 */
@SpringBootApplication
public class OnlineQuizApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineQuizApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Online Quiz System REST API Backend is RUNNING!");
        System.out.println("🔗 Base API URL: http://localhost:8080/api");
        System.out.println("🩺 Health Check: http://localhost:8080/api/health");
        System.out.println("=================================================");
    }
}
