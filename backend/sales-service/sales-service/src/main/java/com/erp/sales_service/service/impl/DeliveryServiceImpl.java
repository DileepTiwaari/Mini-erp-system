package com.erp.sales_service.service.impl;

import com.erp.sales_service.client.InventoryServiceClient;
import com.erp.sales_service.dto.request.DeliveryRequest;
import com.erp.sales_service.dto.response.DeliveryResponse;
import com.erp.sales_service.entity.Delivery;
import com.erp.sales_service.entity.SalesOrder;
import com.erp.sales_service.entity.SalesOrderLine;
import com.erp.sales_service.enums.DeliveryStatus;
import com.erp.sales_service.enums.SalesOrderStatus;
import com.erp.sales_service.exception.InvalidOrderStateException;
import com.erp.sales_service.exception.SalesOrderNotFoundException;
import com.erp.sales_service.repository.DeliveryRepository;
import com.erp.sales_service.repository.SalesOrderLineRepository;
import com.erp.sales_service.repository.SalesOrderRepository;
import com.erp.sales_service.service.interfaces.DeliveryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryServiceImpl implements DeliveryService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderLineRepository salesOrderLineRepository;
    private final DeliveryRepository deliveryRepository;
    private final InventoryServiceClient inventoryServiceClient;

    @Override
    public DeliveryResponse deliverSalesOrder(Long salesOrderId, DeliveryRequest request) {
        SalesOrder order = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new SalesOrderNotFoundException(salesOrderId));

        if (order.getStatus() != SalesOrderStatus.CONFIRMED
                && order.getStatus() != SalesOrderStatus.PARTIALLY_DELIVERED) {
            throw new InvalidOrderStateException(
                    "Cannot deliver an order with status: " + order.getStatus());
        }

        Map<Long, SalesOrderLine> lineMap = order.getLines().stream()
                .collect(Collectors.toMap(SalesOrderLine::getId, l -> l));

        for (DeliveryRequest.DeliveryLineItem item : request.getLines()) {
            SalesOrderLine line = lineMap.get(item.getSalesOrderLineId());
            if (line == null) {
                throw new EntityNotFoundException(
                        "Sales order line not found: " + item.getSalesOrderLineId());
            }

            int remaining = line.getOrderedQty() - line.getDeliveredQty();
            if (item.getDeliveredQty() > remaining) {
                throw new InvalidOrderStateException(
                        "Delivered quantity exceeds remaining quantity for product: " + line.getProductId());
            }

            inventoryServiceClient.moveStock(new InventoryServiceClient.MoveStockRequest(
                    line.getProductId(), item.getDeliveredQty(), "SALE_DELIVERY",
                    order.getOrderNumber(), "SALES_ORDER"));

            inventoryServiceClient.releaseStock(new InventoryServiceClient.ReleaseStockRequest(
                    line.getProductId(), item.getDeliveredQty(), order.getOrderNumber(), "SALES_ORDER"));

            line.setDeliveredQty(line.getDeliveredQty() + item.getDeliveredQty());
            line.setReservedQty(Math.max(0, line.getReservedQty() - item.getDeliveredQty()));
            salesOrderLineRepository.save(line);
        }

        boolean fullyDelivered = order.getLines().stream()
                .allMatch(l -> l.getDeliveredQty().equals(l.getOrderedQty()));

        order.setStatus(fullyDelivered ? SalesOrderStatus.FULLY_DELIVERED : SalesOrderStatus.PARTIALLY_DELIVERED);
        salesOrderRepository.save(order);

        Delivery delivery = Delivery.builder()
                .salesOrderId(order.getId())
                .status(fullyDelivered ? DeliveryStatus.DONE : DeliveryStatus.PARTIALLY_DONE)
                .notes("Delivery recorded for order " + order.getOrderNumber())
                .build();

        return toResponse(deliveryRepository.save(delivery));
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryResponse getDeliveryStatus(Long salesOrderId) {
        List<Delivery> deliveries = deliveryRepository.findBySalesOrderId(salesOrderId);
        if (deliveries.isEmpty()) {
            throw new EntityNotFoundException("No deliveries found for sales order: " + salesOrderId);
        }
        return toResponse(deliveries.get(deliveries.size() - 1));
    }

    private DeliveryResponse toResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .salesOrderId(delivery.getSalesOrderId())
                .deliveryDate(delivery.getDeliveryDate())
                .status(delivery.getStatus())
                .notes(delivery.getNotes())
                .build();
    }
}