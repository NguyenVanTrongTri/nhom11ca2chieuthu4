package com.nhom11.admin.service;

import com.nhom11.admin.model.User;
import com.nhom11.admin.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    // Thêm PasswordEncoder để mã hóa mật khẩu cứng
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        
        if ("admin@nhom11.com".equals(email)) {
            User admin = new User();
            admin.setEmail("adminnhom11@gmail.com");
            // Mật khẩu là '123456', phải mã hóa vì Spring Security so sánh dạng Bcrypt
            admin.setPassword(passwordEncoder.encode("123456")); 
            admin.setRole("ADMIN"); 
            admin.setFullName("Quản Trị Viên Hệ Thống");
            return admin;
        }

       
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email);
        }
        return user;
    }
}
