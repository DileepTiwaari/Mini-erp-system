// src/services/salesService.js
// Sales Orders and Customers service layer.

import salesApi from '../api/salesApi';
import customerApi from '../api/customerApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const salesService = {
  getSalesOrders: async () => {
    try {
      const res = await salesApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.SALES);
    }
  },

  getSalesOrderById: async (id) => {
    try {
      const res = await salesApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.SALES, id);
    }
  },

  createSalesOrder: async (data) => {
    try {
      const res = await salesApi.create(data);
      return res.data;
    } catch (e) {
      // Calculate order total based on line items
      const totalAmount = (data.items || []).reduce((acc, item) => acc + (item.quantity * item.price), 0);
      const doc = {
        orderNumber: `SO-00${Math.floor(100 + Math.random() * 900)}`,
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount,
        status: 'draft',
        ...data,
      };
      
      // Update inventory stock levels if sales order is automatically processed as completed
      if (doc.status === 'completed') {
        salesService.adjustInventoryForSales(doc);
      }
      
      return mockDb.insert(DB_KEYS.SALES, doc);
    }
  },

  updateSalesOrder: async (id, data) => {
    try {
      const res = await salesApi.update(id, data);
      return res.data;
    } catch (e) {
      const oldOrder = mockDb.getById(DB_KEYS.SALES, id);
      
      // Calculate totalAmount if items changed
      let totalAmount = oldOrder.totalAmount;
      if (data.items) {
        totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
      }

      const updated = {
        totalAmount,
        ...data
      };

      // Trigger inventory adjustments if status shifts to completed
      if (oldOrder.status !== 'completed' && data.status === 'completed') {
        salesService.adjustInventoryForSales({ ...oldOrder, ...updated });
      }

      return mockDb.update(DB_KEYS.SALES, id, updated);
    }
  },

  deleteSalesOrder: async (id) => {
    try {
      await salesApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.SALES, id);
    }
  },

  adjustInventoryForSales: (so) => {
    try {
      const items = so.items || [];
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      
      items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          mockDb.update(DB_KEYS.PRODUCTS, prod.id, { stock: newStock });
          
          // Log to Stock Movement ledger
          mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
            productId: prod.id,
            type: 'out',
            quantity: item.quantity,
            reference: so.orderNumber,
            timestamp: new Date().toISOString()
          });
        }
      });
    } catch (err) {
      console.error('Failed inventory deduction for SO', err);
    }
  },

  // Customer sub-apis
  getCustomers: async () => {
    try {
      const res = await customerApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.CUSTOMERS);
    }
  },

  createCustomer: async (data) => {
    try {
      const res = await customerApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.CUSTOMERS, data);
    }
  },

  deleteCustomer: async (id) => {
    try {
      await customerApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.CUSTOMERS, id);
    }
  }
};

export default salesService;
