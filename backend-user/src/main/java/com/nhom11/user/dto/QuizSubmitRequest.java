package com.nhom11.user.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizSubmitRequest {
    private Long userId;
    private Long categoryId;
    private List<AnswerRequest> answers;
}