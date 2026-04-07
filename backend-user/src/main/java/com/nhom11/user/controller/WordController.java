package com.nhom11.user.controller;

import com.nhom11.user.dto.WordDTO;
import com.nhom11.user.model.Word;
import com.nhom11.user.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/words")
@CrossOrigin("*")
public class WordController {

    @Autowired
    private WordRepository wordRepository;

    private WordDTO convertToDto(Word word) {
        WordDTO dto = new WordDTO();
        dto.setVocabularyId(word.getVocabularyId());
        dto.setWord(word.getWord());
        dto.setWordType(word.getWordType());
        dto.setPhonetic(word.getPhonetic());
        dto.setMeaning(word.getMeaning());
        dto.setExample(word.getExample());
        dto.setImageUrl(word.getImageUrl());
        if (word.getCategory() != null) {
            dto.setCategoryId(word.getCategory().getCategoryId());
            dto.setCategoryName(word.getCategory().getCategoryName());
        }
        return dto;
    }

    // 1. Xem danh sách từ vựng
    @GetMapping
    public ResponseEntity<List<WordDTO>> getAllWords() {
        List<WordDTO> words = wordRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(words);
    }

    // 2. Xem chi tiết (Nghĩa và ví dụ)
    @GetMapping("/{id}")
    public ResponseEntity<WordDTO> getWordById(@PathVariable Long id) {
        return wordRepository.findById(id)
                .map(word -> ResponseEntity.ok(convertToDto(word)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Học theo chủ đề (Lọc theo Category ID)
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<WordDTO>> getWordsByCategory(@PathVariable Long categoryId) {
        List<WordDTO> words = wordRepository.findByCategory_CategoryId(categoryId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(words);
    }

    // 4. Tìm kiếm từ vựng (Tìm theo cả word và meaning)
    @GetMapping("/search")
    public ResponseEntity<List<WordDTO>> searchWords(@RequestParam("query") String query) {
        // Truyền tham số query vào cả 2 vị trí để tìm ở cả cột tiếng Anh và cột Nghĩa
        List<WordDTO> words = wordRepository.findByWordContainingIgnoreCaseOrMeaningContainingIgnoreCase(query, query)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(words);
    }
}