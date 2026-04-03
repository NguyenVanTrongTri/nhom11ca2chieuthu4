package com.nhom11.admin.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "vocabularies")
@Data
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vocabularyId;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String word;

    private String wordType;
    private String phonetic;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String meaning;

    @Column(columnDefinition = "TEXT")
    private String example;

    private String imageUrl;
    // QUAN TRỌNG: Tự động xóa các bản ghi liên quan ở bảng khác khi xóa từ vựng này
    @OneToMany(mappedBy = "vocabulary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LearningProgress> learningProgresses;

    @OneToMany(mappedBy = "vocabulary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes;
}
