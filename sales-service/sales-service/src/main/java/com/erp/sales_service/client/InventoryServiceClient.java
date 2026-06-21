package com.erp.sales_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventory-service")
public interface InventoryServiceClient {

    @GetMapping("/api/stocks/{productId}")
    StockDto getStock(@PathVariable("productId") Long productId);

    @PostMapping("/api/stocks/reserve")
    void reserveStock(@RequestBody ReserveStockRequest request);

    @PostMapping("/api/stocks/release")
    void releaseStock(@RequestBody ReleaseStockRequest request);

    @PostMapping("/api/stocks/move")
    void moveStock(@RequestBody MoveStockRequest request);

    record StockDto(
            Long productId,
            Integer onHandQty,
            Integer reservedQty,
            Integer freeToUseQty
    ) {}

    record ReserveStockRequest(
            Long productId,
            Integer qty,
            String referenceId,
            String referenceType
    ) {}

    record ReleaseStockRequest(
            Long productId,
            Integer qty,
            String referenceId,
            String referenceType
    ) {}

    record MoveStockRequest(
            Long productId,
            Integer qty,
            String movementType,
            String referenceId,
            String referenceType
    ) {}
}