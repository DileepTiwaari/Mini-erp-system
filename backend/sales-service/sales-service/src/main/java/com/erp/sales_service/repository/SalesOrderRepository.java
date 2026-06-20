package com.erp.sales_service.repository;

import com.erp.sales_service.entity.SalesOrder;
import com.erp.sales_service.enums.SalesOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    Optional<SalesOrder> findByOrderNumber(String orderNumber);

    Page<SalesOrder> findByStatus(SalesOrderStatus status, Pageable pageable);

    Page<SalesOrder> findByCustomerId(Long customerId, Pageable pageable);

    List<SalesOrder> findByStatusIn(List<SalesOrderStatus> statuses);

    long countByStatus(SalesOrderStatus status);
}