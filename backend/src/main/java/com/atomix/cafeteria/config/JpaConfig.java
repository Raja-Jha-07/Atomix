package com.atomix.cafeteria.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.atomix.cafeteria.repository")
@EnableJpaAuditing
public class JpaConfig {
} 