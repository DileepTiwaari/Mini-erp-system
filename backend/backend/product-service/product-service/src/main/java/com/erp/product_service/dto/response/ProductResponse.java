package com.erp.product_service.dto.response;

import com.erp.product_service.enums.ProcurementStrategy;
import com.erp.product_service.enums.ProcurementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal salesPrice;
    private BigDecimal costPrice;
    private BigDecimal onHandQty;
    private BigDecimal reservedQty;
    private BigDecimal freeToUseQty;
    private ProcurementType procurementType;
    private ProcurementStrategy procurementStrategy;
    private Boolean procureOnDemand;
    private Long categoryId;
    private String categoryName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}