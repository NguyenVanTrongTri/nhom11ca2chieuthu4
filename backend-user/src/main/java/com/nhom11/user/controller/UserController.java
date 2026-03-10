package com.nhom11.user.controller;

import com.nhom11.user.model.User;
import com.nhom11.user.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") 
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    // Phía người dùng thường chỉ cần xem danh sách hoặc đăng ký
    @GetMapping
    public List<User> getAll() { return repository.findAll(); }

    @PostMapping("/register") // Đổi tên cho chuyên nghiệp hơn
    public User add(@RequestBody User user) { return repository.save(user); }
    
    // Thường User không có quyền xóa chính mình hoặc người khác theo cách này 
    // nhưng nếu đồ án yêu cầu thì bạn cứ giữ nguyên hàm delete.
}
