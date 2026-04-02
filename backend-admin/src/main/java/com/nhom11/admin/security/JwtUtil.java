package com.nhom11.admin.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET = "mysecretkeymysecretkeymysecretkey"; // >= 32 ký tự
    private final long EXPIRATION = 1000 * 60 * 60 * 24*7; // 7 ngày
    //CHU KI
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // TẠO TOKEN
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // LẤY EMAIL TỪ TOKEN
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    //  VALID TOKEN XAC THUC
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    //Parser là thành phần dùng để giải mã và kiểm tra token.
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()) //KIEM TRA CHU KI
                .build()
                .parseClaimsJws(token)
                .getBody();   // lấy phần payload (claims)
    }
}
