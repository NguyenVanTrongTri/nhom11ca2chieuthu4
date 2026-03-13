package com.nhom11.admin;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveTask {

    // 600000 ms = 10 phút chạy một lần
    @Scheduled(fixedRate = 600000)
    public void keepAlive() {
        try {
            // Danh sách các link cần giữ thức (Bạn hãy thay link User cho đúng)
            String[] urls = {
                "https://backend-admin-909u.onrender.com",
                "https://backend-user-xxx.onrender.com" // THAY LINK BACKEND USER CỦA NHÓM VÀO ĐÂY
            };

            RestTemplate restTemplate = new RestTemplate();
            for (String url : urls) {
                // Gửi request GET đơn giản để server không ngủ
                restTemplate.getForEntity(url, String.class);
                System.out.println(">>> [System] Dang giu thuc cho: " + url);
            }
        } catch (Exception e) {
            // Log lỗi nhẹ nếu server chưa kịp phản hồi
            System.out.println(">>> [System] Ping tam thoi chua thanh cong: " + e.getMessage());
        }
    }
}
