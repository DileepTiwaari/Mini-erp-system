package com.erp.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                // Auth Service
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://auth-service"))

                // Product Service
                .route("product-service", r -> r
                        .path("/api/products/**", "/api/categories/**")
                        .uri("lb://product-service"))

                // Sales Service (customers, sales-orders, deliveries)
                .route("sales-service", r -> r
                        .path("/api/customers/**", "/api/sales-orders/**", "/api/deliveries/**")
                        .uri("lb://sales-service"))

                .build();
    }
}