# API ERROR REPORT — FlowERP Frontend-to-Backend Integration

**Date:** 2026-06-21  
**Backend:** Spring Cloud Gateway on `localhost:8080`  
**Frontend:** Vite on `localhost:5173`  
**axiosInstance base URL:** `http://localhost:8080/api`

---

## Error Catalog

### ERR-001 — Business Owner: 401/403 on All Protected Routes
- **Page:** All pages when logged in as `BUSINESS_OWNER`
- **Root cause:** Frontend `ROLES.OWNER = 'OWNER'`, backend sends `role: 'BUSINESS_OWNER'`. Permission matrix lookup fails → "Access Denied" rendered client-side before any API request is made.
- **HTTP errors visible:** None (client-side denial)
- **Fix:** `constants.js` — Changed `OWNER: 'OWNER'` to `BUSINESS_OWNER: 'BUSINESS_OWNER'`. Updated `permissions.js` matrix key. **Status: FIXED**

### ERR-002 — Sales Orders Page: TypeError White Screen
- **Page:** `/sales-orders`
- **API call:** `GET /api/sales-orders`
- **Gateway route:** `→ sales-service`
- **Backend response shape:** `{ content: [...], totalElements: N, totalPages: P, number: 0 }`
- **Bug:** `salesService.getSalesOrders()` returned `res.data` (entire Page object). SalesOrdersPage did `orders.filter(...)` on a plain object → `TypeError: orders.filter is not a function`.
- **Fix:** `salesService.js` — Added `extractList(data)` helper: `Array.isArray(data) ? data : data?.content ?? []`. **Status: FIXED**

### ERR-003 — Customers Tab: TypeError White Screen
- **Page:** `/sales-orders` (Customers tab)
- **API call:** `GET /api/customers`
- **Same paginated response shape issue as ERR-002**
- **Fix:** Same `extractList()` in `salesService.getCustomers()`. **Status: FIXED**

### ERR-004 — Inventory Page: TypeError White Screen
- **Page:** `/inventory`
- **API call:** `GET /api/products`
- **Bug:** `InventoryPage.jsx` line 78: `p.code.toLowerCase()` — backend `Product` entity has no `code` field. `undefined.toLowerCase()` → `TypeError: Cannot read properties of undefined` → white screen.
- **Fix:** Changed to `(p.code || p.sku || '').toLowerCase()`. **Status: FIXED**

### ERR-005 — Audit Logs: Stale Demo Data Never Refreshes
- **Page:** `/audit-logs`
- **Bug:** `auditService.getLogs()` in `dashboardService.js` always returned `mockDb.getAll(DB_KEYS.AUDIT_LOGS)`. The `auditApi.getLogs()` function existed but was never called.
- **Gateway route when fixed:** `GET /api/audit-logs → audit-service` (stub service — will 503 until audit-service is fully wired)
- **Fix:** `dashboardService.js` — `auditService.getLogs()` now calls `auditApi.getLogs(params)` and extracts `.content`. **Status: FIXED**

### ERR-006 — Dashboard: Hardcoded Monthly Sales Chart Data
- **Page:** `/dashboard`
- **Bug:** `dashboardService.getSalesSummary()` catch block returned static array `[{month:'Jan', sales:12000}, ...]`. Real backend data never shown.
- **Fix:** Removed hardcoded fallback. API errors now propagate; chart shows empty/error state. **Status: FIXED**

### ERR-007 — API Endpoint Path Mismatch: SALES
- **Constant:** `API_ENDPOINTS.SALES = '/sales'` (OLD)
- **Gateway route:** `GET /api/sales-orders/**` → sales-service
- **Sales controller:** `@RequestMapping("/api/sales-orders")`
- **Fix:** Changed to `SALES: '/sales-orders'` in `constants.js`. **Status: FIXED**

### ERR-008 — API Endpoint Path Mismatch: PURCHASES
- **Constant:** `API_ENDPOINTS.PURCHASES = '/purchases'` (OLD)
- **Gateway route:** `GET /api/purchase-orders/**` → purchase-service
- **Fix:** Changed to `PURCHASES: '/purchase-orders'` in `constants.js`. **Status: FIXED**

### ERR-009 — Inventory canAdjust Button Always Hidden
- **Page:** `/inventory`
- **Bug:** `canAdjust = user?.role === 'admin' || user?.role === 'manager'` — roles are `'ADMIN'` / `'INVENTORY_MANAGER'` (uppercase). Lowercase comparison always `false`. "Adjust Stock" button never visible for any role.
- **Fix:** Changed to `checkPermission(user?.role, MODULES.INVENTORY, ACTIONS.CREATE)`. **Status: FIXED**

---

## Gateway → Backend Route Map (as configured in GatewayConfig.java)

| Frontend API Call | Gateway Route | Backend Service | Controller Path |
|---|---|---|---|
| `POST /api/auth/login` | `→ auth-service` | AuthController | `POST /api/auth/login` |
| `GET /api/auth/me` | `→ auth-service` | AuthController | `GET /api/auth/me` ⚠️ MISSING — add endpoint |
| `GET /api/products` | `→ product-service` | ProductController | `GET /api/products` |
| `GET /api/categories` | `→ product-service` | CategoryController | `GET /api/categories` |
| `GET /api/sales-orders` | `→ sales-service` | SalesOrderController | `GET /api/v1/sales-orders` ⚠️ v1 mismatch |
| `GET /api/customers` | `→ sales-service` | CustomerController | `GET /api/v1/customers` ⚠️ v1 mismatch |
| `GET /api/purchase-orders` | `→ purchase-service` | stub | 503 Service Unavailable |
| `GET /api/manufacturing` | `→ manufacturing-service` | stub | 503 Service Unavailable |
| `GET /api/inventory/ledger` | `→ inventory-service` | stub | 503 Service Unavailable |
| `GET /api/audit-logs` | `→ audit-service` | stub | 503 Service Unavailable |
| `GET /api/dashboard` | `→ (no route defined)` | — | 404 Not Found |

> ⚠️ **Critical backend items still needed** (outside frontend scope):
> 1. `GET /api/auth/me` endpoint in AuthController
> 2. Remove `/v1/` prefix from SalesOrderController and CustomerController
> 3. Or update GatewayConfig routes to include `/v1/` in strip-prefix path

---

## HTTP Error Behaviors by Page (Post-Fix)

| Page | Empty DB State | API Down State |
|---|---|---|
| Dashboard | Shows 0 counts, blank chart | Shows "Failed to load" toast; counts stay 0 |
| Products | "No products found" empty state | ErrorState component with Retry button |
| Sales Orders | Empty table | ErrorState with Retry button |
| Customers | Empty table | ErrorState with Retry button |
| Purchase Orders | Empty table | ErrorState with Retry button |
| Inventory | Empty stock table | ErrorState with Retry button |
| Audit Logs | Empty list | Empty list (403/404 from stub) |
| Manufacturing | Empty list | ErrorState with Retry button |
