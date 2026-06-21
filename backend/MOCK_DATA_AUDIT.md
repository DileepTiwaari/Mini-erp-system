# MOCK DATA AUDIT — FlowERP Frontend

**Date:** 2026-06-21  
**Status:** COMPLETE — All mock fallbacks removed

---

## Summary

| Category | Count |
|---|---|
| Files with mock imports | 8 |
| Files with mock fallback in catch blocks | 8 |
| Components with hard-coded demo data | 3 |
| localStorage keys seeded with demo data | 13 |
| Files modified to remove mocks | 9 |

---

## Phase 1 — mockDb Seed Structure

`src/utils/mockDb.js` seeds the following localStorage keys on first load:

| Key | Contents |
|---|---|
| `db_users` | 6 demo users (admin, owner, sales, purchase, mfg, inventory) |
| `db_products` | ~10 sample products with prices and categoryIds |
| `db_categories` | 4 categories (Electronics, Raw Materials, etc.) |
| `db_vendors` | 3 sample vendor companies |
| `db_customers` | 3 sample customer companies |
| `db_sales` | 3 sample sales orders |
| `db_purchases` | 3 sample purchase orders |
| `db_boms` | 2 Bill of Materials entries |
| `db_work_centers` | 2 work centers |
| `db_manufacturing` | 2 manufacturing orders |
| `db_work_orders` | 3 work orders |
| `db_inventory_ledger` | Adjustment log entries |
| `db_audit_logs` | System activity entries |

**Root cause of demo data for new users:** `mockDb.js` was auto-imported by every service file. On import, it ran `initializeDb()` which seeded all 13 tables into localStorage. Service catch blocks then read from these seeded tables whenever any API call failed.

---

## Phase 2 — Files Modified

### `src/services/authService.js`
- **Before:** `catch(e) { return mockDb.getAll(DB_KEYS.USERS) }`
- **After:** Throws error; API-only. Fallback reads real session from `auth_user` localStorage key only (not mock db).

### `src/services/productService.js`
- **Before:** Every method had `catch(e) { return mockDb.getAll(DB_KEYS.PRODUCTS) }`
- **After:** Throws API errors. Pages handle empty/error state via ErrorState component.

### `src/services/salesService.js`
- **Before:** `getSalesOrders()` returned `res.data` (Spring Page object, not array) + `catch` returned `mockDb.getAll(DB_KEYS.SALES)`
- **After:** Returns `data.content || data` to handle paginated response. No fallback. Also added `extractList()` helper.

### `src/services/dashboardService.js`
- **Before:** `getSalesSummary()` catch returned hardcoded `[{month:'Jan', sales:12000}, ...]`. `auditService.getLogs()` always read mockDb, never called `auditApi`.
- **After:** All methods call live API. `auditService.getLogs()` now calls `auditApi.getLogs()`.

### `src/services/inventoryService.js`
- **Before:** `catch(e) { return mockDb.getAll(DB_KEYS.INVENTORY_LEDGER) }`
- **After:** All API calls, `extractList()` handles pagination.

### `src/services/purchaseService.js`
- **Before:** `catch(e) { return mockDb.getAll(DB_KEYS.PURCHASES) }` on all methods
- **After:** Live API only.

### `src/services/manufacturingService.js`
- **Before:** `catch(e) { return mockDb.getAll(DB_KEYS.MANUFACTURING) }` on all methods
- **After:** Live API only.

### `src/services/procurementService.js`
- **Before:** `catch(e) { return mockDb.getAll(DB_KEYS.PROCUREMENT) }`
- **After:** Live API only.

### `src/main.jsx`
- **Added:** localStorage cleanup block that purges all `db_*` keys on first load under version flag `_mock_db_cleared = '2'`. This removes any already-seeded data for existing browser sessions.

---

## Phase 3 — Remaining Demo Artifacts (Non-Critical)

| File | Line | Content | Recommendation |
|---|---|---|---|
| `LoginForm.jsx` | 101-108 | `demoUsers` array with demo emails | Keep — useful for demo/judging; credentials exist in backend seed data |
| `mockDb.js` | all | Full localStorage database | File itself can be deleted once backend services are confirmed stable |
| `AuditLogTable.jsx` | 56 | Comment: "Also mock in this file" | Comment only — no actual mock usage; safe to ignore |
| `WorkOrderCard.jsx` | 95 | Comment: "Also mock WorkOrderBoard" | Comment only — no actual mock usage; safe to ignore |

---

## Phase 4 — Empty State Behavior After Fix

With mock data removed:
- **New user login**: All data pages show empty tables / "No records found" state
- **Dashboard KPIs**: Show `0` counts from live `GET /api/dashboard`
- **Sales Orders**: Empty table with "Create First Order" CTA
- **Products**: Empty catalog — add products via Products page
- **Audit Logs**: Empty list — activities appear after real ERP operations
