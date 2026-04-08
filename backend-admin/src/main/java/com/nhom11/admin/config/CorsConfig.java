package com.nhom11.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Cho phép cả 2 frontend truy cập để admin và user có thể tương tác chéo nếu cần
        configuration.setAllowedOrigins(Arrays.asList(
            "https://frontend-admin-jctj.onrender.com", 
            "https://frontend-user-getq.onrender.com",
            "http://localhost:3000",   // Giữ lại để debug local
            "http://127.0.0.1:5500"
        ));
        
        // Cho phép đầy đủ các phương thức để Admin thao tác CRUD
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Các header cần thiết cho JWT
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Accept"));
        
        // Quan trọng: cho phép gửi kèm thông tin xác thực
        configuration.setAllowCredentials(true);
        
        // Expose header để Frontend có thể lấy được Token từ Header nếu bạn gửi về qua đường này
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return new CorsFilter(source);
    }
}
