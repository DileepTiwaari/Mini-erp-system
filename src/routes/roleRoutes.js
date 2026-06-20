// src/routes/roleRoutes.js
// 
// WHAT IT DOES:
// Defines a lookup map binding application path routes (e.g. `/sales-orders`) to their 
// required module permissions (e.g. `MODULES.SALES`).
// 
// WHY IT IS REQUIRED:
// 1. Decouples path definitions from guard checking code: adding a new route doesn't require modifying guard scripts.
// 2. Improves scalability by mapping layout directories to access configurations cleanly.
// 3. Centralizes route access constraints for clean reviews.
// 
// WHEN IT IS USED:
// Read by the Sidebar to verify if a user's role allows showing navigation nodes, and by route managers.

import { MODULES } from '../permissions/permissions';

/**
 * WHAT IT DOES: Lookup map containing module descriptors per path endpoint.
 * WHY IT IS REQUIRED: Feeds access validators with required checks for each route.
 * WHEN IT IS USED: Referenced by router files to verify navigation constraints.
 */
export const routeRoleMap = {
  '/dashboard': { module: MODULES.DASHBOARD },
  '/users': { module: MODULES.USERS },
  '/products': { module: MODULES.PRODUCTS },
  '/sales-orders': { module: MODULES.SALES },
  '/purchase-orders': { module: MODULES.PURCHASE },
  '/vendors': { module: MODULES.PURCHASE }, // Vendors fall under purchase module
  '/boms': { module: MODULES.MANUFACTURING }, // BOM is under manufacturing, updated to plural /boms
  '/manufacturing-orders': { module: MODULES.MANUFACTURING },
  '/inventory': { module: MODULES.INVENTORY },
  '/procurement': { module: MODULES.PROCUREMENT },
  '/audit-logs': { module: MODULES.AUDIT },
  '/reports': { module: MODULES.REPORTS },
};

export default routeRoleMap;
