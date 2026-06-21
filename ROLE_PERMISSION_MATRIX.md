# FlowERP — Role-Based Access Control (RBAC) Permission Matrix

## Overview

FlowERP implements a comprehensive Role-Based Access Control (RBAC) system that governs user access across all ERP modules. Permissions are enforced at **three layers**:

1. **Frontend Route Guards** — `RoleGuard` component blocks unauthorized page navigation
2. **Frontend UI Controls** — Sidebar navigation and action buttons are conditionally rendered based on `checkPermission()`
3. **API Gateway Filter** — `RoleBasedAccessFilter` blocks unauthorized API requests at the network level

---

## System Roles

| Role Key | Display Name | Backend Enum | Description |
|---|---|---|---|
| `ADMIN` | Admin | `ADMIN` | Full system control across all modules |
| `BUSINESS_OWNER` | Business Owner | `BUSINESS_OWNER` | Executive-level access to all modules and dashboards |
| `SALES_USER` | Sales User | `SALES_USER` | Sales operations, customer management, product viewing |
| `PURCHASE_USER` | Purchase User | `PURCHASE_USER` | Purchase orders, vendor management, procurement alerts |
| `MANUFACTURING_USER` | Manufacturing User | `MANUFACTURING_USER` | Work orders, BOM management, shop floor operations |
| `INVENTORY_MANAGER` | Inventory Manager | `INVENTORY_MANAGER` | Stock management, product catalog, procurement |

---

## Permission Matrix

### Legend
- ✅ Full CRUD (View, Create, Edit, Delete)
- 👁️ View Only
- ❌ No Access
- 🔧 Partial (View + Create + Edit, no Delete)

| Module | ADMIN | BUSINESS_OWNER | SALES_USER | PURCHASE_USER | MFG_USER | INVENTORY_MANAGER |
|---|---|---|---|---|---|---|
| **Dashboard** | 👁️ | 👁️ | 👁️ | 👁️ | 👁️ | 👁️ |
| **User Management** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Products & Categories** | ✅ | ✅ | 👁️ | 👁️ | 👁️ | 🔧 |
| **Sales Orders** | ✅ | ✅ | 🔧 | ❌ | ❌ | ❌ |
| **Purchase Orders** | ✅ | ✅ | ❌ | 🔧 | ❌ | 👁️ |
| **Manufacturing** | ✅ | ✅ | ❌ | ❌ | 🔧 | 👁️ |
| **Inventory** | ✅ | ✅ | 👁️ | 👁️ | 👁️ | 🔧 |
| **Procurement** | ✅ | ✅ | ❌ | 👁️ | ❌ | 🔧 |
| **Audit Logs** | 👁️ | 👁️ | ❌ | ❌ | ❌ | ❌ |
| **Reports** | 👁️ | 👁️ | ❌ | ❌ | ❌ | 👁️ |

---

## API Gateway Role Enforcement

The `RoleBasedAccessFilter` in the API Gateway enforces the following rules:

| Endpoint Pattern | Allowed Roles | Action on Denial |
|---|---|---|
| `/api/audit/**` | `ADMIN`, `BUSINESS_OWNER` | HTTP 403 Forbidden |
| `/api/dashboard/**` | `ADMIN`, `BUSINESS_OWNER` | HTTP 403 Forbidden |
| All other `/api/**` | Any authenticated role | Passed through |

> **Note:** The dashboard currently aggregates data client-side from `/api/products`, `/api/customers`, and `/api/sales-orders`, so the `/api/dashboard` gateway rule primarily affects future dedicated dashboard endpoints.

---

## Frontend Enforcement Points

### 1. Route Guards (`src/routes/AppRoutes.jsx`)

Every route is wrapped in a `<RoleGuard module={MODULES.XXX}>` component that checks the user's role against the permission matrix before rendering the page.

### 2. Sidebar Navigation (`src/components/common/Sidebar.jsx`)

Menu items are conditionally rendered using `checkPermission(user.role, module)`. Users only see navigation links for modules they can access.

### 3. Action Buttons

Create, Edit, and Delete buttons on data tables check `checkPermission(user.role, module, ACTIONS.CREATE)` etc. before rendering, preventing unauthorized actions even if a user reaches the page.

---

## Bug Fixes Applied

### Issue: Business Owner receives "Access Denied" on Dashboard

**Root Cause:** Dual mismatch:
1. Frontend `ROLES.OWNER` was set to `'OWNER'` but backend enum uses `'BUSINESS_OWNER'`
2. Gateway `RoleBasedAccessFilter` only allowed `'ADMIN'` for dashboard access

**Fix:**
- Updated `src/utils/constants.js`: `ROLES.OWNER = 'BUSINESS_OWNER'`
- Updated `RoleBasedAccessFilter.java`: Added `BUSINESS_OWNER` to allowed roles for `/api/dashboard` and `/api/audit`

### Issue: Non-admin roles receive 500 errors

**Root Cause:** Gateway routes only exist for Auth, Product, and Sales services. Requests to non-existent services (Inventory, Manufacturing, Purchase, etc.) return 404/500 from the gateway.

**Resolution:** Frontend service layers for offline modules (Purchase, Manufacturing, Inventory, Procurement, BOM) continue to use localStorage mockDb as the data source. Only modules with live backends (Products, Sales/Customers, Auth) use direct API calls.
