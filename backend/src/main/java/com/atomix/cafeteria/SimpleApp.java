package com.atomix.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

// @SpringBootApplication(exclude = {
//     MongoDataAutoConfiguration.class,
//     MongoAutoConfiguration.class,
//     SecurityAutoConfiguration.class
// })
@RestController
@CrossOrigin(origins = "*")
public class SimpleApp {

    public static void main(String[] args) {
        SpringApplication.run(SimpleApp.class, args);
    }
    
    @GetMapping("/api/v1/health")
    public String health() {
        return "✅ Simple Backend is running! Java " + System.getProperty("java.version");
    }
    
    @GetMapping("/api/v1/info")
    public String info() {
        return String.format("Java Version: %s | OS: %s | Available Processors: %d", 
            System.getProperty("java.version"),
            System.getProperty("os.name"),
            Runtime.getRuntime().availableProcessors());
    }
} 