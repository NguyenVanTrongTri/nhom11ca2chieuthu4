package com.nhom11.user;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveTask {

    @Scheduled(fixedRate = 600000) // 10 phút
    public void keepAlive() {

        String[] urls = {

            "https://backend-user-lq25.onrender.com/users", // backend user

            "https://backend-admin-909u.onrender.com/users", // backend admin

            "https://nhom11ca2chieuthu4.onrender.com" // frontend
        };

        RestTemplate restTemplate = new RestTemplate();

        for (String url : urls) {
            try {

                restTemplate.getForEntity(url, String.class);

                System.out.println(">>> [User-Service] Da ping de giu thuc: " + url);

            } catch (Exception e) {

                System.err.println(">>> [User-Service] Ping that bai: " + url);

            }
        }
    }
}
