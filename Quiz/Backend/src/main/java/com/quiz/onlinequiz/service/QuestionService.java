package com.quiz.onlinequiz.service;

import com.quiz.onlinequiz.model.Question;
import com.quiz.onlinequiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Question business logic.
 * Sits between QuestionController and QuestionRepository,
 * encapsulating all data-access operations for Question entities.
 */
@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Retrieves all questions from the database.
     *
     * @return list of all Question entities
     */
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /**
     * Finds a single question by its primary key.
     *
     * @param id the question ID
     * @return an Optional containing the question if found, or empty if not
     */
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    /**
     * Persists a new question to the database.
     *
     * @param question the Question entity to save
     * @return the saved Question entity (with generated ID populated)
     */
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    /**
     * Partially updates an existing question (patch semantics).
     * Only fields that are non-null in the {@code updated} object are applied;
     * existing values are preserved for any null fields.
     *
     * @param id      the ID of the question to update
     * @param updated a Question object carrying the fields to overwrite
     * @return an Optional with the saved Question if found, or empty if the ID does not exist
     */
    public Optional<Question> updateQuestion(Long id, Question updated) {
        return questionRepository.findById(id).map(existing -> {
            if (updated.getQuestionText() != null)  existing.setQuestionText(updated.getQuestionText());
            if (updated.getOptionA() != null)        existing.setOptionA(updated.getOptionA());
            if (updated.getOptionB() != null)        existing.setOptionB(updated.getOptionB());
            if (updated.getOptionC() != null)        existing.setOptionC(updated.getOptionC());
            if (updated.getOptionD() != null)        existing.setOptionD(updated.getOptionD());
            if (updated.getCorrectOption() != null)  existing.setCorrectOption(updated.getCorrectOption());
            if (updated.getExplanation() != null)    existing.setExplanation(updated.getExplanation());
            return questionRepository.save(existing);
        });
    }

    /**
     * Deletes a question by ID.
     *
     * @param id the ID of the question to delete
     * @return {@code true} if the question existed and was deleted,
     *         {@code false} if no question with that ID was found
     */
    public boolean deleteQuestion(Long id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
