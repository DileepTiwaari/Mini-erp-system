package com.erp.product_service.dto.request;

import com.erp.product_service.enums.ProcurementStrategy;
import com.erp.product_service.enums.ProcurementType;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductUpdateRequest {

    private String name;
    private String description;

    @DecimalMin(value = "0.0", message = "Sales price must be positive")
    private BigDecimal salesPrice;

    @DecimalMin(value = "0.0", message = "Cost price must be positive")
    private BigDecimal costPrice;

    private ProcurementType procurementType;
    private ProcurementStrategy procurementStrategy;
    private Boolean procureOnDemand;
    private Long categoryId;
    private Boolean isActive;
}