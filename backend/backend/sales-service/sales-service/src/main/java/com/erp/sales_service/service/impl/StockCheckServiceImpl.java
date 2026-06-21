package com.erp.sales_service.service.impl;

import com.erp.sales_service.client.InventoryServiceClient;
import com.erp.sales_service.service.interfaces.StockCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockCheckServiceImpl implements StockCheckService {

    private final InventoryServiceClient inventoryServiceClient;

    @Override
    public int getFreeToUseQty(Long productId) {
        InventoryServiceClient.StockDto stock = inventoryServiceClient.getStock(productId);
        return (stock != null && stock.freeToUseQty() != null) ? stock.freeToUseQty() : 0;
    }

    @Override
    public boolean isAvailable(Long productId, int requiredQty) {
        return getFreeToUseQty(productId) >= requiredQty;
    }
}