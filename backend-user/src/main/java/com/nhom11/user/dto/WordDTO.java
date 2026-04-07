package com.nhom11.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WordDTO {
    private Long vocabularyId;
    private String word;
    private String wordType;
    private String phonetic;
    private String meaning;
    private String example;
    private String imageUrl;
    
    // Chỉ lấy tên hoặc ID của Category để tránh load cả Object nặng
    private Long categoryId;
    private String categoryName;
}