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

                // Sales Service
                .route("sales-service", r -> r
                        .path("/api/customers/**", "/api/sales-orders/**", "/api/deliveries/**")
                        .uri("lb://sales-service"))

                // Purchase Service
                .route("purchase-service", r -> r
                        .path("/api/vendors/**", "/api/purchase-orders/**")
                        .uri("lb://purchase-service"))

                // BOM Service
                .route("bom-service", r -> r
                        .path("/api/boms/**", "/api/work-centers/**")
                        .uri("lb://bom-service"))

                // Manufacturing Service
                .route("manufacturing-service", r -> r
                        .path("/api/manufacturing-orders/**", "/api/work-orders/**")
                        .uri("lb://manufacturing-service"))

                // Inventory Service
                .route("inventory-service", r -> r
                        .path("/api/stocks/**", "/api/stock-ledger/**")
                        .uri("lb://inventory-service"))

                // Procurement Service
                .route("procurement-service", r -> r
                        .path("/api/procurement/**")
                        .uri("lb://procurement-service"))

                // Audit Service
                .route("audit-service", r -> r
                        .path("/api/audit/**", "/api/dashboard/**")
                        .uri("lb://audit-service"))

                .build();
    }
}