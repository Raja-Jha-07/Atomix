package com.atomix.cafeteria.config;

import com.atomix.cafeteria.entity.*;
import com.atomix.cafeteria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        loadSampleData();
    }

    private void loadSampleData() {
        if (userRepository.count() == 0) {
            // Create sample users
            User admin = new User();
            admin.setEmail("admin@atomix.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setFloorId("ALL");
            admin.setDepartment("IT");
            admin.setEmployeeId("EMP001");
            admin.setFoodCardBalance(1000.0);
            admin.setIsActive(true);
            admin.setEmailVerified(true);

            User employee1 = new User();
            employee1.setEmail("john.doe@atomix.com");
            employee1.setPassword(passwordEncoder.encode("password123"));
            employee1.setFirstName("John");
            employee1.setLastName("Doe");
            employee1.setRole(UserRole.EMPLOYEE);
            employee1.setFloorId("F1");
            employee1.setDepartment("Engineering");
            employee1.setEmployeeId("EMP002");
            employee1.setFoodCardBalance(250.0);
            employee1.setIsActive(true);
            employee1.setEmailVerified(true);

            User employee2 = new User();
            employee2.setEmail("jane.smith@atomix.com");
            employee2.setPassword(passwordEncoder.encode("password123"));
            employee2.setFirstName("Jane");
            employee2.setLastName("Smith");
            employee2.setRole(UserRole.EMPLOYEE);
            employee2.setFloorId("F2");
            employee2.setDepartment("HR");
            employee2.setEmployeeId("EMP003");
            employee2.setFoodCardBalance(300.0);
            employee2.setIsActive(true);
            employee2.setEmailVerified(true);

            User manager = new User();
            manager.setEmail("manager@atomix.com");
            manager.setPassword(passwordEncoder.encode("password123"));
            manager.setFirstName("Manager");
            manager.setLastName("Cafeteria");
            manager.setRole(UserRole.CAFETERIA_MANAGER);
            manager.setFloorId("ALL");
            manager.setDepartment("Cafeteria");
            manager.setEmployeeId("MGR001");
            manager.setFoodCardBalance(500.0);
            manager.setIsActive(true);
            manager.setEmailVerified(true);

            User vendor = new User();
            vendor.setEmail("vendor@atomix.com");
            vendor.setPassword(passwordEncoder.encode("password123"));
            vendor.setFirstName("Vendor");
            vendor.setLastName("Food");
            vendor.setRole(UserRole.VENDOR);
            vendor.setFloorId("F1");
            vendor.setDepartment("Food Services");
            vendor.setEmployeeId("VND001");
            vendor.setFoodCardBalance(0.0);
            vendor.setIsActive(true);
            vendor.setEmailVerified(true);

            // Save users
            userRepository.save(admin);
            userRepository.save(employee1);
            userRepository.save(employee2);
            userRepository.save(manager);
            userRepository.save(vendor);

            System.out.println("✅ Sample data loaded successfully!");
            System.out.println("👤 Admin: admin@atomix.com / password123");
            System.out.println("👤 Cafeteria Manager: manager@atomix.com / password123");
            System.out.println("👤 Employee 1: john.doe@atomix.com / password123");
            System.out.println("👤 Employee 2: jane.smith@atomix.com / password123");
            System.out.println("👤 Vendor: vendor@atomix.com / password123");
        }
    }
} 