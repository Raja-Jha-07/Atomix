package com.atomix.cafeteria.config;

import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import com.atomix.cafeteria.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }

    private void initializeDefaultUsers() {
        logger.info("Initializing default users...");

        // Create Admin User
        if (!userRepository.findByEmail("admin@atomix.com").isPresent()) {
            User admin = new User();
            admin.setEmail("admin@atomix.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setEmployeeId("ADMIN001");
            admin.setPhoneNumber("+1234567890");
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            admin.setFoodCardBalance(1000.0);
            userRepository.save(admin);
            logger.info("Created admin user: admin@atomix.com / admin123");
        }

        // Create Employee User
        if (!userRepository.findByEmail("employee@atomix.com").isPresent()) {
            User employee = new User();
            employee.setEmail("employee@atomix.com");
            employee.setPassword(passwordEncoder.encode("employee123"));
            employee.setFirstName("John");
            employee.setLastName("Doe");
            employee.setRole(UserRole.EMPLOYEE);
            employee.setEmployeeId("EMP001");
            employee.setPhoneNumber("+1234567891");
            employee.setDepartment("Engineering");
            employee.setFloorId("F1");
            employee.setIsActive(true);
            employee.setEmailVerified(true);
            employee.setFoodCardBalance(500.0);
            userRepository.save(employee);
            logger.info("Created employee user: employee@atomix.com / employee123");
        }

        // Create Vendor User
        if (!userRepository.findByEmail("vendor@atomix.com").isPresent()) {
            User vendor = new User();
            vendor.setEmail("vendor@atomix.com");
            vendor.setPassword(passwordEncoder.encode("vendor123"));
            vendor.setFirstName("Vendor");
            vendor.setLastName("Manager");
            vendor.setRole(UserRole.VENDOR);
            vendor.setEmployeeId("VEN001");
            vendor.setPhoneNumber("+1234567892");
            vendor.setDepartment("Food Services");
            vendor.setIsActive(true);
            vendor.setEmailVerified(true);
            vendor.setFoodCardBalance(0.0);
            userRepository.save(vendor);
            logger.info("Created vendor user: vendor@atomix.com / vendor123");
        }

        // Create Cafeteria Manager
        if (!userRepository.findByEmail("manager@atomix.com").isPresent()) {
            User manager = new User();
            manager.setEmail("manager@atomix.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setFirstName("Cafeteria");
            manager.setLastName("Manager");
            manager.setRole(UserRole.CAFETERIA_MANAGER);
            manager.setEmployeeId("MGR001");
            manager.setPhoneNumber("+1234567893");
            manager.setDepartment("Food Services");
            manager.setIsActive(true);
            manager.setEmailVerified(true);
            manager.setFoodCardBalance(0.0);
            userRepository.save(manager);
            logger.info("Created manager user: manager@atomix.com / manager123");
        }

        logger.info("Default users initialization completed!");
    }
} 