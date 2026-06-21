package com.erp.product_service.util;

import java.math.BigDecimal;

public class ProductUtil {

    public static BigDecimal calculateFreeToUseQty(
            BigDecimal onHandQty, BigDecimal reservedQty) {
        if (onHandQty == null) onHandQty = BigDecimal.ZERO;
        if (reservedQty == null) reservedQty = BigDecimal.ZERO;
        BigDecimal result = onHandQty.subtract(reservedQty);
        return result.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : result;
    }

    public static boolean hasSufficientStock(
            BigDecimal freeToUseQty, BigDecimal requiredQty) {
        if (freeToUseQty == null) return false;
        if (requiredQty == null) return false;
        return freeToUseQty.compareTo(requiredQty) >= 0;
    }
}