package com.atomix.simple;

import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import com.atomix.cafeteria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration.class,
    org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration.class,
    org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration.class
})
@EntityScan(basePackages = "com.atomix.cafeteria.entity")
@EnableJpaRepositories(basePackages = "com.atomix.cafeteria.repository")
@RestController
@CrossOrigin(origins = "*")
public class SimpleApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    public static void main(String[] args) {
        SpringApplication.run(SimpleApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Create sample data
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@atomix.com");
            admin.setPassword("adminpass123");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setFloorId("ALL");
            admin.setDepartment("IT");
            admin.setEmployeeId("EMP001");
            admin.setFoodCardBalance(1000.0);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            admin.setCreatedAt(java.time.LocalDateTime.now());
            admin.setUpdatedAt(java.time.LocalDateTime.now());

            User employee = new User();
            employee.setEmail("john.doe@atomix.com");
            employee.setPassword("johnpass123");
            employee.setFirstName("John");
            employee.setLastName("Doe");
            employee.setRole(UserRole.EMPLOYEE);
            employee.setFloorId("F1");
            employee.setDepartment("Engineering");
            employee.setEmployeeId("EMP002");
            employee.setFoodCardBalance(250.0);
            employee.setIsActive(true);
            employee.setEmailVerified(true);
            employee.setCreatedAt(java.time.LocalDateTime.now());
            employee.setUpdatedAt(java.time.LocalDateTime.now());

            userRepository.save(admin);
            userRepository.save(employee);
            
            System.out.println("✅ Sample data created: " + userRepository.count() + " users");
        }
    }

    @GetMapping("/api/v1/health")
    public String health() {
        return "✅ Simple Backend with H2 Database is running! Java " + System.getProperty("java.version");
    }

    @GetMapping("/api/v1/db-test")
    public String testDatabase() {
        try {
            long userCount = userRepository.count();
            return "✅ Database connected! User count: " + userCount;
        } catch (Exception e) {
            return "❌ Database error: " + e.getMessage();
        }
    }

    @GetMapping("/api/v1/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/api/v1/create-user")
    public String createUser(@RequestParam String email, @RequestParam String name) {
        try {
            User user = new User();
            user.setEmail(email);
            user.setPassword("userpass123");
            user.setFirstName(name);
            user.setLastName("User");
            user.setRole(UserRole.EMPLOYEE);
            user.setFloorId("F1");
            user.setDepartment("Test");
            user.setEmployeeId("TEST" + System.currentTimeMillis());
            user.setFoodCardBalance(100.0);
            user.setIsActive(true);
            user.setEmailVerified(true);
            user.setCreatedAt(java.time.LocalDateTime.now());
            user.setUpdatedAt(java.time.LocalDateTime.now());

            userRepository.save(user);
            return "✅ User created: " + email;
        } catch (Exception e) {
            return "❌ Error creating user: " + e.getMessage();
        }
    }

    // Simple login endpoint for testing
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
            
            if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
                // Create simple response
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "role", user.getRole().name()
                ));
                response.put("token", "simple-token-" + user.getId()); // Fake token for now
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid credentials"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Login error: " + e.getMessage()
            ));
        }
    }

    // Simple class for login request
    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
} 