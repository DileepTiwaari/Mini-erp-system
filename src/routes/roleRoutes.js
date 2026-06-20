// src/routes/roleRoutes.js
// Route authorization metadata for FlowERP.
// Binds route patterns to necessary module permissions.

import { MODULES } from '../permissions/permissions';

export const routeRoleMap = {
  '/dashboard': { module: MODULES.DASHBOARD },
  '/users': { module: MODULES.USERS },
  '/products': { module: MODULES.PRODUCTS },
  '/sales-orders': { module: MODULES.SALES },
  '/purchase-orders': { module: MODULES.PURCHASE },
  '/vendors': { module: MODULES.PURCHASE }, // Vendors fall under purchase module
  '/bom': { module: MODULES.MANUFACTURING }, // BOM is under manufacturing
  '/manufacturing-orders': { module: MODULES.MANUFACTURING },
  '/inventory': { module: MODULES.INVENTORY },
  '/procurement': { module: MODULES.PROCUREMENT },
  '/audit-logs': { module: MODULES.AUDIT },
  '/reports': { module: MODULES.REPORTS },
};
export default routeRoleMap;
