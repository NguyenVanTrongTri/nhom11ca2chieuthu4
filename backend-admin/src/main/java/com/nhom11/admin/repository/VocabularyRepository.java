package com.nhom11.admin.repository;

import com.nhom11.admin.model.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    List<Vocabulary> findByCategory_CategoryId(Long categoryId);
}
