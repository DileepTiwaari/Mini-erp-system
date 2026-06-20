// src/utils/constants.js
// Global constants for FlowERP application.
// This handles roles, permissions, document statuses, and app-wide configs.

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
};

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
