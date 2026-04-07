package com.nhom11.user.repository;

import com.nhom11.user.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findByCategory_CategoryId(Long categoryId);

    // Tìm kiếm không phân biệt hoa thường trong cột 'word'
    List<Word> findByWordContainingIgnoreCase(String word);

    // Nếu bạn muốn tìm cả trong 'word' và 'meaning'
    List<Word> findByWordContainingIgnoreCaseOrMeaningContainingIgnoreCase(String word, String meaning);
}