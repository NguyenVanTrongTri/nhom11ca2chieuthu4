package com.nhom11.user.controller;

import com.nhom11.user.model.User;
import com.nhom11.user.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users") // Chỉnh từ /api/users thành /users theo yêu cầu giảng viên
@CrossOrigin(origins = "*") 
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    // Đáp ứng: BASE_API/users -> trả về tất cả users
    @GetMapping
    public List<User> getAll() { 
        return repository.findAll(); 
    }

    // ĐÁP ỨNG THÊM: BASE_API/users/1 -> trả về user có id=1
    @GetMapping("/{id}")
    public User getOne(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Cho phép thêm user (CRUD - Create)
    @PostMapping
    public User add(@RequestBody User user) { 
        return repository.save(user); 
    }

    // Cho phép xóa user (CRUD - Delete)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { 
        repository.deleteById(id); 
    }
}
