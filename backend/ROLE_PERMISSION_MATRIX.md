# ROLE PERMISSION MATRIX — FlowERP Frontend

**Date:** 2026-06-21  
**Status:** FIXED — BUSINESS_OWNER role now resolves correctly

---

## Issue Found & Fixed

**Root Cause:** `constants.js` defined `ROLES.OWNER = 'OWNER'` but the backend JWT payload sends `role: 'BUSINESS_OWNER'`.  
The `PERMISSION_MATRIX` key was `[ROLES.OWNER]` = `'OWNER'`.  
`checkPermission('BUSINESS_OWNER', 'dashboard')` → lookup `PERMISSION_MATRIX['BUSINESS_OWNER']` → `undefined` → `false` → "Access Denied".

**Fix Applied:**
1. `constants.js`: Changed `OWNER: 'OWNER'` → `BUSINESS_OWNER: 'BUSINESS_OWNER'` (with backward-compat alias `OWNER: 'BUSINESS_OWNER'`)
2. `permissions.js`: Changed `[ROLES.OWNER]` → `[ROLES.BUSINESS_OWNER]` in `PERMISSION_MATRIX`
3. `LoginForm.jsx`: Updated demo user panel — changed `role: 'OWNER'` → `role: 'BUSINESS_OWNER'`

---

## Role → Module → Actions Matrix

Legend: `V` = View, `C` = Create, `E` = Edit, `D` = Delete, `-` = No Access

| Module | ADMIN | BUSINESS_OWNER | SALES_USER | PURCHASE_USER | MANUFACTURING_USER | INVENTORY_MANAGER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | V | V | V | V | V | V |
| **Products** | V,C,E,D | V,C,E,D | V | V | V | V |
| **Categories** | V,C,E,D | V,C,E,D | V | V | V | V |
| **Sales Orders** | V,C,E,D | V | V,C,E,D | - | - | - |
| **Customers** | V,C,E,D | V | V,C,E,D | - | - | - |
| **Purchase Orders** | V,C,E,D | V | - | V,C,E,D | - | - |
| **Vendors** | V,C,E,D | V | - | V,C,E,D | - | - |
| **Manufacturing** | V,C,E,D | V | - | - | V,C,E,D | - |
| **BOM** | V,C,E,D | V | - | - | V,C,E,D | - |
| **Work Orders** | V,C,E,D | V | - | - | V,C,E,D | - |
| **Inventory** | V,C,E,D | V | - | - | - | V,C,E,D |
| **Procurement** | V,C,E,D | V | - | - | - | V,C,E,D |
| **Users** | V,C,E,D | - | - | - | - | - |
| **Audit Logs** | V | V | - | - | - | - |

---

## Sidebar Visibility Per Role

| Role | Visible Sidebar Items |
|---|---|
| `ADMIN` | Dashboard, Products, Sales Orders, Customers, Purchase Orders, Vendors, Manufacturing, Work Orders, BOM, Inventory, Procurement, Users, Audit Logs |
| `BUSINESS_OWNER` | Dashboard, Products (view), Sales (view), Purchases (view), Manufacturing (view), Inventory (view), Audit Logs (view) |
| `SALES_USER` | Dashboard, Products (view), Sales Orders, Customers |
| `PURCHASE_USER` | Dashboard, Products (view), Purchase Orders, Vendors |
| `MANUFACTURING_USER` | Dashboard, Products (view), Manufacturing, Work Orders, BOM |
| `INVENTORY_MANAGER` | Dashboard, Products (view), Inventory, Procurement |

---

## Route Guard Chain

```
AppRoutes.jsx
  └── <ProtectedRoute>  ← checks isAuthenticated (JWT in localStorage)
        └── <RoleGuard module={MODULES.X}>  ← calls checkPermission(user.role, module)
              └── <Page />  ← renders only if permission granted
```

---

## checkPermission Logic

```javascript
// permissions.js
const PERMISSION_MATRIX = {
  ADMIN: { dashboard: ['view', 'create', 'edit', 'delete'], ... },
  BUSINESS_OWNER: { dashboard: ['view'], ... },  // ← NOW FIXED (was 'OWNER' key)
  SALES_USER: { ... },
  PURCHASE_USER: { ... },
  MANUFACTURING_USER: { ... },
  INVENTORY_MANAGER: { ... },
};

export const checkPermission = (role, module, action = ACTIONS.VIEW) => {
  const perms = PERMISSION_MATRIX[role];
  if (!perms) return false;          // ← BUSINESS_OWNER now finds its entry
  const allowed = perms[module];
  if (!allowed) return false;
  return allowed.includes(action);
};
```
