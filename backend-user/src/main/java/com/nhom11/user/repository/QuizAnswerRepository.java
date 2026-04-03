package com.nhom11.user.repository;

import com.nhom11.user.model.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {

    List<QuizAnswer> findByHistory_HistoryId(Long historyId);

}