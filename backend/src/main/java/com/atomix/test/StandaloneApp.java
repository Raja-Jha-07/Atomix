package com.atomix.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class,
    MongoDataAutoConfiguration.class,
    MongoAutoConfiguration.class,
    SecurityAutoConfiguration.class,
    OAuth2ClientAutoConfiguration.class
})
@RestController
@CrossOrigin(origins = "*")
public class StandaloneApp {

    public static void main(String[] args) {
        SpringApplication.run(StandaloneApp.class, args);
    }
    
    @GetMapping("/test")
    public String test() {
        return "🎉 Atomix Backend Test is working! Java " + System.getProperty("java.version");
    }
    
    @GetMapping("/health")
    public String health() {
        return "✅ Standalone App OK - " + java.time.LocalDateTime.now();
    }
    
    @GetMapping("/")
    public String home() {
        return "Welcome to Atomix Cafeteria Backend - Standalone Test";
    }
} 