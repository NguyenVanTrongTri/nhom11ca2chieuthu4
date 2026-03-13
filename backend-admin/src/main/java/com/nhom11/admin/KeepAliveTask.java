package com.nhom11.admin;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveTask {

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 600000) // 10 phút
    public void keepAlive() {

        String[] urls = {

            "https://backend-admin-909u.onrender.com/ping",
            "https://nhom11ca2chieuthu4.onrender.com"
        };

        for (String url : urls) {
            try {

                restTemplate.getForEntity(url, String.class);

                System.out.println(">>> [Admin-Service] Ping OK: " + url);

            } catch (Exception e) {

                System.err.println(">>> [Admin-Service] Ping that bai: " + url);
            }
        }
    }
}
