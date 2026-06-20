package com.erp.api_gateway.exception;

public class GatewayException extends RuntimeException {

    private final int statusCode;

    public GatewayException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}