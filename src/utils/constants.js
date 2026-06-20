// src/utils/constants.js
// 
// WHAT IT DOES: 
// This file serves as the centralized repository for all app-wide configuration constants. 
// It defines user security roles, status indicator colors (Tailwind class combinations), 
// and backend REST API route path endpoints.
// 
// WHY IT IS REQUIRED:
// 1. Prevents hardcoding strings across multiple files, reducing syntax errors.
// 2. Simplifies future updates; for example, changing a status color only needs to be edited here.
// 3. Unifies security roles so that both route guards and UI menus check identical strings.
// 
// WHEN IT IS USED:
// It is imported and read whenever roles need to be evaluated (RBAC), whenever order status 
// badges are rendered, and whenever services fetch data from specific backend endpoints.

/**
 * WHAT IT DOES: Defines the official security roles for user authorization.
 * WHY IT IS REQUIRED: Directs the permission manager on what modules and actions are allowed.
 * WHEN IT IS USED: During login processing, route guarding, and menu filtering.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  SALES_USER: 'SALES_USER',
  PURCHASE_USER: 'PURCHASE_USER',
  MANUFACTURING_USER: 'MANUFACTURING_USER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER'
};

/**
 * WHAT IT DOES: Maps database status strings to corresponding Tailwind border/text/background CSS classes.
 * WHY IT IS REQUIRED: Ensures UI tables and badge elements render consistent colors for status indications.
 * WHEN IT IS USED: Used by the StatusBadge component when formatting state columns in data grids.
 */
export const STATUS_COLORS = {
  // Sales & Purchase Orders
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',

  // Stock
  in_stock: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  low_stock: 'bg-amber-50 text-amber-700 border-amber-200',
  out_of_stock: 'bg-rose-50 text-rose-700 border-rose-200',

  // Manufacturing / Work Orders
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blocked: 'bg-rose-50 text-rose-700 border-rose-200'
};

/**
 * WHAT IT DOES: Maps functional areas to backend REST API route path endpoints.
 * WHY IT IS REQUIRED: Ensures Axios service requests are sent to correct backend endpoints.
 * WHEN IT IS USED: Imported and invoked inside individual API files (e.g. salesApi, authApi).
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: '/users',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  VENDORS: '/vendors',
  CUSTOMERS: '/customers',
  SALES: '/sales',
  PURCHASES: '/purchases',
  BOM: '/bom',
  WORK_CENTERS: '/work-centers',
  MANUFACTURING: '/manufacturing',
  WORK_ORDERS: '/work-orders',
  INVENTORY: '/inventory',
  PROCUREMENT: '/procurement',
  AUDIT: '/audit-logs',
  DASHBOARD: '/dashboard',
};
