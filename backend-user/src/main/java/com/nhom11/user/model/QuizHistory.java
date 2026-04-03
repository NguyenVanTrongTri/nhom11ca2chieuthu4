package com.nhom11.user.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quiz_history")
@Data
public class QuizHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private VocabCategory category;

    private int totalQuestions;
    private int correctAnswers;
    private double score;
    private int timeSpentSeconds;

    private LocalDateTime completedAt = LocalDateTime.now();


    @OneToMany(mappedBy = "history", fetch = FetchType.LAZY)
    @JsonManagedReference // tránh vòng lặp vô hạn khi gán danh sách các answer khi lưu để không null
    private List<QuizAnswer> answers;
}