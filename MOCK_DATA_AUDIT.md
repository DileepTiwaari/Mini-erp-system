# FlowERP — Mock Data Audit Report

## Executive Summary

This report documents the complete audit and remediation of mock/fallback data usage in the FlowERP frontend. The primary goal was to ensure that **new users see empty states** instead of pre-populated demo data, and that modules with live backend services use **only live API data**.

---

## Problem Statement

1. **Newly registered users immediately saw demo/mock records** (10 products, 10 customers, 15 sales orders, etc.)
2. **All service files silently fell back to mockDb** when API calls failed, masking real errors
3. **Business Owner role received "Access Denied"** due to role string mismatch (`OWNER` vs `BUSINESS_OWNER`)
4. **Dashboard displayed mock data** even when backend was running

---

## Mock Data Sources Found

| File | Type | Status |
|---|---|---|
| `src/utils/mockDb.js` | Primary mock persistence layer (localStorage) | ✅ **Fixed** — Auto-seeding disabled |
| `src/services/productService.js` | catch → mockDb fallback | ✅ **Fixed** — Fallbacks removed |
| `src/services/salesService.js` | catch → mockDb fallback | ✅ **Fixed** — Fallbacks removed for API-backed methods |
| `src/services/dashboardService.js` | Direct mockDb.getAll for manufacturing | ✅ **Fixed** — Uses service layer instead |
| `src/services/authService.js` | catch → mockDb fallback for login/register | ⚠️ **Kept** — Standalone mode fallback |
| `src/services/purchaseService.js` | catch → mockDb fallback | ⚠️ **Kept** — No backend service available |
| `src/services/manufacturingService.js` | catch → mockDb fallback | ⚠️ **Kept** — No backend service available |
| `src/services/inventoryService.js` | catch → mockDb fallback | ⚠️ **Kept** — No backend service available |
| `src/services/procurementService.js` | catch → mockDb fallback | ⚠️ **Kept** — No backend service available |

---

## Changes Made

### 1. Disabled Auto-Seeding (`mockDb.js`)

**Before:**
```javascript
getAll: (key) => {
    initMockDb(); // ← AUTO-SEEDS demo data on every read
    return storage.get(key) || [];
},
```

**After:**
```javascript
getAll: (key) => {
    return storage.get(key) || []; // ← Returns empty array for new users
},
```

**Impact:** New users now see empty states. The `initMockDb()` function is preserved for explicit seeding if needed.

### 2. Removed Mock Fallbacks — Product Service

All 9 methods in `productService.js` (getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories, createCategory, updateCategory, deleteCategory) now call the live backend directly. Errors propagate to the page-level `catch` blocks which display `<ErrorState>` components.

### 3. Removed Mock Fallbacks — Sales Service

All 11 API-backed methods in `salesService.js` (getSalesOrders, getSalesOrderById, createSalesOrder, updateSalesOrder, cancelSalesOrder, confirmSalesOrder, deleteSalesOrder, getCustomers, createCustomer, updateCustomer, deleteCustomer) now call the live backend directly.

Stock reservation helpers and delivery processing logic remain mockDb-based since the backend doesn't have those endpoints.

### 4. Fixed Dashboard Manufacturing Summary

The `getManufacturingSummary()` function was directly calling `mockDb.getAll(DB_KEYS.MANUFACTURING)`. It now uses the `manufacturingService` layer which properly handles offline scenarios.

---

## Module Data Source Matrix (Post-Remediation)

| Module | Backend Available | Data Source | Empty State Support |
|---|---|---|---|
| Authentication | ✅ Auth Service | Live API (fallback: mockDb for standalone) | N/A |
| Products | ✅ Product Service | Live API only | ✅ Yes |
| Categories | ✅ Product Service | Live API only | ✅ Yes |
| Customers | ✅ Sales Service | Live API only | ✅ Yes |
| Sales Orders | ✅ Sales Service | Live API only | ✅ Yes |
| Dashboard | ✅ Aggregated | Live APIs (products + customers + sales) | ✅ Yes |
| Purchase Orders | ❌ None | localStorage (mockDb) | ✅ Yes (empty if not seeded) |
| Vendors | ❌ None | localStorage (mockDb) | ✅ Yes |
| Manufacturing | ❌ None | localStorage (mockDb) | ✅ Yes |
| BOM | ❌ None | localStorage (mockDb) | ✅ Yes |
| Work Centers | ❌ None | localStorage (mockDb) | ✅ Yes |
| Inventory | ❌ None | localStorage (mockDb) | ✅ Yes |
| Procurement | ❌ None | localStorage (mockDb) | ✅ Yes |
| Audit Logs | ❌ None | localStorage (mockDb) | ✅ Yes |

---

## Verification Checklist

- [x] New user registration → Login → Dashboard shows "No data available" (empty state)
- [x] Products page shows actual database records (from `seed.sql`)
- [x] Customers page shows actual database records
- [x] Sales Orders page shows actual database records
- [x] Business Owner can access Dashboard
- [x] Business Owner can access Audit Logs
- [x] Pages with no backend show empty states (not demo data)
- [x] All pages handle API errors gracefully with `<ErrorState>` component
