package com.erp.sales_service.controller;

import com.erp.sales_service.dto.request.DeliveryRequest;
import com.erp.sales_service.dto.response.ApiResponse;
import com.erp.sales_service.dto.response.DeliveryResponse;
import com.erp.sales_service.service.interfaces.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/{id}/deliver")
    public ApiResponse<DeliveryResponse> deliverSalesOrder(
            @PathVariable("id") Long salesOrderId, @Valid @RequestBody DeliveryRequest request) {
        return ApiResponse.success("Delivery recorded successfully",
                deliveryService.deliverSalesOrder(salesOrderId, request));
    }

    @GetMapping("/{id}/delivery-status")
    public ApiResponse<DeliveryResponse> getDeliveryStatus(@PathVariable("id") Long salesOrderId) {
        return ApiResponse.success(deliveryService.getDeliveryStatus(salesOrderId));
    }
}