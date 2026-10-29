package com.quiz.onlinequiz.controller;

import com.quiz.onlinequiz.model.User;
import com.quiz.onlinequiz.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Seeds the three required hardcoded authenticated accounts on startup:
     * 1. Administrator: admin@quizmaster.lk / admin123
     * 2. Lecturer:      lecturer@quizmaster.lk / lecturer123
     * 3. Student:       student@quizmaster.lk / student123
     */
    @PostConstruct
    public void seedInitialUsers() {
        try {
            // 1. Hardcoded Administrator Account (Pre-approved)
            if (!userRepository.existsByEmailIgnoreCase("admin@quizmaster.lk")) {
                User admin = new User(
                        "System Administrator",
                        "admin@quizmaster.lk",
                        "admin123",
                        "admin",
                        "ADM-001",
                        "APPROVED"
                );
                userRepository.save(admin);
            } else {
                userRepository.findByEmailIgnoreCase("admin@quizmaster.lk").ifPresent(a -> {
                    a.setPassword("admin123");
                    a.setStatus("APPROVED");
                    a.setRole("admin");
                    userRepository.save(a);
                });
            }

            // 2. Hardcoded Lecturer Account (Pre-approved)
            if (!userRepository.existsByEmailIgnoreCase("lecturer@quizmaster.lk")) {
                User lecturer = new User(
                        "Dr. N. Fernando",
                        "lecturer@quizmaster.lk",
                        "lecturer123",
                        "lecturer",
                        "LEC-4307",
                        "APPROVED"
                );
                userRepository.save(lecturer);
            } else {
                userRepository.findByEmailIgnoreCase("lecturer@quizmaster.lk").ifPresent(l -> {
                    l.setPassword("lecturer123");
                    l.setStatus("APPROVED");
                    l.setRole("lecturer");
                    userRepository.save(l);
                });
            }

            // 3. Hardcoded Student Account (Pre-approved)
            if (!userRepository.existsByEmailIgnoreCase("student@quizmaster.lk")) {
                User student = new User(
                        "Kamal Perera",
                        "student@quizmaster.lk",
                        "student123",
                        "student",
                        "EG/2021/1001",
                        "APPROVED"
                );
                userRepository.save(student);
            } else {
                userRepository.findByEmailIgnoreCase("student@quizmaster.lk").ifPresent(s -> {
                    s.setPassword("student123");
                    s.setStatus("APPROVED");
                    s.setRole("student");
                    userRepository.save(s);
                });
            }

            System.out.println("[Auth] Initial 3 hardcoded authenticated accounts seeded & verified successfully.");
        } catch (Exception e) {
            System.err.println("[Auth] Note: Database initialization: " + e.getMessage());
        }
    }

    /**
     * POST /api/auth/register
     * Registers a new user.
     * Note: Student accounts are approved immediately.
     * Lecturer and Admin accounts are created in PENDING status and require Administrator approval.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> payload) {
        String name = payload.getOrDefault("name", "").trim();
        String email = payload.getOrDefault("email", "").trim().toLowerCase();
        String password = payload.getOrDefault("password", "").trim();
        String role = payload.getOrDefault("role", "student").trim().toLowerCase();
        String identifier = payload.getOrDefault("identifier", "").trim();

        Map<String, Object> response = new HashMap<>();

        // Validation
        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            response.put("success", false);
            response.put("message", "Name, email, and password are required fields.");
            return ResponseEntity.badRequest().body(response);
        }

        if (!email.contains("@") || !email.contains(".")) {
            response.put("success", false);
            response.put("message", "Please enter a valid email address.");
            return ResponseEntity.badRequest().body(response);
        }

        if (password.length() < 4) {
            response.put("success", false);
            response.put("message", "Password must be at least 4 characters.");
            return ResponseEntity.badRequest().body(response);
        }

        if (!role.equals("student") && !role.equals("lecturer") && !role.equals("admin")) {
            role = "student";
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            response.put("success", false);
            response.put("message", "An account with this email already exists. Please sign in instead.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Generate default identifier if empty
        if (identifier.isEmpty()) {
            if (role.equals("lecturer")) {
                identifier = "LEC-" + (1000 + (int)(Math.random() * 9000));
            } else if (role.equals("admin")) {
                identifier = "ADM-" + (100 + (int)(Math.random() * 900));
            } else {
                identifier = "EG/2021/" + (1000 + (int)(Math.random() * 9000));
            }
        }

        // Students are auto-approved; Lecturers and Admins require Admin approval
        boolean isStudent = role.equals("student");
        String initialStatus = isStudent ? "APPROVED" : "PENDING";

        User newUser = new User(name, email, password, role, identifier, initialStatus);
        User savedUser = userRepository.save(newUser);

        response.put("success", true);
        response.put("pendingApproval", !isStudent);
        if (isStudent) {
            response.put("message", "Registration successful! You can now sign in.");
        } else {
            response.put("message", "Registration received! Your " + role.toUpperCase() + 
                         " account is currently pending administrator verification. Please wait for an Administrator to approve your account before signing in.");
        }
        response.put("user", sanitizeUser(savedUser));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Authenticates a user with email and password.
     * Strictly verifies that Lecturer and Admin accounts are APPROVED before granting access.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> payload) {
        String email = payload.getOrDefault("email", "").trim().toLowerCase();
        String password = payload.getOrDefault("password", "").trim();
        String expectedRole = payload.getOrDefault("role", "").trim().toLowerCase();

        Map<String, Object> response = new HashMap<>();

        if (email.isEmpty() || password.isEmpty()) {
            response.put("success", false);
            response.put("message", "Email and password are required.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "No account found with this email address. Please register first.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        User user = userOpt.get();

        // Check password strictly
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Incorrect password. Access denied.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Check Administrator Approval Status
        if ("PENDING".equalsIgnoreCase(user.getStatus())) {
            response.put("success", false);
            response.put("pendingApproval", true);
            response.put("message", "Account Pending Approval: Your " + user.getRole().toUpperCase() + 
                         " account is awaiting verification by the System Administrator. You cannot sign in until an Admin activates your profile.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if ("REJECTED".equalsIgnoreCase(user.getStatus())) {
            response.put("success", false);
            response.put("message", "Access Denied: Your registration request was rejected by the System Administrator.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        // Check role restriction if explicitly requested
        if (!expectedRole.isEmpty() && !user.getRole().equalsIgnoreCase(expectedRole) && !user.getRole().equalsIgnoreCase("admin")) {
            response.put("success", false);
            response.put("message", "Access Denied: This account is registered as a " + 
                         user.getRole().toUpperCase() + ". You cannot sign in to the " + 
                         expectedRole.toUpperCase() + " portal with this role.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        response.put("success", true);
        response.put("message", "Login successful. Welcome back, " + user.getName() + "!");
        response.put("user", sanitizeUser(user));

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/users
     * Retrieves all registered users for administration approval management.
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> sanitized = new ArrayList<>();
        for (User u : users) {
            sanitized.add(sanitizeUser(u));
        }
        return ResponseEntity.ok(sanitized);
    }

    /**
     * PUT /api/auth/users/{id}/approve
     * Administrator action to approve a pending lecturer or admin account.
     */
    @PutMapping("/users/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        User user = userOpt.get();
        user.setStatus("APPROVED");
        User updated = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Account for " + updated.getName() + " (" + updated.getRole().toUpperCase() + ") has been APPROVED successfully.");
        response.put("user", sanitizeUser(updated));
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/auth/users/{id}/reject
     * Administrator action to reject a pending lecturer or admin account.
     */
    @PutMapping("/users/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        User user = userOpt.get();
        user.setStatus("REJECTED");
        User updated = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Account registration for " + updated.getName() + " has been REJECTED.");
        response.put("user", sanitizeUser(updated));
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/reset-password
     * Allows resetting password by verifying email and registered student/staff identifier.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        String email = payload.get("email");
        String identifier = payload.get("identifier");
        String newPassword = payload.get("newPassword");

        if (email == null || email.trim().isEmpty() ||
            identifier == null || identifier.trim().isEmpty() ||
            newPassword == null || newPassword.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email, student/staff ID, and new password are all required.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "No account found matching this email address.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        User user = userOpt.get();
        if (user.getIdentifier() != null && !user.getIdentifier().trim().isEmpty() &&
            !user.getIdentifier().equalsIgnoreCase(identifier.trim())) {
            response.put("success", false);
            response.put("message", "Verification failed: Student / Staff ID does not match records for this email.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Password reset successful! You may now sign in with your new credentials.");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("identifier", user.getIdentifier());
        map.put("status", user.getStatus());
        map.put("createdAt", user.getCreatedAt());
        return map;
    }
}
