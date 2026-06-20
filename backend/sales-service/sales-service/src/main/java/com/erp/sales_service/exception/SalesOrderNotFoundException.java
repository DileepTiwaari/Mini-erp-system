package com.erp.sales_service.exception;

public class SalesOrderNotFoundException extends RuntimeException {

    public SalesOrderNotFoundException(String message) {
        super(message);
    }

    public SalesOrderNotFoundException(Long id) {
        super("Sales order not found with id: " + id);
    }
}