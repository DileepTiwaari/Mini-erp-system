package com.erp.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimitConfig {

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String authHeader = exchange.getRequest()
                    .getHeaders()
                    .getFirst("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return Mono.just(authHeader.substring(7));
            }
            return Mono.just(exchange.getRequest()
                    .getRemoteAddress()
                    .getAddress()
                    .getHostAddress());
        };
    }
}