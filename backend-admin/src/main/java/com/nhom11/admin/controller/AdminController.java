package com.nhom11.admin.controller;

import com.nhom11.admin.model.User;
import com.nhom11.admin.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class AdminController {
    private final UserRepository repository;

    public AdminController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<User> getAll() { return repository.findAll(); }

    @PostMapping
    public User add(@RequestBody User user) { return repository.save(user); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
