package com.erp.sales_service.service.impl;

import com.erp.sales_service.dto.request.CustomerRequest;
import com.erp.sales_service.dto.response.CustomerResponse;
import com.erp.sales_service.entity.Customer;
import com.erp.sales_service.repository.CustomerRepository;
import com.erp.sales_service.service.interfaces.CustomerService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public CustomerResponse createCustomer(CustomerRequest request) {
        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        return toResponse(customerRepository.save(customer));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));
        return toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        return toResponse(customerRepository.save(customer));
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new EntityNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    private CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}