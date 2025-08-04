package com.atomix.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// @SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@RestController
public class MinimalApp {

    public static void main(String[] args) {
        SpringApplication.run(MinimalApp.class, args);
    }
    
    @GetMapping("/api/v1/test")
    public String test() {
        return "Atomix Backend is working!";
    }
}
