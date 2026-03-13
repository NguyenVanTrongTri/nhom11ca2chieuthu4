package com.nhom11.user.controller;

import com.nhom11.user.model.User;
import com.nhom11.user.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users") 
@CrossOrigin(origins = "*") 
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    // Lấy tất cả users
    @GetMapping
    public List<User> getAll() { 
        return repository.findAll(); 
    }

    // Lấy user theo id
    @GetMapping("/{id}")
    public User getOne(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Thêm user
    @PostMapping
    public User add(@RequestBody User user) { 
        return repository.save(user); 
    }

    // Sửa user
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User newUser) {

        User user = repository.findById(id).orElse(null);

        if(user != null){
            user.setName(newUser.getName());
            return repository.save(user);
        }

        return null;
    }

    // Xóa user
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { 
        repository.deleteById(id); 
    }
}
