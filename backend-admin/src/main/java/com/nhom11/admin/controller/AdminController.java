package com.nhom11.admin.controller;

import com.nhom11.admin.model.User;
import com.nhom11.admin.repository.UserRepository;
import com.nhom11.admin.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users") 
@CrossOrigin(origins = "*")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    // GET ALL
    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public User getOne(@PathVariable Long id) {
        return userService.getById(id);
    }

    // CREATE
    @PostMapping
    public User add(@RequestBody User user) {
        return userService.create(user);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
