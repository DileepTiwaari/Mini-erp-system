package com.erp.sales_service.repository;

import com.erp.sales_service.entity.SalesOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesOrderLineRepository extends JpaRepository<SalesOrderLine, Long> {

    List<SalesOrderLine> findBySalesOrderId(Long salesOrderId);
}