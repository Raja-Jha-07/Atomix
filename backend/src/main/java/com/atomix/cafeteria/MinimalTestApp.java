package com.atomix.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// @SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@RestController
public class MinimalTestApp {

    public static void main(String[] args) {
        SpringApplication.run(MinimalTestApp.class, args);
    }
    
    @GetMapping("/api/v1/minimal")
    public String test() {
        return "✅ Minimal app running!";
    }
} 