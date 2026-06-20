package com.erp.sales_service.service.interfaces;

import com.erp.sales_service.dto.request.SalesOrderRequest;
import com.erp.sales_service.dto.response.SalesOrderResponse;
import com.erp.sales_service.enums.SalesOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SalesOrderService {

    SalesOrderResponse createSalesOrder(SalesOrderRequest request);

    SalesOrderResponse getSalesOrderById(Long id);

    Page<SalesOrderResponse> getAllSalesOrders(SalesOrderStatus status, Pageable pageable);

    SalesOrderResponse confirmSalesOrder(Long id);

    SalesOrderResponse cancelSalesOrder(Long id);

    List<SalesOrderResponse> getPendingDeliveries();
}