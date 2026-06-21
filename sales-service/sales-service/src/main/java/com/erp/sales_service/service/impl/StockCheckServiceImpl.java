package com.erp.sales_service.service.impl;

import com.erp.sales_service.client.InventoryServiceClient;
import com.erp.sales_service.service.interfaces.StockCheckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockCheckServiceImpl implements StockCheckService {

    private final InventoryServiceClient inventoryServiceClient;

    @Override
    public int getFreeToUseQty(Long productId) {
        try {
            InventoryServiceClient.StockDto stock = inventoryServiceClient.getStock(productId);
            return (stock != null && stock.freeToUseQty() != null) ? stock.freeToUseQty() : 0;
        } catch (Exception e) {
            log.warn("Inventory service unavailable, assuming unlimited stock for product {}: {}",
                    productId, e.getMessage());
            return 999;
        }
    }

    @Override
    public boolean isAvailable(Long productId, int requiredQty) {
        return getFreeToUseQty(productId) >= requiredQty;
    }
}