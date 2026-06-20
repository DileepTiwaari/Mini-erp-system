package com.erp.sales_service.repository;

import com.erp.sales_service.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findBySalesOrderId(Long salesOrderId);
}