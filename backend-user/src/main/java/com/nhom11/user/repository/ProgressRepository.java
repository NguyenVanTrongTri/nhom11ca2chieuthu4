package com.nhom11.user.repository;

import com.nhom11.user.model.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProgressRepository extends JpaRepository<LearningProgress, Long> {
    // Đếm số từ đã học của 1 User
    @Query("SELECT COUNT(lp) FROM LearningProgress lp WHERE lp.user.userId = :userId AND lp.is_learned = 1")
    long countLearnedWords(@Param("userId") Long userId);

    List<LearningProgress> findByUser_UserId(Long userId);
}