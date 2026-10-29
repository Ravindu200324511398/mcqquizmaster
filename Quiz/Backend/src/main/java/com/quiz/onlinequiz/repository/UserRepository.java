package com.quiz.onlinequiz.repository;

import com.quiz.onlinequiz.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByEmailIgnoreCaseAndRole(String email, String role);

    boolean existsByEmailIgnoreCase(String email);
}
