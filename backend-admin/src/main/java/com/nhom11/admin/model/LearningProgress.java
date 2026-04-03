package com.nhom11.admin.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "learning_progress")
public class LearningProgress {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "vocabulary_id")
    @OnDelete(action = OnDeleteAction.CASCADE) // Quan trọng để xóa được
    private Vocabulary vocabulary;

    private Boolean is_learned;
    private java.time.LocalDateTime last_viewed;
}
