package com.erp.sales_service.util;

import java.util.concurrent.atomic.AtomicLong;

public class SalesUtil {

    // ⚠️ Temporary in-memory counter — resets on restart, not safe across
    // multiple instances. Replace with common-lib's ReferenceNumberGenerator
    // (DB-sequence backed) once common-lib is wired into this service.
    private static final AtomicLong COUNTER = new AtomicLong(1000);

    private SalesUtil() {
    }

    public static String generateOrderNumber() {
        return "SO-" + COUNTER.incrementAndGet();
    }
}