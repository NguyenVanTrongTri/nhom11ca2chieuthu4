package com.nhom11.user.dto;

import lombok.Data;

@Data
public class QuizResponse {
    private Long quizId;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
}