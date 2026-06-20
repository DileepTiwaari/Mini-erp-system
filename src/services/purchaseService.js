// src/services/purchaseService.js
// Purchase Orders and Vendors service layer.

import purchaseApi from '../api/purchaseApi';
import vendorApi from '../api/vendorApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const purchaseService = {
  getPurchaseOrders: async () => {
    try {
      const res = await purchaseApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.PURCHASES);
    }
  },

  getPurchaseOrderById: async (id) => {
    try {
      const res = await purchaseApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.PURCHASES, id);
    }
  },

  createPurchaseOrder: async (data) => {
    try {
      const res = await purchaseApi.create(data);
      return res.data;
    } catch (e) {
      const totalAmount = (data.items || []).reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
      const doc = {
        orderNumber: `PO-00${Math.floor(200 + Math.random() * 900)}`,
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount,
        status: 'draft',
        ...data,
      };

      if (doc.status === 'completed') {
        purchaseService.adjustInventoryForPurchase(doc);
      }

      return mockDb.insert(DB_KEYS.PURCHASES, doc);
    }
  },

  updatePurchaseOrder: async (id, data) => {
    try {
      const res = await purchaseApi.update(id, data);
      return res.data;
    } catch (e) {
      const oldOrder = mockDb.getById(DB_KEYS.PURCHASES, id);

      let totalAmount = oldOrder.totalAmount;
      if (data.items) {
        totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
      }

      const updated = {
        totalAmount,
        ...data
      };

      // If status changes to completed, add items to stock
      if (oldOrder.status !== 'completed' && data.status === 'completed') {
        purchaseService.adjustInventoryForPurchase({ ...oldOrder, ...updated });
      }

      return mockDb.update(DB_KEYS.PURCHASES, id, updated);
    }
  },

  deletePurchaseOrder: async (id) => {
    try {
      await purchaseApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.PURCHASES, id);
    }
  },

  adjustInventoryForPurchase: (po) => {
    try {
      const items = po.items || [];
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);

      items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const newStock = prod.stock + item.quantity;
          mockDb.update(DB_KEYS.PRODUCTS, prod.id, { stock: newStock });

          // Log to Stock Movement Ledger
          mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
            productId: prod.id,
            type: 'in',
            quantity: item.quantity,
            reference: po.orderNumber,
            timestamp: new Date().toISOString()
          });
        }
      });
    } catch (err) {
      console.error('Failed inventory receipt for PO', err);
    }
  },

  // Vendor Sub-APIs
  getVendors: async () => {
    try {
      const res = await vendorApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.VENDORS);
    }
  },

  getVendorById: async (id) => {
    try {
      const res = await vendorApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.VENDORS, id);
    }
  },

  createVendor: async (data) => {
    try {
      const res = await vendorApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.VENDORS, data);
    }
  },

  updateVendor: async (id, data) => {
    try {
      const res = await vendorApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.VENDORS, id, data);
    }
  },

  deleteVendor: async (id) => {
    try {
      await vendorApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.VENDORS, id);
    }
  }
};

export default purchaseService;
