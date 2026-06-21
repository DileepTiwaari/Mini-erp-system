package com.erp.product_service.entity;

import com.erp.product_service.enums.ProcurementStrategy;
import com.erp.product_service.enums.ProcurementType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sales_price", nullable = false)
    private BigDecimal salesPrice = BigDecimal.ZERO;

    @Column(name = "cost_price", nullable = false)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "on_hand_qty", nullable = false)
    private BigDecimal onHandQty = BigDecimal.ZERO;

    @Column(name = "reserved_qty", nullable = false)
    private BigDecimal reservedQty = BigDecimal.ZERO;

    @Column(name = "free_to_use_qty", nullable = false)
    private BigDecimal freeToUseQty = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "procurement_type", nullable = false)
    private ProcurementType procurementType = ProcurementType.PURCHASE;

    @Enumerated(EnumType.STRING)
    @Column(name = "procurement_strategy", nullable = false)
    private ProcurementStrategy procurementStrategy = ProcurementStrategy.MTS;

    @Column(name = "procure_on_demand")
    private Boolean procureOnDemand = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        updateFreeToUseQty();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updateFreeToUseQty();
    }

    public void updateFreeToUseQty() {
        this.freeToUseQty = this.onHandQty.subtract(this.reservedQty);
    }
}