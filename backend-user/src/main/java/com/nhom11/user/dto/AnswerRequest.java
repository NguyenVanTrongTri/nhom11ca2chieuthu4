package com.nhom11.user.dto;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long quizId;
    private String selectedOption;
}