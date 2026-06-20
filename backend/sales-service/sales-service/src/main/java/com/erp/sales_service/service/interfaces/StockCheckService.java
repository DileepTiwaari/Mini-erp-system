package com.erp.sales_service.service.interfaces;

public interface StockCheckService {

    int getFreeToUseQty(Long productId);

    boolean isAvailable(Long productId, int requiredQty);
}