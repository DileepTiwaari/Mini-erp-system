package com.erp.sales_service.entity;

import com.erp.sales_service.enums.SalesOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 30)
    private String orderNumber;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SalesOrderStatus status;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SalesOrderLine> lines = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.orderDate == null) this.orderDate = LocalDateTime.now();
        if (this.status == null) this.status = SalesOrderStatus.DRAFT;
        if (this.totalAmount == null) this.totalAmount = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}