package com.nhom11.user.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Embeddable
class LearningProgressId implements Serializable {
    private Long user_id;
    private Long vocabulary_id;
}

@Entity
@Table(name = "learning_progress")
@Data
public class LearningProgress {
    @EmbeddedId
    private LearningProgressId id;

    @ManyToOne
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("vocabulary_id")
    @JoinColumn(name = "vocabulary_id")
    private Word vocabulary;

    private int is_learned; // 1 là đã thuộc, 0 là chưa
    private LocalDateTime last_viewed = LocalDateTime.now();
}