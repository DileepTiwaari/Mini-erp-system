package com.erp.sales_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_lines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "ordered_qty", nullable = false)
    private Integer orderedQty;

    @Builder.Default
    @Column(name = "reserved_qty", nullable = false)
    private Integer reservedQty = 0;

    @Builder.Default
    @Column(name = "delivered_qty", nullable = false)
    private Integer deliveredQty = 0;

    @Column(name = "unit_price", precision = 15, scale = 2)
    private BigDecimal unitPrice;
}