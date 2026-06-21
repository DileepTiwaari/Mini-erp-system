package com.erp.sales_service.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeliveryRequest {

    @NotEmpty(message = "Delivery must contain at least one line item")
    @Valid
    private List<DeliveryLineItem> lines;

    @Getter
    @Setter
    public static class DeliveryLineItem {

        @NotNull(message = "Sales order line ID is required")
        private Long salesOrderLineId;

        @NotNull(message = "Delivered quantity is required")
        @Min(value = 1, message = "Delivered quantity must be at least 1")
        private Integer deliveredQty;
    }
}