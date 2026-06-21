// src/services/demoDataService.js
// Business logic data layer helper for the "Demo Data Presentation Mode".
// Enables interactive CRUD operations that persist in localStorage for offline modules.

import demoData from '../utils/demo_data.json';
import storage from '../utils/storage';

export const DEMO_KEYS = {
  VENDORS: 'demo_vendors',
  PURCHASES: 'demo_purchases',
  BOMS: 'demo_boms',
  MANUFACTURING: 'demo_manufacturing',
  WORK_ORDERS: 'demo_work_orders',
  INVENTORY_LEDGER: 'demo_inventory_ledger',
  AUDIT_LOGS: 'demo_audit_logs',
  PROCUREMENT_RECS: 'demo_procurement_recs',
  SHORTAGE_ALERTS: 'demo_shortage_alerts',
  WORK_CENTERS: 'demo_work_centers'
};

export const initDemoDb = () => {
  if (!storage.get(DEMO_KEYS.VENDORS)) {
    storage.set(DEMO_KEYS.VENDORS, demoData.vendors);
  }
  if (!storage.get(DEMO_KEYS.PURCHASES)) {
    storage.set(DEMO_KEYS.PURCHASES, demoData.purchaseOrders);
  }
  if (!storage.get(DEMO_KEYS.BOMS)) {
    storage.set(DEMO_KEYS.BOMS, demoData.boms);
  }
  if (!storage.get(DEMO_KEYS.MANUFACTURING)) {
    storage.set(DEMO_KEYS.MANUFACTURING, demoData.manufacturingOrders);
  }
  if (!storage.get(DEMO_KEYS.WORK_ORDERS)) {
    storage.set(DEMO_KEYS.WORK_ORDERS, demoData.workOrders);
  }
  if (!storage.get(DEMO_KEYS.INVENTORY_LEDGER)) {
    storage.set(DEMO_KEYS.INVENTORY_LEDGER, demoData.inventoryLedger);
  }
  if (!storage.get(DEMO_KEYS.AUDIT_LOGS)) {
    storage.set(DEMO_KEYS.AUDIT_LOGS, demoData.auditLogs);
  }
  if (!storage.get(DEMO_KEYS.PROCUREMENT_RECS)) {
    storage.set(DEMO_KEYS.PROCUREMENT_RECS, demoData.procurementRecommendations);
  }
  if (!storage.get(DEMO_KEYS.SHORTAGE_ALERTS)) {
    storage.set(DEMO_KEYS.SHORTAGE_ALERTS, demoData.shortageAlerts);
  }
  if (!storage.get(DEMO_KEYS.WORK_CENTERS)) {
    storage.set(DEMO_KEYS.WORK_CENTERS, [
      { id: 'wc-assembly', name: 'Assembly Station 1', code: 'WC-ASSEMBLY', status: 'ACTIVE' },
      { id: 'wc-testing', name: 'Testing Lab', code: 'WC-TESTING', status: 'ACTIVE' },
      { id: 'wc-packaging', name: 'Packaging Unit', code: 'WC-PACKAGING', status: 'ACTIVE' }
    ]);
  }
};

export const demoDb = {
  getAll: (key) => {
    initDemoDb();
    return storage.get(key) || [];
  },
  getById: (key, id) => {
    const list = demoDb.getAll(key);
    return list.find(item => item.id === id);
  },
  insert: (key, item) => {
    const list = demoDb.getAll(key);
    const newItem = { id: Math.random().toString(36).substring(2, 9), ...item };
    list.unshift(newItem);
    storage.set(key, list);
    return newItem;
  },
  update: (key, id, updatedFields) => {
    const list = demoDb.getAll(key);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updatedFields };
    storage.set(key, list);
    return list[index];
  },
  delete: (key, id) => {
    const list = demoDb.getAll(key);
    const filtered = list.filter(item => item.id !== id);
    storage.set(key, filtered);
    return true;
  },
  logAudit: (action, description, moduleName = '', referenceNumber = '') => {
    const user = storage.get('auth_user') || { name: 'Demo User' };
    const logs = demoDb.getAll(DEMO_KEYS.AUDIT_LOGS);
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      userName: user.name,
      module: moduleName || 'System',
      action,
      referenceNumber: referenceNumber || '-',
      description,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    storage.set(DEMO_KEYS.AUDIT_LOGS, logs);
  }
};

export default demoDb;
