package com.quiz.onlinequiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User Entity representing authenticated Students and Lecturers.
 * Supports email + password authentication and role-based access control.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "student", "lecturer", or "admin"

    @Column
    private String identifier; // Student ID (e.g. EG/2021/1001) or Staff ID (e.g. LEC-4307)

    @Column(nullable = false)
    private String status = "APPROVED"; // "APPROVED", "PENDING", "REJECTED"

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {
    }

    public User(String name, String email, String password, String role, String identifier) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.identifier = identifier;
        this.status = role.equalsIgnoreCase("student") ? "APPROVED" : "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public User(String name, String email, String password, String role, String identifier, String status) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.identifier = identifier;
        this.status = status != null ? status : "APPROVED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
