package com.nhom11.admin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vocabularies")
@Data
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vocabularyId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    // NGẮT VÒNG LẶP: Cho phép lấy thông tin Category nhưng không lấy ngược lại list vocab
    @JsonIgnoreProperties("vocabularies")
    private Category category;

    @Column(nullable = false, length = 100)
    private String word;

    private String wordType; // noun, verb, adj...
    private String phonetic;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String meaning;

    @Column(columnDefinition = "TEXT")
    private String example;

    private String imageUrl;

    // THÊM: Để Dashboard có thể sắp xếp chính xác từ mới nhất
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // QUAN TRỌNG: Ngắt hiển thị danh sách phụ để tránh Infinite Recursion và StackOverflow
    @OneToMany(mappedBy = "vocabulary", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<LearningProgress> learningProgresses;

    @OneToMany(mappedBy = "vocabulary", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Quiz> quizzes;
}
