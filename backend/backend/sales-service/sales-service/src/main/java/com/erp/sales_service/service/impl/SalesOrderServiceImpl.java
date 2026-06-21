package com.erp.sales_service.service.impl;

import com.erp.sales_service.client.InventoryServiceClient;
import com.erp.sales_service.client.ProcurementServiceClient;
import com.erp.sales_service.dto.request.SalesOrderLineRequest;
import com.erp.sales_service.dto.request.SalesOrderRequest;
import com.erp.sales_service.dto.response.SalesOrderResponse;
import com.erp.sales_service.entity.SalesOrder;
import com.erp.sales_service.entity.SalesOrderLine;
import com.erp.sales_service.enums.SalesOrderStatus;
import com.erp.sales_service.exception.InvalidOrderStateException;
import com.erp.sales_service.exception.SalesOrderNotFoundException;
import com.erp.sales_service.repository.SalesOrderRepository;
import com.erp.sales_service.service.interfaces.SalesOrderService;
import com.erp.sales_service.service.interfaces.StockCheckService;
import com.erp.sales_service.util.SalesUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final StockCheckService stockCheckService;
    private final InventoryServiceClient inventoryServiceClient;
    private final ProcurementServiceClient procurementServiceClient;

    @Override
    public SalesOrderResponse createSalesOrder(SalesOrderRequest request) {
        SalesOrder order = SalesOrder.builder()
                .orderNumber(SalesUtil.generateOrderNumber())
                .customerId(request.getCustomerId())
                .status(SalesOrderStatus.DRAFT)
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<SalesOrderLine> lines = new ArrayList<>();
        for (SalesOrderLineRequest lineReq : request.getLines()) {
            lines.add(SalesOrderLine.builder()
                    .salesOrder(order)
                    .productId(lineReq.getProductId())
                    .orderedQty(lineReq.getQty())
                    .reservedQty(0)
                    .deliveredQty(0)
                    .build());
        }
        order.setLines(lines);

        SalesOrder saved = salesOrderRepository.save(order);
        return toResponse(saved, false, null);
    }

    @Override
    @Transactional(readOnly = true)
    public SalesOrderResponse getSalesOrderById(Long id) {
        return toResponse(findOrderOrThrow(id), false, null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrderResponse> getAllSalesOrders(SalesOrderStatus status, Pageable pageable) {
        Page<SalesOrder> page = (status != null)
                ? salesOrderRepository.findByStatus(status, pageable)
                : salesOrderRepository.findAll(pageable);
        return page.map(order -> toResponse(order, false, null));
    }

    @Override
    public SalesOrderResponse confirmSalesOrder(Long id) {
        SalesOrder order = findOrderOrThrow(id);

        if (order.getStatus() != SalesOrderStatus.DRAFT) {
            throw new InvalidOrderStateException(
                    "Only DRAFT orders can be confirmed. Current status: " + order.getStatus());
        }

        boolean procurementTriggered = false;
        StringBuilder procurementMessage = new StringBuilder();

        for (SalesOrderLine line : order.getLines()) {
            int available = stockCheckService.getFreeToUseQty(line.getProductId());
            int required = line.getOrderedQty();

            if (available >= required) {
                inventoryServiceClient.reserveStock(new InventoryServiceClient.ReserveStockRequest(
                        line.getProductId(), required, order.getOrderNumber(), "SALES_ORDER"));
                line.setReservedQty(required);
            } else {
                int shortage = required - available;

                if (available > 0) {
                    inventoryServiceClient.reserveStock(new InventoryServiceClient.ReserveStockRequest(
                            line.getProductId(), available, order.getOrderNumber(), "SALES_ORDER"));
                    line.setReservedQty(available);
                }

                ProcurementServiceClient.ProcurementTriggerResponse response =
                        procurementServiceClient.triggerAutoProcurement(
                                new ProcurementServiceClient.ProcurementTriggerRequest(
                                        line.getProductId(), shortage, order.getOrderNumber()));

                if (response != null && Boolean.TRUE.equals(response.procurementTriggered())) {
                    procurementTriggered = true;
                    procurementMessage.append(response.reason()).append("; ");
                }
            }
        }

        order.setStatus(SalesOrderStatus.CONFIRMED);
        SalesOrder saved = salesOrderRepository.save(order);

        return toResponse(saved, procurementTriggered,
                procurementMessage.length() > 0 ? procurementMessage.toString() : null);
    }

    @Override
    public SalesOrderResponse cancelSalesOrder(Long id) {
        SalesOrder order = findOrderOrThrow(id);

        if (order.getStatus() == SalesOrderStatus.FULLY_DELIVERED
                || order.getStatus() == SalesOrderStatus.CANCELLED) {
            throw new InvalidOrderStateException(
                    "Cannot cancel an order with status: " + order.getStatus());
        }

        for (SalesOrderLine line : order.getLines()) {
            if (line.getReservedQty() != null && line.getReservedQty() > 0) {
                inventoryServiceClient.releaseStock(new InventoryServiceClient.ReleaseStockRequest(
                        line.getProductId(), line.getReservedQty(), order.getOrderNumber(), "SALES_ORDER"));
                line.setReservedQty(0);
            }
        }

        order.setStatus(SalesOrderStatus.CANCELLED);
        SalesOrder saved = salesOrderRepository.save(order);
        return toResponse(saved, false, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesOrderResponse> getPendingDeliveries() {
        return salesOrderRepository.findByStatusIn(
                        List.of(SalesOrderStatus.CONFIRMED, SalesOrderStatus.PARTIALLY_DELIVERED))
                .stream()
                .map(order -> toResponse(order, false, null))
                .collect(Collectors.toList());
    }

    private SalesOrder findOrderOrThrow(Long id) {
        return salesOrderRepository.findById(id)
                .orElseThrow(() -> new SalesOrderNotFoundException(id));
    }

    private SalesOrderResponse toResponse(SalesOrder order, boolean procurementTriggered, String procurementMessage) {
        List<SalesOrderResponse.LineItem> lineItems = order.getLines().stream()
                .map(line -> SalesOrderResponse.LineItem.builder()
                        .id(line.getId())
                        .productId(line.getProductId())
                        .orderedQty(line.getOrderedQty())
                        .reservedQty(line.getReservedQty())
                        .deliveredQty(line.getDeliveredQty())
                        .unitPrice(line.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return SalesOrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomerId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .lines(lineItems)
                .procurementTriggered(procurementTriggered)
                .procurementMessage(procurementMessage)
                .build();
    }
}