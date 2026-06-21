package com.erp.api_gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class RoleBasedAccessFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String role = request.getHeaders().getFirst("X-User-Role");

        // Audit logs - Admin and Business Owner only
        if (path.startsWith("/api/audit") && !"ADMIN".equals(role) && !"BUSINESS_OWNER".equals(role)) {
            return onError(exchange, HttpStatus.FORBIDDEN);
        }

        // Dashboard - Admin and Business Owner only
        if (path.startsWith("/api/dashboard") && !"ADMIN".equals(role) && !"BUSINESS_OWNER".equals(role)) {
            return onError(exchange, HttpStatus.FORBIDDEN);
        }

        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return 0;
    }
}