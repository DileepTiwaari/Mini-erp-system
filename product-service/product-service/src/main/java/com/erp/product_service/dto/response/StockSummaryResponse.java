package com.erp.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockSummaryResponse {
    private Long productId;
    private String productName;
    private BigDecimal onHandQty;
    private BigDecimal reservedQty;
    private BigDecimal freeToUseQty;
}