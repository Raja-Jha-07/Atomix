package com.atomix.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication(exclude = {
    MongoDataAutoConfiguration.class,
    MongoAutoConfiguration.class
})
@EnableJpaRepositories(basePackages = "com.atomix.cafeteria.repository")
@RestController
@CrossOrigin(origins = "*")
public class CafeteriaApplication {

    public static void main(String[] args) {
        // Set system properties for Java 24 compatibility
        System.setProperty("java.awt.headless", "true");
        System.setProperty("spring.main.lazy-initialization", "true");
        
        SpringApplication app = new SpringApplication(CafeteriaApplication.class);
        app.setLogStartupInfo(true);
        app.run(args);
    }
    
    @GetMapping("/api/v1/test")
    public String test() {
        return "🎉 Atomix Backend is running with Java 24! Port: 8081";
    }
    
    @GetMapping("/api/v1/health")
    public String health() {
        return "✅ OK - Java " + System.getProperty("java.version");
    }
    
    @GetMapping("/api/v1/info")
    public String info() {
        return String.format("Java Version: %s | OS: %s | Available Processors: %d", 
            System.getProperty("java.version"),
            System.getProperty("os.name"),
            Runtime.getRuntime().availableProcessors());
    }
} 