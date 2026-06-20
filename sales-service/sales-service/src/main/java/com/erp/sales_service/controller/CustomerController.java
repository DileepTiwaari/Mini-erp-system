package com.erp.sales_service.controller;

import com.erp.sales_service.dto.request.CustomerRequest;
import com.erp.sales_service.dto.response.ApiResponse;
import com.erp.sales_service.dto.response.CustomerResponse;
import com.erp.sales_service.service.interfaces.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ApiResponse<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest request) {
        return ApiResponse.success("Customer created successfully", customerService.createCustomer(request));
    }

    @GetMapping
    public ApiResponse<Page<CustomerResponse>> getAllCustomers(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ApiResponse.success(customerService.getAllCustomers(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> getCustomerById(@PathVariable Long id) {
        return ApiResponse.success(customerService.getCustomerById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CustomerResponse> updateCustomer(
            @PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        return ApiResponse.success("Customer updated successfully", customerService.updateCustomer(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ApiResponse.success("Customer deleted successfully", null);
    }
}