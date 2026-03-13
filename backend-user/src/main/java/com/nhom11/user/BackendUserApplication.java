package com.nhom11.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; 

@SpringBootApplication
@EnableScheduling
public class BackendUserApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendUserApplication.class, args);
    }
}
