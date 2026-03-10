package com.nhom11.user.controller;

import com.nhom11.user.model.User;
import com.nhom11.user.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<User> getAll() { return repository.findAll(); }

    @PostMapping
    public User add(@RequestBody User user) { return repository.save(user); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
