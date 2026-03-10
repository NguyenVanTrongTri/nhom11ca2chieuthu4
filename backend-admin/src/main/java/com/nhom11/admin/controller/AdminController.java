package com.nhom11.admin.controller;

import com.nhom11.admin.model.User;
import com.nhom11.admin.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users") 
@CrossOrigin(origins = "*")
public class AdminController {
    private final UserRepository repository;

    public AdminController(UserRepository repository) {
        this.repository = repository;
    }

    // BASE_API/users -> Lấy danh sách tất cả users (Yêu cầu Read - R)
    @GetMapping
    public List<User> getAll() { 
        return repository.findAll(); 
    }

    // BASE_API/users/1 -> Lấy user theo ID (Yêu cầu bắt buộc trong ảnh)
    @GetMapping("/{id}")
    public User getOne(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // CRUD: Thêm mới user
    @PostMapping
    public User add(@RequestBody User user) { 
        return repository.save(user); 
    }

    // CRUD: Xóa user
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { 
        repository.deleteById(id); 
    }
}
