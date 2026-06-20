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

/**
 * WHAT IT DOES: Holds standard demo data to seed the mock database tables if they are empty.
 * WHY IT IS REQUIRED: Provides realistic business data (products, BOMs, customers) for demonstration.
 * WHEN IT IS USED: Read when initializing the local mock database tables.
 */
const INITIAL_DATA = {
  [DB_KEYS.USERS]: [
    { id: 'u1', name: 'System Administrator', email: 'admin@flowerp.com', role: ROLES.ADMIN, phone: '555-0100', active: true },
    { id: 'u2', name: 'Business Owner', email: 'owner@flowerp.com', role: ROLES.OWNER, phone: '555-0101', active: true },
    { id: 'u3', name: 'Sales Representative', email: 'sales@flowerp.com', role: ROLES.SALES_USER, phone: '555-0102', active: true },
    { id: 'u4', name: 'Procurement Specialist', email: 'purchase@flowerp.com', role: ROLES.PURCHASE_USER, phone: '555-0103', active: true },
    { id: 'u5', name: 'Shop Floor Operator', email: 'mfg@flowerp.com', role: ROLES.MANUFACTURING_USER, phone: '555-0104', active: true },
    { id: 'u6', name: 'Inventory Controller', email: 'inventory@flowerp.com', role: ROLES.INVENTORY_MANAGER, phone: '555-0105', active: true },
  ],
  [DB_KEYS.CATEGORIES]: [
    { id: 'cat1', name: 'Electronics', code: 'ELE' },
    { id: 'cat2', name: 'Furniture', code: 'FUR' },
    { id: 'cat3', name: 'Raw Materials', code: 'RAW' },
  ],
  [DB_KEYS.PRODUCTS]: [
    { id: 'p1', name: 'Laptop Pro 15', code: 'FG-LAP-01', categoryId: 'cat1', price: 1200.00, cost: 800.00, stock: 15, reservedQty: 2, freeToUseQty: 13, minStock: 5, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v2', bomId: null, status: 'active', description: 'High performance corporate laptops' },
    { id: 'p2', name: 'Ergonomic Office Chair', code: 'FG-CHR-02', categoryId: 'cat2', price: 250.00, cost: 150.00, stock: 35, reservedQty: 5, freeToUseQty: 30, minStock: 10, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v1', bomId: null, status: 'active', description: 'Ergonomic lumbar support mesh chairs' },
    { id: 'p3', name: 'Steel Sheet 2mm', code: 'RM-STL-02', categoryId: 'cat3', price: 12.50, cost: 8.00, stock: 8, reservedQty: 0, freeToUseQty: 8, minStock: 20, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v1', bomId: null, status: 'active', description: 'Heavy duty raw steel sheeting' },
    { id: 'p4', name: 'Oak Wood Board', code: 'RM-OAK-04', categoryId: 'cat3', price: 35.00, cost: 20.00, stock: 5, reservedQty: 0, freeToUseQty: 5, minStock: 15, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v3', bomId: null, status: 'active', description: 'Premium solid oak wood planks' },
    { id: 'p5', name: 'LED Controller Board', code: 'RM-LED-05', categoryId: 'cat1', price: 18.00, cost: 10.00, stock: 120, reservedQty: 20, freeToUseQty: 100, minStock: 40, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v2', bomId: null, status: 'active', description: 'Smart LED driver microcontrollers' },
    { id: 'p6', name: 'Industrial Power Supply 24V', code: 'RM-PWR-06', categoryId: 'cat1', price: 45.00, cost: 30.00, stock: 50, reservedQty: 10, freeToUseQty: 40, minStock: 15, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v2', bomId: null, status: 'active', description: 'Enclosed 24V power modules' },
    { id: 'p7', name: 'M8 Hex Bolt 40mm', code: 'RM-BLT-07', categoryId: 'cat3', price: 0.80, cost: 0.30, stock: 1500, reservedQty: 300, freeToUseQty: 1200, minStock: 500, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v3', bomId: null, status: 'active', description: 'Threaded standard steel industrial fasteners' },
    { id: 'p8', name: 'Pine Wood Board', code: 'RM-PIN-08', categoryId: 'cat3', price: 15.00, cost: 8.00, stock: 90, reservedQty: 0, freeToUseQty: 90, minStock: 30, uom: 'pcs', procurementType: 'PURCHASE', procurementStrategy: 'MTS', vendorId: 'v3', bomId: null, status: 'active', description: 'Raw pine timber boards' },
    { id: 'p9', name: 'Electric Motor 1HP', code: 'FG-MTR-01', categoryId: 'cat1', price: 180.00, cost: 110.00, stock: 4, reservedQty: 2, freeToUseQty: 2, minStock: 8, uom: 'pcs', procurementType: 'MANUFACTURING', procurementStrategy: 'MTO', vendorId: null, bomId: 'bom-301', status: 'active', description: 'Standard 1HP electric induction motor' },
    { id: 'p10', name: 'Assembly Workbench', code: 'FG-WKB-10', categoryId: 'cat2', price: 450.00, cost: 280.00, stock: 12, reservedQty: 1, freeToUseQty: 11, minStock: 3, uom: 'pcs', procurementType: 'MANUFACTURING', procurementStrategy: 'MTO', vendorId: null, bomId: 'bom-302', status: 'active', description: 'Heavy duty industrial assembly benches' },
  ],
  [DB_KEYS.VENDORS]: [
    { id: 'v1', name: 'Apex Metal Corp', contactName: 'John Smith', email: 'sales@apexmetal.com', phone: '555-0220', address: '120 Metalworks Blvd, Ohio' },
    { id: 'v2', name: 'ElectroParts Distributors', contactName: 'Sarah Jenkins', email: 'orders@electroparts.com', phone: '555-0330', address: '44 Silicon Way, California' },
    { id: 'v3', name: 'Fastener Direct', contactName: 'Bob Vance', email: 'bob@fastenerdirect.com', phone: '555-0440', address: '99 Thread Lane, Texas' },
  ],
  [DB_KEYS.CUSTOMERS]: [
    { id: 'c1', name: 'Acme Manufacturing Inc', contactName: 'Alice Johnson', email: 'purchasing@acmemfg.com', phone: '555-0550', address: '500 Industrial Pkwy, Michigan' },
    { id: 'c2', name: 'Globex Robotics Ltd', contactName: 'Mark Sterling', email: 'logistics@globex.com', phone: '555-0660', address: '77 Innovation Way, Seattle' },
    { id: 'c3', name: 'Vertex Builders Co', contactName: 'David Miller', email: 'david@vertexbuilders.com', phone: '555-0770', address: '10 Construction Rd, Florida' },
  ],
  [DB_KEYS.SALES]: [
    { id: 'so-101', orderNumber: 'SO-00101', customerId: 'c1', orderDate: '2026-06-18', totalAmount: 1800.00, status: 'completed', items: [{ productId: 'p9', quantity: 10, price: 180.00 }] },
    { id: 'so-102', orderNumber: 'SO-00102', customerId: 'c2', orderDate: '2026-06-19', totalAmount: 700.00, status: 'pending', items: [{ productId: 'p10', quantity: 20, price: 35.00 }] },
    { id: 'so-103', orderNumber: 'SO-00103', customerId: 'c3', orderDate: '2026-06-20', totalAmount: 540.00, status: 'draft', items: [{ productId: 'p9', quantity: 3, price: 180.00 }] },
  ],
  [DB_KEYS.PURCHASES]: [
    { id: 'po-201', orderNumber: 'PO-00201', vendorId: 'v1', orderDate: '2026-06-15', totalAmount: 800.00, status: 'completed', items: [{ productId: 'p3', quantity: 100, unitCost: 8.00 }] },
    { id: 'po-202', orderNumber: 'PO-00202', vendorId: 'v2', orderDate: '2026-06-19', totalAmount: 600.00, status: 'approved', items: [{ productId: 'p5', quantity: 20, unitCost: 30.00 }] },
    { id: 'po-203', orderNumber: 'PO-00203', vendorId: 'v3', orderDate: '2026-06-20', totalAmount: 150.00, status: 'draft', items: [{ productId: 'p7', quantity: 500, unitCost: 0.30 }] },
  ],
  [DB_KEYS.BOMS]: [
    { id: 'bom-301', productId: 'p9', name: 'Electric Motor 1HP Standard BOM', items: [
      { productId: 'p3', quantity: 2 }, // 2 Steel sheets
      { productId: 'p6', quantity: 1.5 }, // 1.5 kg Copper winding
      { productId: 'p7', quantity: 12 }, // 12 M8 Bolts
    ]},
    { id: 'bom-302', productId: 'p10', name: 'Industrial Assembly Workbench BOM', items: [
      { productId: 'p4', quantity: 4 }, // 4 Oak Wood Boards
      { productId: 'p7', quantity: 8 }, // 8 M8 Bolts
    ]},
  ],
  [DB_KEYS.WORK_CENTERS]: [
    { id: 'wc1', name: 'Metal Shearing Shop', code: 'WC-SHEAR', costPerHour: 45.00, capacity: 5 },
    { id: 'wc2', name: 'Coil Winding Station', code: 'WC-WIND', costPerHour: 55.00, capacity: 2 },
    { id: 'wc3', name: 'Final Assembly Line', code: 'WC-ASSY', costPerHour: 60.00, capacity: 8 },
  ],
  [DB_KEYS.MANUFACTURING]: [
    { id: 'mo-401', moNumber: 'MO-00401', bomId: 'bom-301', productId: 'p9', quantity: 5, status: 'done', plannedStartDate: '2026-06-16', actualEndDate: '2026-06-17' },
    { id: 'mo-402', moNumber: 'MO-00402', bomId: 'bom-302', productId: 'p10', quantity: 50, status: 'in_progress', plannedStartDate: '2026-06-19' },
    { id: 'mo-403', moNumber: 'MO-00403', bomId: 'bom-301', productId: 'p9', quantity: 10, status: 'planned', plannedStartDate: '2026-06-25' },
  ],
  [DB_KEYS.WORK_ORDERS]: [
    { id: 'wo-501', moId: 'mo-402', workCenterId: 'wc1', name: 'Shear steel plates', operationOrder: 1, durationPlanned: 120, status: 'done' },
    { id: 'wo-502', moId: 'mo-402', workCenterId: 'wc3', name: 'Fasten & assemble workbench', operationOrder: 2, durationPlanned: 180, status: 'in_progress' },
  ],
  [DB_KEYS.INVENTORY_LEDGER]: [
    { id: 'il1', productId: 'p3', type: 'in', quantity: 100, reference: 'PO-00201', timestamp: '2026-06-15T10:00:00Z' },
    { id: 'il2', productId: 'p9', type: 'in', quantity: 5, reference: 'MO-00401', timestamp: '2026-06-17T15:30:00Z' },
    { id: 'il3', productId: 'p9', type: 'out', quantity: 10, reference: 'SO-00101', timestamp: '2026-06-18T14:20:00Z' },
  ],
  [DB_KEYS.AUDIT_LOGS]: [
    { id: 'al1', userName: 'System Admin', action: 'User Login', description: 'User admin@flowerp.com logged in successfully.', timestamp: '2026-06-20T09:20:00Z' },
    { id: 'al2', userName: 'System Admin', action: 'Create Sales Order', description: 'Created SO-00103 draft sales order.', timestamp: '2026-06-20T09:22:00Z' },
  ],
};

/**
 * WHAT IT DOES: Seeding function that writes initial mock data collections into local storage
 * if they are completely empty.
 * WHY IT IS REQUIRED: Guarantees that the application starts with sample records to show instead of a blank screen.
 * WHEN IT IS USED: Automatically triggered inside of database actions before retrieving tables.
 */
export const initMockDb = () => {
  Object.keys(INITIAL_DATA).forEach((key) => {
    if (!storage.get(key)) {
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
    initMockDb();
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
      mockDb.logAudit('Create Record', `Added new record in ${key.replace('db_', '')} table.`);
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
    
    list[index] = { ...list[index], ...updatedFields };
    storage.set(key, list);
    
    if (key !== DB_KEYS.AUDIT_LOGS) {
      mockDb.logAudit('Update Record', `Modified record ID ${id} in ${key.replace('db_', '')} table.`);
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
    const filtered = list.filter((item) => item.id !== id);
    storage.set(key, filtered);
    
    if (key !== DB_KEYS.AUDIT_LOGS) {
      mockDb.logAudit('Delete Record', `Deleted record ID ${id} from ${key.replace('db_', '')} table.`);
    }
    return true;
  },
  
  /**
   * WHAT IT DOES: Records a system event under the audit log table.
   * WHY IT IS REQUIRED: Tracks actions of logged in users for ERP compliance and trace audits.
   * WHEN IT IS USED: Inside update, insert, delete, and login routines.
   */
  logAudit: (action, description) => {
    const user = storage.get('auth_user') || { name: 'Anonymous' };
    const logs = storage.get(DB_KEYS.AUDIT_LOGS) || [];
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      userName: user.name,
      action,
      description,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    storage.set(DB_KEYS.AUDIT_LOGS, logs);
  }
};

export { DB_KEYS };
