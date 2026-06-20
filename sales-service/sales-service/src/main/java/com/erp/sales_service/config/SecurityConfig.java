package com.erp.sales_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Authentication and role-based authorization are enforced centrally at the
 * API Gateway (JWT validation + RoleBasedAccessFilter). This service does not
 * include spring-boot-starter-security on its classpath; it only configures
 * CORS here so requests routed through the gateway are not blocked.
 */
@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}