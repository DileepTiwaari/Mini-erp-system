package com.erp.sales_service.dto.response;

import com.erp.sales_service.enums.SalesOrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderResponse {

    private Long id;
    private String orderNumber;
    private Long customerId;
    private LocalDateTime orderDate;
    private SalesOrderStatus status;
    private BigDecimal totalAmount;
    private List<LineItem> lines;
    private Boolean procurementTriggered;
    private String procurementMessage;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LineItem {
        private Long id;
        private Long productId;
        private Integer orderedQty;
        private Integer reservedQty;
        private Integer deliveredQty;
        private BigDecimal unitPrice;
    }
}