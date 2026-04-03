package com.nhom11.user.repository;

import com.nhom11.user.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByVocabulary_Category_CategoryId(Long categoryId);

}