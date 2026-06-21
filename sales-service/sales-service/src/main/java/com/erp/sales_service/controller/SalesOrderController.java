package com.erp.sales_service.controller;

import com.erp.sales_service.dto.request.SalesOrderRequest;
import com.erp.sales_service.dto.response.ApiResponse;
import com.erp.sales_service.dto.response.SalesOrderResponse;
import com.erp.sales_service.enums.SalesOrderStatus;
import com.erp.sales_service.service.interfaces.SalesOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    @PostMapping
    public ApiResponse<SalesOrderResponse> createSalesOrder(@Valid @RequestBody SalesOrderRequest request) {
        return ApiResponse.success("Sales order created successfully", salesOrderService.createSalesOrder(request));
    }

    @GetMapping
    public ApiResponse<Page<SalesOrderResponse>> getAllSalesOrders(
            @RequestParam(required = false) SalesOrderStatus status,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ApiResponse.success(salesOrderService.getAllSalesOrders(status, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<SalesOrderResponse> getSalesOrderById(@PathVariable Long id) {
        return ApiResponse.success(salesOrderService.getSalesOrderById(id));
    }

    @PostMapping("/{id}/confirm")
    public ApiResponse<SalesOrderResponse> confirmSalesOrder(@PathVariable Long id) {
        return ApiResponse.success("Sales order confirmed", salesOrderService.confirmSalesOrder(id));
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<SalesOrderResponse> cancelSalesOrder(@PathVariable Long id) {
        return ApiResponse.success("Sales order cancelled", salesOrderService.cancelSalesOrder(id));
    }

    @GetMapping("/pending-deliveries")
    public ApiResponse<List<SalesOrderResponse>> getPendingDeliveries() {
        return ApiResponse.success(salesOrderService.getPendingDeliveries());
    }
}