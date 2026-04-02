package com.nhom11.admin.service;

import com.nhom11.admin.model.User;
import com.nhom11.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired //kết nối repo
    private UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User update(Long id, User newUser) {
        User user = getById(id);

        if (user == null) {
            throw new RuntimeException("User không tồn tại");
        }

        user.setUsername(newUser.getUsernameValue());
        user.setEmail(newUser.getEmail());
        user.setFullName(newUser.getFullName());

        if (newUser.getRole() != null) {
            user.setRole(newUser.getRole().toUpperCase());
        }

        if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        }

        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống!");
        }
        if (userRepository.existsByUsername(user.getUsernameValue())) {
            throw new RuntimeException("Username đã tồn tại!");
        }
        // Mã hóa password trước khi lưu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Đặt role mặc định nếu chưa có
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

}
