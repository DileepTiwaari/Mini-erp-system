// src/utils/mockDb.js
// 
// WHAT IT DOES:
// Serves as the client-side mock relational database. It stores, queries, inserts, 
// updates, and deletes records in localStorage, simulating a persistent backend API.
// 
// WHY IT IS REQUIRED:
// 1. Enables developers to run the application fully standalone without running an active API backend server.
// 2. Holds user session details and transactional data persistently across page refreshes.
// 3. Simulates automatic system operations (like adjusting inventory quantities when sales orders complete).
// 
// WHEN IT IS USED:
// Loaded on application start to populate initial mock data. Invoked inside service layers
// (authService, productService, salesService, etc.) to read/write active records.

import storage from './storage';
import { ROLES } from './constants';
import INITIAL_DATA_JSON from './initial_mock_data.json';

/**
 * WHAT IT DOES: Binds table keys to standardized labels for storage lookups.
 * WHY IT IS REQUIRED: Ensures database calls reference consistent names in localStorage.
 * WHEN IT IS USED: Used in all database accessor operations (getAll, insert, delete).
 */
const DB_KEYS = {
  USERS: 'db_users',
  PRODUCTS: 'db_products',
  CATEGORIES: 'db_categories',
  VENDORS: 'db_vendors',
  CUSTOMERS: 'db_customers',
  SALES: 'db_sales',
  PURCHASES: 'db_purchases',
  BOMS: 'db_boms',
  WORK_CENTERS: 'db_work_centers',
  MANUFACTURING: 'db_manufacturing',
  WORK_ORDERS: 'db_work_orders',
  INVENTORY_LEDGER: 'db_inventory_ledger',
  AUDIT_LOGS: 'db_audit_logs',
};

const KEY_TO_MODULE = {
  [DB_KEYS.USERS]: 'Authentication',
  [DB_KEYS.PRODUCTS]: 'Inventory',
  [DB_KEYS.CATEGORIES]: 'Inventory',
  [DB_KEYS.VENDORS]: 'Purchase',
  [DB_KEYS.CUSTOMERS]: 'Sales',
  [DB_KEYS.SALES]: 'Sales',
  [DB_KEYS.PURCHASES]: 'Purchase',
  [DB_KEYS.BOMS]: 'Manufacturing',
  [DB_KEYS.WORK_CENTERS]: 'Manufacturing',
  [DB_KEYS.MANUFACTURING]: 'Manufacturing',
  [DB_KEYS.WORK_ORDERS]: 'Manufacturing',
  [DB_KEYS.INVENTORY_LEDGER]: 'Inventory',
};

/**
 * WHAT IT DOES: Holds standard demo data to seed the mock database tables if they are empty.
 * WHY IT IS REQUIRED: Provides realistic business data (products, BOMs, customers) for demonstration.
 * WHEN IT IS USED: Read when initializing the local mock database tables.
 */
const INITIAL_DATA = {
  [DB_KEYS.USERS]: INITIAL_DATA_JSON.users,
  [DB_KEYS.CATEGORIES]: INITIAL_DATA_JSON.categories,
  [DB_KEYS.PRODUCTS]: INITIAL_DATA_JSON.products,
  [DB_KEYS.VENDORS]: INITIAL_DATA_JSON.vendors,
  [DB_KEYS.CUSTOMERS]: INITIAL_DATA_JSON.customers,
  [DB_KEYS.SALES]: INITIAL_DATA_JSON.sales,
  [DB_KEYS.PURCHASES]: INITIAL_DATA_JSON.purchases,
  [DB_KEYS.BOMS]: INITIAL_DATA_JSON.boms,
  [DB_KEYS.WORK_CENTERS]: INITIAL_DATA_JSON.work_centers,
  [DB_KEYS.MANUFACTURING]: INITIAL_DATA_JSON.manufacturing,
  [DB_KEYS.WORK_ORDERS]: INITIAL_DATA_JSON.work_orders,
  [DB_KEYS.INVENTORY_LEDGER]: INITIAL_DATA_JSON.inventory_ledger,
  [DB_KEYS.AUDIT_LOGS]: INITIAL_DATA_JSON.audit_logs,
};

/**
 * WHAT IT DOES: Seeding function that writes initial mock data collections into local storage
 * if they are completely empty, or if we need to force-seed the demo dataset (e.g. user count < 300).
 * WHY IT IS REQUIRED: Guarantees that the application starts with sample records to show instead of a blank screen.
 * WHEN IT IS USED: Automatically triggered inside of database actions before retrieving tables.
 */
export const initMockDb = () => {
  const existingUsers = storage.get(DB_KEYS.USERS);
  const forceReset = !existingUsers || existingUsers.length < 300;

  Object.keys(INITIAL_DATA).forEach((key) => {
    if (forceReset || !storage.get(key)) {
      storage.set(key, INITIAL_DATA[key]);
    }
  });
};

/**
 * WHAT IT DOES: Collection of helper methods simulating database operations.
 * WHY IT IS REQUIRED: Allows services to query and update local state consistently.
 * WHEN IT IS USED: Triggered whenever lists are fetched, records are added, or records are edited.
 */
export const mockDb = {
  /**
   * WHAT IT DOES: Reads a full table collection from localStorage.
   * WHY IT IS REQUIRED: Feeds list tables and search elements in pages.
   * WHEN IT IS USED: Every time products, orders, or users lists load.
   */
  getAll: (key) => {
    return storage.get(key) || [];
  },
  
  /**
   * WHAT IT DOES: Finds a specific item inside a table by ID.
   * WHY IT IS REQUIRED: Feeds the overlay details panel in grids.
   * WHEN IT IS USED: When clicking "View Details" on tables.
   */
  getById: (key, id) => {
    const list = mockDb.getAll(key);
    return list.find((item) => item.id === id);
  },
  
  /**
   * WHAT IT DOES: appends a new item to a local storage list, auto-generating a unique ID and audit log entry.
   * WHY IT IS REQUIRED: Allows users to add items (e.g. Products, Sales Orders) dynamically in standalone mode.
   * WHEN IT IS USED: When submitting create forms.
   */
  insert: (key, item) => {
    const list = mockDb.getAll(key);
    const newItem = { id: Math.random().toString(36).substring(2, 9), ...item };
    list.push(newItem);
    storage.set(key, list);
    
    if (key !== DB_KEYS.AUDIT_LOGS) {
      const moduleName = KEY_TO_MODULE[key] || 'System';
      const referenceNumber = newItem.orderNumber || newItem.moNumber || newItem.reference || newItem.code || newItem.id || '-';
      mockDb.logAudit('Create Record', `Added new record in ${key.replace('db_', '')} table.`, moduleName, referenceNumber);
    }
    
    return newItem;
  },
  
  /**
   * WHAT IT DOES: Overwrites fields for a specific item in a local storage list.
   * WHY IT IS REQUIRED: Enables operational flow changes (e.g. approving POs or changing WO statuses).
   * WHEN IT IS USED: When submitting edit forms or triggering workflow changes.
   */
  update: (key, id, updatedFields) => {
    const list = mockDb.getAll(key);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    
    const oldItem = list[index];
    list[index] = { ...list[index], ...updatedFields };
    storage.set(key, list);
    
    if (key !== DB_KEYS.AUDIT_LOGS) {
      const moduleName = KEY_TO_MODULE[key] || 'System';
      const referenceNumber = oldItem.orderNumber || oldItem.moNumber || oldItem.reference || oldItem.code || id || '-';
      mockDb.logAudit('Update Record', `Modified record ID ${id} in ${key.replace('db_', '')} table.`, moduleName, referenceNumber);
    }
    
    return list[index];
  },
  
  /**
   * WHAT IT DOES: Removes an item from a table by ID.
   * WHY IT IS REQUIRED: Cleans up records and supports delete actions.
   * WHEN IT IS USED: On click delete buttons.
   */
  delete: (key, id) => {
    const list = mockDb.getAll(key);
    const index = list.findIndex((item) => item.id === id);
    let oldItem = null;
    if (index !== -1) {
      oldItem = list[index];
    }
    const filtered = list.filter((item) => item.id !== id);
    storage.set(key, filtered);
    
    if (key !== DB_KEYS.AUDIT_LOGS) {
      const moduleName = KEY_TO_MODULE[key] || 'System';
      const referenceNumber = oldItem ? (oldItem.orderNumber || oldItem.moNumber || oldItem.reference || oldItem.code || id) : id;
      mockDb.logAudit('Delete Record', `Deleted record ID ${id} from ${key.replace('db_', '')} table.`, moduleName, referenceNumber);
    }
    return true;
  },
  
  /**
   * WHAT IT DOES: Records a system event under the audit log table.
   * WHY IT IS REQUIRED: Tracks actions of logged in users for ERP compliance and trace audits.
   * WHEN IT IS USED: Inside update, insert, delete, and login routines.
   */
  logAudit: (action, description, moduleName = '', referenceNumber = '') => {
    const user = storage.get('auth_user') || { name: 'System Administrator' };
    const logs = storage.get(DB_KEYS.AUDIT_LOGS) || [];
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      userName: user.name,
      module: moduleName || 'System',
      action,
      referenceNumber: referenceNumber || '-',
      description,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    storage.set(DB_KEYS.AUDIT_LOGS, logs);
  }
};

export { DB_KEYS };
