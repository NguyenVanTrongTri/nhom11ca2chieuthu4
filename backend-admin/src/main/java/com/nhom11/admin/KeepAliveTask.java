package com.nhom11.admin;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.HttpURLConnection;
import java.net.URL;

@Component
public class KeepAliveTask {

    @Scheduled(fixedRate = 600000) // 10 phút
    public void keepAlive() {

        try {

            URL url = new URL("https://backend-admin-909u.onrender.com");

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            int responseCode = conn.getResponseCode();

            System.out.println("Ping Render OK: " + responseCode);

        } catch (Exception e) {

            System.out.println("Ping failed");

        }
    }
}
