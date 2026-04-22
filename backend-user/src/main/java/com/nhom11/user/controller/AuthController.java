package com.nhom11.user.controller;

import com.nhom11.user.model.User;
import com.nhom11.user.security.JwtUtil;
import com.nhom11.user.service.UserService;
import org.apache.catalina.Authenticator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    //xử lý logic đăng ký, lưu user vào database.
    private final UserService userService;
    //dùng để xác thực email + password.
    private final AuthenticationManager authenticationManager;
    //tạo và quản lý JWT token.
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {

        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            // Không trả password về cho client
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    // API Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            //gọi CustomUserDetailsService.loadUserByUsername(email) để lấy user.
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            //Lấy ra object User từ Authentication.
            //getPrincipal() chính là user details mà CustomUserDetailsService đã trả về.
            User user = (User) authentication.getPrincipal();

            //  TẠO TOKEN
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Email hoặc mật khẩu không đúng!"
            ));
        }
    }

}
