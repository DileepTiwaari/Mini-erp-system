package com.erp.sales_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;

@FeignClient(name = "product-service")
public interface ProductServiceClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);

    record ProductDto(
            Long id,
            String sku,
            String name,
            BigDecimal salesPrice,
            BigDecimal costPrice,
            String procurementType,
            String procurementStrategy,
            Boolean procureOnDemand,
            Long vendorId,
            Long bomId
    ) {}
}