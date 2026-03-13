package com.nhom11.user;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveTask {

    // 600000 ms = 10 phút chạy một lần
    @Scheduled(fixedRate = 600000)
    public void keepAlive() {
        try {
            // Thay đổi link bên dưới cho đúng với domain Render của bạn
            String[] urls = {
                "https://backend-user-xxx.onrender.com", // Link của chính nó (User)
                "https://backend-admin-909u.onrender.com", // Link của Admin
                "https://nhom11ca2chieuthu4.onrender.com" // Ví dụ: Link Frontend User
            };

            RestTemplate restTemplate = new RestTemplate();
            for (String url : urls) {
                // Gửi request GET để kích hoạt server
                restTemplate.getForEntity(url, String.class);
                System.out.println(">>> [User-Service] Da ping de giu thuc: " + url);
            }
        } catch (Exception e) {
            // Log lỗi nếu ping thất bại (thường do server đang khởi động)
            System.err.println(">>> [User-Service] Ping chua thanh cong: " + e.getMessage());
        }
    }
}
