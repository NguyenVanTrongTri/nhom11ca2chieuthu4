package com.nhom11.admin;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveTask {

    @Scheduled(fixedRate = 600000) // 10 phút
    public void keepAlive() {

        String[] urls = {

            "https://backend-admin-0e0j.onrender.com",
            "https://nhom11ca2chieuthu4.onrender.com"
        };

        RestTemplate restTemplate = new RestTemplate();

        for (String url : urls) {
            try {

                restTemplate.getForEntity(url, String.class);

                System.out.println(">>> [Admin-Service] Da ping de giu thuc: " + url);

            } catch (Exception e) {

                System.err.println(">>> [Admin-Service] Ping that bai: " + url);

            }
        }
    }
}
