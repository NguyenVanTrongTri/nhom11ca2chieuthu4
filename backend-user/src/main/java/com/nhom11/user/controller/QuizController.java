package com.nhom11.user.controller;

import com.nhom11.user.dto.*;
import com.nhom11.user.model.QuizHistory;
import com.nhom11.user.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/quiz")
@CrossOrigin("*")
public class QuizController {

    @Autowired
    private QuizService quizService;
    @GetMapping("/{categoryId}")
    public List<QuizResponse> getQuiz(@PathVariable Long categoryId) {
        return quizService.getQuiz(categoryId);
    }
    @PostMapping("/submit")
    public QuizHistory submit(@RequestBody QuizSubmitRequest request) {
        return quizService.submitQuiz(request);
    }
}