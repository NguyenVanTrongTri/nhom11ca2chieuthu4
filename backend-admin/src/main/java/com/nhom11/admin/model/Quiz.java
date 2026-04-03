package com.nhom11.admin.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quiz_id;

    private String question;
    private String option_a;
    private String option_b;
    private String option_c;
    private String option_d;
    private String correct_option;

    @ManyToOne
    @JoinColumn(name = "vocabulary_id")
    @OnDelete(action = OnDeleteAction.CASCADE) // QUAN TRỌNG: Xóa từ vựng là xóa luôn câu hỏi Quiz
    private Vocabulary vocabulary;
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAnswer> quizAnswers;
}
