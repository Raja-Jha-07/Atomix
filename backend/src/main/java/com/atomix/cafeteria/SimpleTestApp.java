package com.atomix.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class,
    MongoDataAutoConfiguration.class,
    MongoAutoConfiguration.class,
    SecurityAutoConfiguration.class
})
@RestController
@CrossOrigin(origins = "*")
public class SimpleTestApp {

    public static void main(String[] args) {
        SpringApplication.run(SimpleTestApp.class, args);
    }
    
    @GetMapping("/api/v1/test")
    public String test() {
        return "🎉 Atomix Backend is working! Java " + System.getProperty("java.version");
    }
    
    @GetMapping("/api/v1/health")
    public String health() {
        return "✅ OK - " + java.time.LocalDateTime.now();
    }
} 