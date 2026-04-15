package com.nhom11.admin.controller;

import com.nhom11.admin.model.User;
import com.nhom11.admin.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users") 
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
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

    @PutMapping("/me")
    public User updateMe(@RequestBody User user, Authentication auth) {
        User currentUser = (User) auth.getPrincipal();
        return userService.update(currentUser.getUserId(), user);
    }
}

