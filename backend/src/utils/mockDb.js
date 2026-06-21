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
    { id: 'v1', name: 'Apex Metal Corp', code: 'VND-001', contactName: 'John Smith', email: 'sales@apexmetal.com', phone: '555-0220', gstNumber: '27AAAAA1111A1Z1', address: '120 Metalworks Blvd', city: 'Columbus', state: 'Ohio', country: 'USA', status: 'ACTIVE' },
    { id: 'v2', name: 'ElectroParts Distributors', code: 'VND-002', contactName: 'Sarah Jenkins', email: 'orders@electroparts.com', phone: '555-0330', gstNumber: '27BBBBB2222B2Z2', address: '44 Silicon Way', city: 'San Jose', state: 'California', country: 'USA', status: 'ACTIVE' },
    { id: 'v3', name: 'Fastener Direct', code: 'VND-003', contactName: 'Bob Vance', email: 'bob@fastenerdirect.com', phone: '555-0440', gstNumber: '27CCCCC3333C3Z3', address: '99 Thread Lane', city: 'Dallas', state: 'Texas', country: 'USA', status: 'ACTIVE' },
    { id: 'v4', name: 'Global Timber Products', code: 'VND-004', contactName: 'Douglas Miller', email: 'doug@globaltimber.com', phone: '555-0550', gstNumber: '27DDDDD4444D4Z4', address: '18 Lumber Yard Rd', city: 'Seattle', state: 'Washington', country: 'USA', status: 'ACTIVE' },
    { id: 'v5', name: 'Semiconductor Solutions', code: 'VND-005', contactName: 'Clara Oswald', email: 'clara@semisolutions.com', phone: '555-0660', gstNumber: '27EEEEE5555E5Z5', address: '77 Foundry Street', city: 'Austin', state: 'Texas', country: 'USA', status: 'ACTIVE' },
    { id: 'v6', name: 'Precision Motors Corp', code: 'VND-006', contactName: 'Arthur Pendragon', email: 'arthur@precmotors.com', phone: '555-0770', gstNumber: '27FFFFF6666F6Z6', address: '88 Round Table Dr', city: 'Boston', state: 'Massachusetts', country: 'USA', status: 'ACTIVE' },
    { id: 'v7', name: 'Pioneer Industrial Supply', code: 'VND-007', contactName: 'Jack Harkness', email: 'jack@pioneerind.com', phone: '555-0880', gstNumber: '27GGGGG7777G7Z7', address: '101 Torchwood Ave', city: 'Cardiff', state: 'Wales', country: 'UK', status: 'ACTIVE' },
    { id: 'v8', name: 'Titanium Castings Ltd', code: 'VND-008', contactName: 'Martha Jones', email: 'martha@titancast.com', phone: '555-0990', gstNumber: '27HHHHH8888H8Z8', address: '15 Melt Shop Rd', city: 'Pittsburgh', state: 'Pennsylvania', country: 'USA', status: 'ACTIVE' },
    { id: 'v9', name: 'Advanced Hydraulics', code: 'VND-009', contactName: 'Donna Noble', email: 'donna@advhydraulics.com', phone: '555-1100', gstNumber: '27IIIII9999I9Z9', address: '44 Pressure Lane', city: 'Chicago', state: 'Illinois', country: 'USA', status: 'ACTIVE' },
    { id: 'v10', name: 'Eco Packaging Supplies', code: 'VND-010', contactName: 'Rose Tyler', email: 'rose@ecopack.com', phone: '555-1200', gstNumber: '27JJJJJ0000J0Z0', address: '22 Bad Wolf Rd', city: 'Denver', state: 'Colorado', country: 'USA', status: 'INACTIVE' }
  ],
  [DB_KEYS.CUSTOMERS]: [
    { id: 'c1', name: 'Acme Manufacturing Inc', contactName: 'Alice Johnson', email: 'purchasing@acmemfg.com', phone: '555-0550', gstNumber: '27AAAAA1111A1Z1', address: '500 Industrial Pkwy', city: 'Detroit', state: 'Michigan', country: 'USA' },
    { id: 'c2', name: 'Globex Robotics Ltd', contactName: 'Mark Sterling', email: 'logistics@globex.com', phone: '555-0660', gstNumber: '27BBBBB2222B2Z2', address: '77 Innovation Way', city: 'Seattle', state: 'Washington', country: 'USA' },
    { id: 'c3', name: 'Vertex Builders Co', contactName: 'David Miller', email: 'david@vertexbuilders.com', phone: '555-0770', gstNumber: '27CCCCC3333C3Z3', address: '10 Construction Rd', city: 'Miami', state: 'Florida', country: 'USA' },
    { id: 'c4', name: 'Apex Supply Chain', contactName: 'Richard Winters', email: 'richard@apexsupply.com', phone: '555-0880', gstNumber: '27DDDDD4444D4Z4', address: '45 Logistics Blvd', city: 'Cleveland', state: 'Ohio', country: 'USA' },
    { id: 'c5', name: 'Pioneer Electronics', contactName: 'Ada Lovelace', email: 'ada@pioneer.com', phone: '555-0990', gstNumber: '27EEEEE5555E5Z5', address: '101 Semiconductor Way', city: 'San Jose', state: 'California', country: 'USA' },
    { id: 'c6', name: 'Core Woodworking Corp', contactName: 'Tom Sawyer', email: 'tom@corewood.com', phone: '555-1122', gstNumber: '27FFFFF6666F6Z6', address: '12 Lumberjack Lane', city: 'Portland', state: 'Oregon', country: 'USA' },
    { id: 'c7', name: 'Tesla Power Co', contactName: 'Nikola Tesla', email: 'nikola@teslapower.com', phone: '555-3344', gstNumber: '27GGGGG7777G7Z7', address: '88 Alternating Current Ave', city: 'New York', state: 'New York', country: 'USA' },
    { id: 'c8', name: 'Bolt & Fastener Ltd', contactName: 'Henry Ford', email: 'henry@boltsandfasteners.com', phone: '555-5566', gstNumber: '27HHHHH8888H8Z8', address: '190 Assembly Line Rd', city: 'Dearborn', state: 'Michigan', country: 'USA' },
    { id: 'c9', name: 'Horizon Furniture Group', contactName: 'Frank Wright', email: 'frank@horizonfurniture.com', phone: '555-7788', gstNumber: '27IIIII9999I9Z9', address: '340 Architectural Dr', city: 'Chicago', state: 'Illinois', country: 'USA' },
    { id: 'c10', name: 'Smart Systems Inc', contactName: 'Grace Hopper', email: 'grace@smartsystems.com', phone: '555-9900', gstNumber: '27JJJJJ0000J0Z0', address: '56 Compiler Road', city: 'Boston', state: 'Massachusetts', country: 'USA' }
  ],
  [DB_KEYS.SALES]: [
    { id: 'so-101', orderNumber: 'SO-00101', customerId: 'c1', orderDate: '2026-06-10', totalAmount: 2400.00, status: 'fully_delivered', items: [{ productId: 'p1', quantity: 2, price: 1200.00 }], deliveredQty: { p1: 2 }, deliveries: [{ date: '2026-06-12', items: [{ productId: 'p1', quantity: 2 }], remarks: 'Full shipment completed.' }] },
    { id: 'so-102', orderNumber: 'SO-00102', customerId: 'c2', orderDate: '2026-06-11', totalAmount: 1000.00, status: 'confirmed', items: [{ productId: 'p2', quantity: 4, price: 250.00 }] },
    { id: 'so-103', orderNumber: 'SO-00103', customerId: 'c3', orderDate: '2026-06-12', totalAmount: 2700.00, status: 'draft', items: [{ productId: 'p9', quantity: 15, price: 180.00 }] },
    { id: 'so-104', orderNumber: 'SO-00104', customerId: 'c4', orderDate: '2026-06-13', totalAmount: 2500.00, status: 'partially_delivered', items: [{ productId: 'p2', quantity: 10, price: 250.00 }], deliveredQty: { p2: 6 }, deliveries: [{ date: '2026-06-15', items: [{ productId: 'p2', quantity: 6 }], remarks: 'First partial batch shipped.' }] },
    { id: 'so-105', orderNumber: 'SO-00105', customerId: 'c5', orderDate: '2026-06-14', totalAmount: 1200.00, status: 'cancelled', items: [{ productId: 'p1', quantity: 1, price: 1200.00 }] },
    { id: 'so-106', orderNumber: 'SO-00106', customerId: 'c6', orderDate: '2026-06-15', totalAmount: 250.00, status: 'draft', items: [{ productId: 'p3', quantity: 20, price: 12.50 }] },
    { id: 'so-107', orderNumber: 'SO-00107', customerId: 'c7', orderDate: '2026-06-16', totalAmount: 90.00, status: 'confirmed', items: [{ productId: 'p5', quantity: 5, price: 18.00 }] },
    { id: 'so-108', orderNumber: 'SO-00108', customerId: 'c8', orderDate: '2026-06-17', totalAmount: 450.00, status: 'fully_delivered', items: [{ productId: 'p6', quantity: 10, price: 45.00 }], deliveredQty: { p6: 10 }, deliveries: [{ date: '2026-06-18', items: [{ productId: 'p6', quantity: 10 }], remarks: 'Direct courier delivery.' }] },
    { id: 'so-109', orderNumber: 'SO-00109', customerId: 'c9', orderDate: '2026-06-18', totalAmount: 900.00, status: 'confirmed', items: [{ productId: 'p10', quantity: 2, price: 450.00 }] },
    { id: 'so-110', orderNumber: 'SO-00110', customerId: 'c10', orderDate: '2026-06-19', totalAmount: 1050.00, status: 'draft', items: [{ productId: 'p4', quantity: 30, price: 35.00 }] },
    { id: 'so-111', orderNumber: 'SO-00111', customerId: 'c1', orderDate: '2026-06-19', totalAmount: 75.00, status: 'confirmed', items: [{ productId: 'p8', quantity: 5, price: 15.00 }] },
    { id: 'so-112', orderNumber: 'SO-00112', customerId: 'c2', orderDate: '2026-06-20', totalAmount: 540.00, status: 'partially_delivered', items: [{ productId: 'p9', quantity: 3, price: 180.00 }], deliveredQty: { p9: 1 }, deliveries: [{ date: '2026-06-20', items: [{ productId: 'p9', quantity: 1 }], remarks: 'Partial dispatch.' }] },
    { id: 'so-113', orderNumber: 'SO-00113', customerId: 'c3', orderDate: '2026-06-20', totalAmount: 500.00, status: 'draft', items: [{ productId: 'p2', quantity: 2, price: 250.00 }] },
    { id: 'so-114', orderNumber: 'SO-00114', customerId: 'c4', orderDate: '2026-06-21', totalAmount: 80.00, status: 'confirmed', items: [{ productId: 'p7', quantity: 100, price: 0.80 }] },
    { id: 'so-115', orderNumber: 'SO-00115', customerId: 'c5', orderDate: '2026-06-21', totalAmount: 450.00, status: 'cancelled', items: [{ productId: 'p10', quantity: 1, price: 450.00 }] }
  ],
  [DB_KEYS.PURCHASES]: [
    { id: 'po-201', orderNumber: 'PO-00201', vendorId: 'v1', orderDate: '2026-06-10', expectedDate: '2026-06-15', totalAmount: 400.00, status: 'fully_received', items: [{ productId: 'p3', quantity: 50, unitCost: 8.00 }], receivedQty: { p3: 50 }, receipts: [{ date: '2026-06-14', items: [{ productId: 'p3', quantity: 50 }], user: 'System Administrator', remarks: 'Received full batch, matching standard cost.' }] },
    { id: 'po-202', orderNumber: 'PO-00202', vendorId: 'v2', orderDate: '2026-06-11', expectedDate: '2026-06-16', totalAmount: 1000.00, status: 'confirmed', items: [{ productId: 'p5', quantity: 100, unitCost: 10.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-203', orderNumber: 'PO-00203', vendorId: 'v3', orderDate: '2026-06-12', expectedDate: '2026-06-18', totalAmount: 300.00, status: 'partially_received', items: [{ productId: 'p7', quantity: 1000, unitCost: 0.30 }], receivedQty: { p7: 400 }, receipts: [{ date: '2026-06-15', items: [{ productId: 'p7', quantity: 400 }], user: 'System Administrator', remarks: 'First shipment of fasteners.' }] },
    { id: 'po-204', orderNumber: 'PO-00204', vendorId: 'v4', orderDate: '2026-06-13', expectedDate: '2026-06-17', totalAmount: 200.00, status: 'cancelled', items: [{ productId: 'p4', quantity: 10, unitCost: 20.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-205', orderNumber: 'PO-00205', vendorId: 'v5', orderDate: '2026-06-14', expectedDate: '2026-06-20', totalAmount: 250.00, status: 'draft', items: [{ productId: 'p5', quantity: 25, unitCost: 10.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-206', orderNumber: 'PO-00206', vendorId: 'v6', orderDate: '2026-06-15', expectedDate: '2026-06-22', totalAmount: 220.00, status: 'confirmed', items: [{ productId: 'p9', quantity: 2, unitCost: 110.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-207', orderNumber: 'PO-00207', vendorId: 'v7', orderDate: '2026-06-16', expectedDate: '2026-06-21', totalAmount: 150.00, status: 'fully_received', items: [{ productId: 'p7', quantity: 500, unitCost: 0.30 }], receivedQty: { p7: 500 }, receipts: [{ date: '2026-06-19', items: [{ productId: 'p7', quantity: 500 }], user: 'System Administrator', remarks: 'Delivered directly to main warehouse.' }] },
    { id: 'po-208', orderNumber: 'PO-00208', vendorId: 'v8', orderDate: '2026-06-17', expectedDate: '2026-06-22', totalAmount: 300.00, status: 'partially_received', items: [{ productId: 'p6', quantity: 10, unitCost: 30.00 }], receivedQty: { p6: 4 }, receipts: [{ date: '2026-06-19', items: [{ productId: 'p6', quantity: 4 }], user: 'System Administrator', remarks: 'Partial delivery: power modules batch 1.' }] },
    { id: 'po-209', orderNumber: 'PO-00209', vendorId: 'v9', orderDate: '2026-06-18', expectedDate: '2026-06-23', totalAmount: 200.00, status: 'draft', items: [{ productId: 'p8', quantity: 25, unitCost: 8.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-210', orderNumber: 'PO-00210', vendorId: 'v10', orderDate: '2026-06-18', expectedDate: '2026-06-24', totalAmount: 280.00, status: 'cancelled', items: [{ productId: 'p10', quantity: 1, unitCost: 280.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-211', orderNumber: 'PO-00211', vendorId: 'v1', orderDate: '2026-06-19', expectedDate: '2026-06-24', totalAmount: 80.00, status: 'confirmed', items: [{ productId: 'p3', quantity: 10, unitCost: 8.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-212', orderNumber: 'PO-00212', vendorId: 'v2', orderDate: '2026-06-19', expectedDate: '2026-06-25', totalAmount: 300.00, status: 'partially_received', items: [{ productId: 'p5', quantity: 30, unitCost: 10.00 }], receivedQty: { p5: 15 }, receipts: [{ date: '2026-06-20', items: [{ productId: 'p5', quantity: 15 }], user: 'System Administrator', remarks: 'First 15 chips received.' }] },
    { id: 'po-213', orderNumber: 'PO-00213', vendorId: 'v3', orderDate: '2026-06-20', expectedDate: '2026-06-25', totalAmount: 60.00, status: 'fully_received', items: [{ productId: 'p7', quantity: 200, unitCost: 0.30 }], receivedQty: { p7: 200 }, receipts: [{ date: '2026-06-21', items: [{ productId: 'p7', quantity: 200 }], user: 'System Administrator', remarks: 'Bolts delivery matches packing slip.' }] },
    { id: 'po-214', orderNumber: 'PO-00214', vendorId: 'v4', orderDate: '2026-06-20', expectedDate: '2026-06-26', totalAmount: 200.00, status: 'draft', items: [{ productId: 'p4', quantity: 10, unitCost: 20.00 }], receivedQty: {}, receipts: [] },
    { id: 'po-215', orderNumber: 'PO-00215', vendorId: 'v5', orderDate: '2026-06-21', expectedDate: '2026-06-26', totalAmount: 300.00, status: 'confirmed', items: [{ productId: 'p5', quantity: 30, unitCost: 10.00 }], receivedQty: {}, receipts: [] }
  ],
  [DB_KEYS.BOMS]: [
    {
      id: 'bom-301',
      productId: 'p9',
      name: 'Electric Motor 1HP Standard BOM',
      version: '1.0',
      status: 'ACTIVE',
      items: [
        { productId: 'p3', quantity: 2, unit: 'pcs', wastePercent: 5 },
        { productId: 'p6', quantity: 1.5, unit: 'pcs', wastePercent: 10 },
        { productId: 'p7', quantity: 12, unit: 'pcs', wastePercent: 2 },
      ],
      operations: [
        { name: 'Cut casing sheets', workCenterId: 'wc-cutting', durationMinutes: 15, sequence: 10 },
        { name: 'Winding & Assembly', workCenterId: 'wc-assembly', durationMinutes: 30, sequence: 20 },
        { name: 'Quality Check inspection', workCenterId: 'wc-qc', durationMinutes: 10, sequence: 30 },
        { name: 'Packing motor', workCenterId: 'wc-packing', durationMinutes: 5, sequence: 40 },
      ]
    },
    {
      id: 'bom-302',
      productId: 'p10',
      name: 'Industrial Assembly Workbench BOM',
      version: '1.0',
      status: 'ACTIVE',
      items: [
        { productId: 'p4', quantity: 4, unit: 'pcs', wastePercent: 8 },
        { productId: 'p7', quantity: 8, unit: 'pcs', wastePercent: 0 },
      ],
      operations: [
        { name: 'Cut wood panels', workCenterId: 'wc-cutting', durationMinutes: 20, sequence: 10 },
        { name: 'Assemble frame and top', workCenterId: 'wc-assembly', durationMinutes: 40, sequence: 20 },
        { name: 'Paint steel supports', workCenterId: 'wc-painting', durationMinutes: 30, sequence: 30 },
        { name: 'Quality check inspection', workCenterId: 'wc-qc', durationMinutes: 15, sequence: 40 },
        { name: 'Pack bench assembly', workCenterId: 'wc-packing', durationMinutes: 10, sequence: 50 },
      ]
    },
  ],
  [DB_KEYS.WORK_CENTERS]: [
    { id: 'wc-cutting', name: 'Cutting Shop', code: 'WC-CUT', capacity: 4, costPerHour: 40.00, status: 'ACTIVE' },
    { id: 'wc-assembly', name: 'Assembly Line', code: 'WC-ASSY', capacity: 8, costPerHour: 50.00, status: 'ACTIVE' },
    { id: 'wc-painting', name: 'Painting Booth', code: 'WC-PAINT', capacity: 2, costPerHour: 60.00, status: 'ACTIVE' },
    { id: 'wc-qc', name: 'Quality Control Station', code: 'WC-QC', capacity: 3, costPerHour: 45.00, status: 'ACTIVE' },
    { id: 'wc-packing', name: 'Packing Station', code: 'WC-PACK', capacity: 5, costPerHour: 30.00, status: 'ACTIVE' },
  ],
  [DB_KEYS.MANUFACTURING]: [
    { id: 'mo-401', moNumber: 'MO-00401', bomId: 'bom-301', productId: 'p9', quantity: 5, status: 'COMPLETED', plannedStartDate: '2026-06-16', actualEndDate: '2026-06-17', assignee: 'u5' },
    { id: 'mo-402', moNumber: 'MO-00402', bomId: 'bom-302', productId: 'p10', quantity: 50, status: 'IN_PROGRESS', plannedStartDate: '2026-06-19', assignee: 'u5' },
    { id: 'mo-403', moNumber: 'MO-00403', bomId: 'bom-301', productId: 'p9', quantity: 10, status: 'PLANNED', plannedStartDate: '2026-06-25', assignee: 'u5' },
  ],
  [DB_KEYS.WORK_ORDERS]: [
    { id: 'wo-501', moId: 'mo-402', workCenterId: 'wc-cutting', name: 'Cut wood panels', operationOrder: 10, durationPlanned: 20 * 50, status: 'DONE' },
    { id: 'wo-502', moId: 'mo-402', workCenterId: 'wc-assembly', name: 'Assemble frame and top', operationOrder: 20, durationPlanned: 40 * 50, status: 'IN_PROGRESS' },
    { id: 'wo-503', moId: 'mo-402', workCenterId: 'wc-painting', name: 'Paint steel supports', operationOrder: 30, durationPlanned: 30 * 50, status: 'PENDING' },
    { id: 'wo-504', moId: 'mo-402', workCenterId: 'wc-qc', name: 'Quality check inspection', operationOrder: 40, durationPlanned: 15 * 50, status: 'PENDING' },
    { id: 'wo-505', moId: 'mo-402', workCenterId: 'wc-packing', name: 'Pack bench assembly', operationOrder: 50, durationPlanned: 10 * 50, status: 'PENDING' },
  ],
  [DB_KEYS.INVENTORY_LEDGER]: [
    { id: 'il1', productId: 'p3', movementType: 'Purchase Receipt', quantity: 100, reference: 'PO-00201', timestamp: '2026-06-15T10:00:00Z', balanceAfterMovement: 108 },
    { id: 'il2', productId: 'p9', movementType: 'Manufacturing Production', quantity: 5, reference: 'MO-00401', timestamp: '2026-06-17T15:30:00Z', balanceAfterMovement: 9 },
    { id: 'il3', productId: 'p9', movementType: 'Sales Delivery', quantity: 2, reference: 'SO-00101', timestamp: '2026-06-18T14:20:00Z', balanceAfterMovement: 7 },
    { id: 'il4', productId: 'p1', movementType: 'Purchase Receipt', quantity: 10, reference: 'PO-00202', timestamp: '2026-06-19T09:00:00Z', balanceAfterMovement: 25 },
    { id: 'il5', productId: 'p2', movementType: 'Adjustment', quantity: 5, reference: 'Physical Count', timestamp: '2026-06-20T11:00:00Z', balanceAfterMovement: 35 },
  ],
  [DB_KEYS.AUDIT_LOGS]: [
    { id: 'al1', userName: 'System Administrator', module: 'Authentication', action: 'User Login', referenceNumber: '-', description: 'User admin@flowerp.com authenticated successfully (Standalone mode).', timestamp: '2026-06-20T09:20:00Z' },
    { id: 'al2', userName: 'System Administrator', module: 'Sales', action: 'Create Sales Order', referenceNumber: 'SO-00103', description: 'Created SO-00103 draft sales order.', timestamp: '2026-06-20T09:22:00Z' },
    { id: 'al3', userName: 'System Administrator', module: 'Purchase', action: 'Confirm Purchase Order', referenceNumber: 'PO-00201', description: 'Confirmed Purchase Order PO-00201.', timestamp: '2026-06-20T10:15:00Z' },
    { id: 'al4', userName: 'System Administrator', module: 'Manufacturing', action: 'Create Record', referenceNumber: 'MO-00401', description: 'Added new record in manufacturing table.', timestamp: '2026-06-20T11:00:00Z' },
    { id: 'al5', userName: 'System Administrator', module: 'Procurement', action: 'Procurement Trigger', referenceNumber: 'MO-00401', description: 'Auto-generated planned Manufacturing Order MO-00401.', timestamp: '2026-06-20T11:05:00Z' },
    { id: 'al6', userName: 'System Administrator', module: 'Inventory', action: 'Adjustment', referenceNumber: 'ADJ-MANUAL-001', description: 'Manual stock adjustment performed.', timestamp: '2026-06-20T11:30:00Z' },
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
