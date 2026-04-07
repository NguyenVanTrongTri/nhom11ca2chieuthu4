package com.nhom11.user.controller;

import com.nhom11.user.model.QuizHistory;
import com.nhom11.user.model.User;
import com.nhom11.user.repository.ProgressRepository;
import com.nhom11.user.repository.UserRepository;
import com.nhom11.user.repository.QuizHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/progress")
@CrossOrigin("*")
public class ProgressController {

    @Autowired private ProgressRepository progressRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private QuizHistoryRepository quizHistoryRepository;

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        // 1. Lấy email từ Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);

        if (user == null) return ResponseEntity.status(404).body("User not found");

        // 2. Đếm số từ đã học
        long wordsLearned = progressRepository.countLearnedWords(user.getUserId());

        // 3. TỰ TÍNH TỔNG CÂU ĐÚNG (
        // Lấy tất cả lịch sử làm bài của User
        List<QuizHistory> historyList = quizHistoryRepository.findAll();

        int totalCorrect = historyList.stream()
                .filter(h -> h.getUser() != null && h.getUser().getUserId().equals(user.getUserId()))
                .mapToInt(h -> h.getCorrectAnswers())
                .sum();

        // 4. Trả về kết quả
        Map<String, Object> response = new HashMap<>();
        response.put("wordsLearned", wordsLearned);
        response.put("correctAnswers", totalCorrect);

        return ResponseEntity.ok(response);
    }
}