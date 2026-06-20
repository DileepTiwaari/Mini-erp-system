// src/permissions/permissions.js
// Role and Permission Matrix for FlowERP.
// Provides checkPermissions logic to enforce Role-Based Access Control (RBAC).

import { ROLES } from '../utils/constants';

// Action names mapping
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
};

// Module names mapping
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

// Permissions configurations per role
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
  [ROLES.MANAGER]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [ACTIONS.VIEW], // Manager can see users list but not modify
    [MODULES.PRODUCTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.SALES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.PURCHASE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.MANUFACTURING]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.INVENTORY]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.PROCUREMENT]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.AUDIT]: [], // No access to audit logs
    [MODULES.REPORTS]: [ACTIONS.VIEW],
  },
  [ROLES.STAFF]: {
    [MODULES.DASHBOARD]: [ACTIONS.VIEW],
    [MODULES.USERS]: [], // Staff cannot view users list
    [MODULES.PRODUCTS]: [ACTIONS.VIEW], // View only
    [MODULES.SALES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT], // Staff can take sales orders
    [MODULES.PURCHASE]: [ACTIONS.VIEW], // View only
    [MODULES.MANUFACTURING]: [ACTIONS.VIEW, ACTIONS.CREATE], // Operational entries
    [MODULES.INVENTORY]: [ACTIONS.VIEW], // View stock level
    [MODULES.PROCUREMENT]: [ACTIONS.VIEW],
    [MODULES.AUDIT]: [],
    [MODULES.REPORTS]: [],
  },
};

/**
 * Validates if a user role can perform an action in a module
 * @param {string} role 
 * @param {string} module 
 * @param {string} action 
 * @returns {boolean}
 */
export const checkPermission = (role, module, action = ACTIONS.VIEW) => {
  if (!role || !module) return false;
  
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return false;
  
  const moduleActions = rolePermissions[module];
  if (!moduleActions) return false;
  
  return moduleActions.includes(action);
};
