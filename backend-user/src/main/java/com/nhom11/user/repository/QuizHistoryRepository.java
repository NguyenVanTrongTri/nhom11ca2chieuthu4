package com.nhom11.user.repository;

import com.nhom11.user.model.QuizHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizHistoryRepository extends JpaRepository<QuizHistory, Long> {
    List<QuizHistory> findByUser_UserId(Long userId);


    List<QuizHistory> findByUser_UserIdAndCategory_CategoryId(Long userId, Long categoryId);
}