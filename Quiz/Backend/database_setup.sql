-- ========================================================
-- Online Quiz System - Database Initialization Script
-- Module: EC4307 Web Application Development Mini Project
-- ========================================================

-- Set root password to 'root' so Spring Boot connects automatically
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS online_quiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE online_quiz_db;

-- 2. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    category_label VARCHAR(100),
    time_limit INT DEFAULT 5,
    difficulty VARCHAR(50) DEFAULT 'Medium'
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option VARCHAR(2) NOT NULL,
    explanation TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 4. Quiz Results / Submissions Table
CREATE TABLE IF NOT EXISTS quiz_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(100),
    quiz_id BIGINT,
    quiz_title VARCHAR(255),
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage INT NOT NULL,
    time_taken_seconds INT,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insert Initial Sample Quizzes
INSERT INTO quizzes (id, title, description, category, category_label, time_limit, difficulty) VALUES
(1, 'Web Development Basics', 'Test your foundational knowledge on HTML5, CSS3, and JavaScript modern syntax.', 'web', 'Web Dev', 5, 'Easy'),
(2, 'Java & Object-Oriented Programming', 'Master classes, inheritance, polymorphism, encapsulation, and Java 17 features.', 'java', 'Java / OOP', 7, 'Medium'),
(3, 'Database & SQL Fundamentals', 'Assess relational database schemas, JOINs, primary/foreign keys, and JPA concepts.', 'db', 'Database', 6, 'Medium')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Insert Initial Questions
INSERT INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(101, 1, 'What does HTML stand for in modern web technology?', 'Hyper Tool Modern Language', 'HyperText Markup Language', 'High Texture Machine Language', 'Hyperlink Transfer Mark Logic', 'B', 'HTML stands for HyperText Markup Language, the standard markup language for documents designed to be displayed in a web browser.'),
(102, 1, 'Which CSS property is used to create space INSIDE the border of an element?', 'margin', 'border-spacing', 'padding', 'outline', 'C', 'The padding property sets the inner space between the element content and its border.'),
(103, 1, 'Which JavaScript method is used to make asynchronous HTTP requests to a REST API?', 'fetch()', 'http.get()', 'request.send()', 'asyncCall()', 'A', 'The fetch() API provides a modern JavaScript interface for accessing and manipulating HTTP pipeline requests and responses.'),
(104, 1, 'Which HTTP method is typically used to retrieve data from a RESTful API?', 'POST', 'PUT', 'DELETE', 'GET', 'D', 'GET requests are safe and idempotent methods used in REST to fetch/retrieve resources from a server.'),

(201, 2, 'Which principle of OOP is demonstrated by hiding internal implementation details and exposing only public methods?', 'Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction', 'B', 'Encapsulation is the bundling of data with the methods that operate on that data, restricting direct access to some components.'),
(202, 2, 'What is the default port for a Spring Boot web application embedded Tomcat server?', '3000', '8000', '8080', '5000', 'C', 'Spring Boot starts embedded Tomcat server on port 8080 by default.'),
(203, 2, 'Which Spring annotation is used to create a RESTful web controller that returns JSON directly?', '@Controller', '@RestController', '@Service', '@Component', 'B', '@RestController is a convenience annotation that combines @Controller and @ResponseBody, serializing return values directly to JSON.'),

(301, 3, 'Which SQL command is used to retrieve data from a database table?', 'EXTRACT', 'GET', 'SELECT', 'PULL', 'C', 'The SELECT statement is used to select and query data from a database.'),
(302, 3, 'Which key uniquely identifies each record in a relational database table?', 'Foreign Key', 'Composite Key', 'Primary Key', 'Index Key', 'C', 'A Primary Key column or set of columns uniquely identifies every single row in a table.')
ON DUPLICATE KEY UPDATE question_text=VALUES(question_text);

-- 7. Insert Initial Sample Submissions
INSERT INTO quiz_results (id, student_name, student_id, quiz_id, quiz_title, score, total_questions, percentage, time_taken_seconds, attempted_at) VALUES
(1, 'Kamal Perera', 'EG/2021/1001', 1, 'Web Development Basics', 4, 4, 100, 145, '2026-10-09 10:15:00'),
(2, 'Nimal Silva', 'EG/2021/1042', 2, 'Java & Object-Oriented Programming', 2, 3, 67, 210, '2026-10-08 14:30:00'),
(3, 'Kasun Wickramasinghe', 'EG/2021/1090', 3, 'Database & SQL Fundamentals', 2, 2, 100, 115, '2026-10-07 16:45:00')
ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);
