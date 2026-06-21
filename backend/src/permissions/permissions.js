// src/permissions/permissions.js
// 
// WHAT IT DOES:
// Defines the Role-Based Access Control (RBAC) authorization matrix. It maps specific 
// roles to their permitted modules and granular operations (view, create, edit, delete).
// 
// WHY IT IS REQUIRED:
// 1. Enforces security boundaries: prevents regular staff from accessing administrative views.
// 2. Improves usability: allows the UI to automatically hide actions (like "Add Product") if the user is unauthorized.
// 3. Centralizes security rules in a single, auditable logic sheet.
// 
// WHEN IT IS USED:
// Executed by the RoleGuard route gate during path transitions, by the Sidebar to filter navigation links,
// and by form components to conditionally hide or show action buttons (e.g. edit/delete).

import { ROLES } from '../utils/constants';

/**
 * WHAT IT DOES: Lists the standard CRUD actions supported in the application.
 * WHY IT IS REQUIRED: Avoids string discrepancies when checking permissions.
 * WHEN IT IS USED: During permission checks to verify if a user can edit, create, or delete a record.
 */
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
};

/**
 * WHAT IT DOES: Defines the functional modules of the ERP system.
 * WHY IT IS REQUIRED: Allows linking permission rules to specific segments of the application.
 * WHEN IT IS USED: In route parameters and permission matrix arrays.
 */
export const MODULES = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  PRODUCTS: 'products',
  SALES: 'sales',
  PURCHASE: 'purchase',
  MANUFACTURING: 'manufacturing',
  INVENTORY: 'inventory',
  PROCUREMENT: 'procurement',
  AUDIT: 'audit',
  REPORTS: 'reports',
};

/**
 * WHAT IT DOES: The master security table mapping roles to their allowed module actions.
 * WHY IT IS REQUIRED: Serves as the single source of truth for RBAC evaluations.
 * WHEN IT IS USED: Read by checkPermission function when validating user roles.
 */
const PERMISSION_MATRIX = {
  [ROLES.ADMIN]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.PRODUCTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.SALES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.PURCHASE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.MANUFACTURING]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.INVENTORY]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.PROCUREMENT]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.AUDIT]: [ACTIONS.VIEW],
    [MODULES.REPORTS]: [ACTIONS.VIEW],
  },
  [ROLES.BUSINESS_OWNER]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.PRODUCTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.SALES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.PURCHASE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.MANUFACTURING]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.INVENTORY]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.PROCUREMENT]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.AUDIT]: [ACTIONS.VIEW],
    [MODULES.REPORTS]: [ACTIONS.VIEW],
  },
  [ROLES.SALES_USER]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [], // Unauthorized
    [MODULES.PRODUCTS]: [ACTIONS.VIEW], // Can only view
    [MODULES.SALES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Complete sales access except deletion
    [MODULES.PURCHASE]: [],
    [MODULES.MANUFACTURING]: [],
    [MODULES.INVENTORY]: [ACTIONS.VIEW], // View stock availability
    [MODULES.PROCUREMENT]: [],
    [MODULES.AUDIT]: [],
    [MODULES.REPORTS]: [],
  },
  [ROLES.PURCHASE_USER]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [],
    [MODULES.PRODUCTS]: [ACTIONS.VIEW],
    [MODULES.SALES]: [],
    [MODULES.PURCHASE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Purchase order creation
    [MODULES.MANUFACTURING]: [],
    [MODULES.INVENTORY]: [ACTIONS.VIEW],
    [MODULES.PROCUREMENT]: [ACTIONS.VIEW], // Procurement alerts viewing
    [MODULES.AUDIT]: [],
    [MODULES.REPORTS]: [],
  },
  [ROLES.MANUFACTURING_USER]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [],
    [MODULES.PRODUCTS]: [ACTIONS.VIEW],
    [MODULES.SALES]: [],
    [MODULES.PURCHASE]: [],
    [MODULES.MANUFACTURING]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Active work orders processing
    [MODULES.INVENTORY]: [ACTIONS.VIEW],
    [MODULES.PROCUREMENT]: [],
    [MODULES.AUDIT]: [],
    [MODULES.REPORTS]: [],
  },
  [ROLES.INVENTORY_MANAGER]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [],
    [MODULES.PRODUCTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Inventory manager configures catalogs
    [MODULES.SALES]: [],
    [MODULES.PURCHASE]: [ACTIONS.VIEW], // Review incoming shipments
    [MODULES.MANUFACTURING]: [ACTIONS.VIEW],
    [MODULES.INVENTORY]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Manual adjustments
    [MODULES.PROCUREMENT]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Handles reorders recommendations
    [MODULES.AUDIT]: [],
    [MODULES.REPORTS]: [ACTIONS.VIEW],
  },
};

/**
 * WHAT IT DOES: Core function checking if a user role can perform an action in a module.
 * WHY IT IS REQUIRED: Allows decoupled evaluations of roles and permissions in guards and sidebars.
 * WHEN IT IS USED: Checked dynamically on page loads, routing transitions, and UI element rendering.
 * 
 * @param {string} role - The user's active system role
 * @param {string} module - The targeted module identifier
 * @param {string} action - The action type to validate (default: VIEW)
 * @returns {boolean} True if permission is granted
 */
export const checkPermission = (role, module, action = ACTIONS.VIEW) => {
  if (!role || !module) return false;
  
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return false;
  
  const moduleActions = rolePermissions[module];
  if (!moduleActions) return false;
  
  return moduleActions.includes(action);
};
