package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import com.atomix.cafeteria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/health")
    public String health() {
        return "✅ Backend is healthy!";
    }

    @GetMapping("/db-test")
    public String testDatabase() {
        try {
            long userCount = userRepository.count();
            return "✅ Database connected! User count: " + userCount;
        } catch (Exception e) {
            return "❌ Database error: " + e.getMessage();
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/create-test-user")
    public String createTestUser() {
        try {
            User testUser = new User();
            testUser.setEmail("test@atomix.com");
            testUser.setPassword("test123");
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setRole(UserRole.EMPLOYEE);
            testUser.setFloorId("F1");
            testUser.setDepartment("Test");
            testUser.setEmployeeId("TEST001");
            testUser.setFoodCardBalance(100.0);
            testUser.setIsActive(true);
            testUser.setEmailVerified(true);

            userRepository.save(testUser);
            return "✅ Test user created successfully!";
        } catch (Exception e) {
            return "❌ Error creating user: " + e.getMessage();
        }
    }
} 