package com.erp.sales_service.dto.response;

import com.erp.sales_service.enums.DeliveryStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    private Long id;
    private Long salesOrderId;
    private LocalDateTime deliveryDate;
    private DeliveryStatus status;
    private String notes;
}