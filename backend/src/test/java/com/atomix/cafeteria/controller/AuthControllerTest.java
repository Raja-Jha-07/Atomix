package com.atomix.cafeteria.controller;

import com.atomix.cafeteria.config.TestConfig;
import com.atomix.cafeteria.MinimalApp;
import com.atomix.cafeteria.SimpleApp;
import com.atomix.cafeteria.SimpleTestApp;
import com.atomix.cafeteria.TestApplication;
import com.atomix.cafeteria.MinimalTestApp;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
@ComponentScan(
    basePackages = "com.atomix.cafeteria",
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
            MinimalApp.class,
            SimpleApp.class,
            SimpleTestApp.class,
            TestApplication.class,
            MinimalTestApp.class
        })
    }
)
class AuthControllerTest {

    @Test
    void testApplicationContextLoads() {
        // This test ensures that the Spring application context loads successfully
    }
} 