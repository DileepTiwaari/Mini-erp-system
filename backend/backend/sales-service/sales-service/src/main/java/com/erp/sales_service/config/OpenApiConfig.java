package com.erp.sales_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI salesServiceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sales Service API")
                        .version("1.0.0")
                        .description("Mini ERP — Sales Order, Customer and Delivery management"));
    }
}