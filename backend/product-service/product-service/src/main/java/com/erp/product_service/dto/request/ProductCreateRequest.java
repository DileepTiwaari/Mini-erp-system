package com.erp.product_service.dto.request;

import com.erp.product_service.enums.ProcurementStrategy;
import com.erp.product_service.enums.ProcurementType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Sales price is required")
    @DecimalMin(value = "0.0", message = "Sales price must be positive")
    private BigDecimal salesPrice;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", message = "Cost price must be positive")
    private BigDecimal costPrice;

    @DecimalMin(value = "0.0", message = "Quantity must be positive")
    private BigDecimal onHandQty = BigDecimal.ZERO;

    @NotNull(message = "Procurement type is required")
    private ProcurementType procurementType;

    @NotNull(message = "Procurement strategy is required")
    private ProcurementStrategy procurementStrategy;

    private Boolean procureOnDemand = false;

    private Long categoryId;
}