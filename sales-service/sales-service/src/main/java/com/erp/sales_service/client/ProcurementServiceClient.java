package com.erp.sales_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "procurement-service")
public interface ProcurementServiceClient {

    @PostMapping("/api/procurement/auto")
    ProcurementTriggerResponse triggerAutoProcurement(@RequestBody ProcurementTriggerRequest request);

    record ProcurementTriggerRequest(
            Long productId,
            Integer requiredQty,
            String salesOrderNumber
    ) {}

    record ProcurementTriggerResponse(
            Boolean procurementTriggered,
            String type,
            Integer shortage,
            String referenceId,
            String reason
    ) {}
}