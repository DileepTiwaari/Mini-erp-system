package com.erp.sales_service.service.interfaces;

import com.erp.sales_service.dto.request.DeliveryRequest;
import com.erp.sales_service.dto.response.DeliveryResponse;

public interface DeliveryService {

    DeliveryResponse deliverSalesOrder(Long salesOrderId, DeliveryRequest request);

    DeliveryResponse getDeliveryStatus(Long salesOrderId);
}