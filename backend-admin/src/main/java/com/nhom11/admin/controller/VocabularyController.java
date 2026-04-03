package com.nhom11.admin.controller;

import com.nhom11.admin.model.Vocabulary;
import com.nhom11.admin.repository.VocabularyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/vocabulary")
@CrossOrigin(origins = "*")
public class VocabularyController {
    @Autowired
    private VocabularyRepository vocabularyRepository;

    @GetMapping
    public ResponseEntity<List<Vocabulary>> getAll() {
        return ResponseEntity.ok(vocabularyRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Vocabulary> create(@RequestBody Vocabulary vocabulary) {
        try {
            Vocabulary saved = vocabularyRepository.save(vocabulary);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Vocabulary> update(@PathVariable Long id,
                                             @RequestBody Vocabulary details) {

        return vocabularyRepository.findById(id)
                .map(vocab -> {

                    // ⚠️ tránh null gây lỗi
                    if (details.getWord() != null)
                        vocab.setWord(details.getWord());

                    if (details.getMeaning() != null)
                        vocab.setMeaning(details.getMeaning());

                    if (details.getExample() != null)
                        vocab.setExample(details.getExample());

                    if (details.getPhonetic() != null)
                        vocab.setPhonetic(details.getPhonetic());

                    if (details.getWordType() != null)
                        vocab.setWordType(details.getWordType());

                    if (details.getImageUrl() != null)
                        vocab.setImageUrl(details.getImageUrl());

                    if (details.getCategory() != null)
                        vocab.setCategory(details.getCategory());

                    Vocabulary updated = vocabularyRepository.save(vocab);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!vocabularyRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Không tìm thấy từ vựng ID: " + id);
        }
        try {
            vocabularyRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa thành công từ vựng ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi xóa dữ liệu: " + e.getMessage());
        }
    }
}
