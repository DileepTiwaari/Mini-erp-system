// src/services/purchaseService.js
// Implements business logic operations for vendors, purchase orders, and goods receipts.
// Gracefully falls back to demoDb when the live backend is offline.

import purchaseApi from '../api/purchaseApi';
import vendorApi from '../api/vendorApi';
import productService from './productService';
import { demoDb, DEMO_KEYS } from './demoDataService';

export const purchaseService = {
  getPurchaseOrders: async () => {
    try {
      const res = await purchaseApi.getPurchaseOrders();
      return res.data;
    } catch (e) {
      return demoDb.getAll(DEMO_KEYS.PURCHASES);
    }
  },

  getPurchaseOrderById: async (id) => {
    try {
      const res = await purchaseApi.getPurchaseOrderById(id);
      return res.data;
    } catch (e) {
      return demoDb.getById(DEMO_KEYS.PURCHASES, id);
    }
  },

  createPurchaseOrder: async (data) => {
    try {
      const res = await purchaseApi.createPurchaseOrder(data);
      return res.data;
    } catch (e) {
      const orderTotal = (data.items || []).reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
      const taxTotal = Number((orderTotal * 0.18).toFixed(2));
      const grandTotal = Number((orderTotal + taxTotal).toFixed(2));

      const doc = {
        orderNumber: `PO-002${Math.floor(31 + Math.random() * 69)}`,
        orderDate: data.orderDate || new Date().toISOString().split('T')[0],
        expectedDate: data.expectedDate || '',
        totalAmount: grandTotal,
        orderTotal,
        taxTotal,
        grandTotal,
        status: data.status || 'draft',
        items: data.items || [],
        receivedQty: {},
        receipts: [],
        ...data,
      };

      demoDb.logAudit('Create Purchase Order', `Drafted new PO ${doc.orderNumber}.`, 'Purchase', doc.orderNumber);
      return demoDb.insert(DEMO_KEYS.PURCHASES, doc);
    }
  },

  updatePurchaseOrder: async (id, data) => {
    try {
      const res = await purchaseApi.updatePurchaseOrder(id, data);
      return res.data;
    } catch (e) {
      const oldOrder = demoDb.getById(DEMO_KEYS.PURCHASES, id);
      if (!oldOrder) throw new Error('Purchase Order not found');

      let orderTotal = oldOrder.orderTotal || 0;
      let taxTotal = oldOrder.taxTotal || 0;
      let grandTotal = oldOrder.grandTotal || 0;

      if (data.items) {
        orderTotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
        taxTotal = Number((orderTotal * 0.18).toFixed(2));
        grandTotal = Number((orderTotal + taxTotal).toFixed(2));
      }

      const updated = {
        ...oldOrder,
        ...data,
        orderTotal,
        taxTotal,
        grandTotal,
        totalAmount: grandTotal,
      };

      return demoDb.update(DEMO_KEYS.PURCHASES, id, updated);
    }
  },

  confirmPurchaseOrder: async (id) => {
    try {
      const res = await purchaseApi.confirmPurchaseOrder(id);
      return res.data;
    } catch (e) {
      const order = demoDb.getById(DEMO_KEYS.PURCHASES, id);
      if (!order) throw new Error('Purchase Order not found');

      demoDb.logAudit('Confirm Purchase Order', `Confirmed Purchase Order ${order.orderNumber}.`, 'Purchase', order.orderNumber);
      return demoDb.update(DEMO_KEYS.PURCHASES, id, { ...order, status: 'confirmed' });
    }
  },

  cancelPurchaseOrder: async (id) => {
    try {
      const res = await purchaseApi.cancelPurchaseOrder(id);
      return res.data;
    } catch (e) {
      const order = demoDb.getById(DEMO_KEYS.PURCHASES, id);
      if (!order) throw new Error('Purchase Order not found');

      demoDb.logAudit('Cancel Purchase Order', `Cancelled Purchase Order ${order.orderNumber}.`, 'Purchase', order.orderNumber);
      return demoDb.update(DEMO_KEYS.PURCHASES, id, { ...order, status: 'cancelled' });
    }
  },

  receivePurchaseOrder: async (id, receiptData) => {
    try {
      const res = await purchaseApi.receivePurchaseOrder(id, receiptData);
      return res.data;
    } catch (e) {
      const order = demoDb.getById(DEMO_KEYS.PURCHASES, id);
      if (!order) throw new Error('Purchase Order not found');

      const receivedItems = receiptData.items || [];
      const currentReceivedMap = order.receivedQty || {};

      // Loop through received lines, incrementing stock and updating moving averages
      for (const rItem of receivedItems) {
        if (rItem.quantity > 0) {
          try {
            const prod = await productService.getProductById(rItem.productId);
            if (prod) {
              const qty = rItem.quantity;
              const stock = (prod.stock || 0) + qty;
              const reservedQty = prod.reservedQty || 0;
              const freeToUseQty = stock - reservedQty;

              // Perform inventory stock level update
              await productService.updateProduct(prod.id, { stock, freeToUseQty });

              // Record entry inside the stock ledger
              demoDb.insert(DEMO_KEYS.INVENTORY_LEDGER, {
                productId: prod.id,
                movementType: 'Purchase Receipt',
                type: 'in',
                quantity: qty,
                reference: order.orderNumber,
                timestamp: new Date().toISOString(),
                balanceAfterMovement: stock
              });
            }
          } catch (err) {
            console.warn('[Purchase] Could not adjust product stock on receipt.', err.message);
          }
          currentReceivedMap[rItem.productId] = (currentReceivedMap[rItem.productId] || 0) + rItem.quantity;
        }
      }

      const newReceipts = order.receipts || [];
      newReceipts.push({
        date: receiptData.receiptDate || new Date().toISOString().split('T')[0],
        items: receivedItems,
        remarks: receiptData.remarks || 'Goods received successfully.',
        user: receiptData.user || 'System Administrator',
      });

      let totalOrdered = 0;
      let totalReceived = 0;

      (order.items || []).forEach((item) => {
        totalOrdered += item.quantity;
        totalReceived += (currentReceivedMap[item.productId] || 0);
      });

      let nextStatus = 'confirmed';
      if (totalReceived >= totalOrdered) {
        nextStatus = 'fully_received';
      } else if (totalReceived > 0) {
        nextStatus = 'partially_received';
      }

      const updatedOrder = {
        ...order,
        status: nextStatus,
        receivedQty: currentReceivedMap,
        receipts: newReceipts,
      };

      demoDb.logAudit('Goods Receipt', `Processed goods receipt entry for PO ${order.orderNumber}.`, 'Purchase', order.orderNumber);
      return demoDb.update(DEMO_KEYS.PURCHASES, id, updatedOrder);
    }
  },

  deletePurchaseOrder: async (id) => {
    try {
      await purchaseApi.deletePurchaseOrder(id);
      return true;
    } catch (e) {
      return demoDb.delete(DEMO_KEYS.PURCHASES, id);
    }
  },

  getVendors: async () => {
    try {
      const res = await vendorApi.getVendors();
      return res.data;
    } catch (e) {
      return demoDb.getAll(DEMO_KEYS.VENDORS);
    }
  },

  getVendorById: async (id) => {
    try {
      const res = await vendorApi.getVendorById(id);
      return res.data;
    } catch (e) {
      return demoDb.getById(DEMO_KEYS.VENDORS, id);
    }
  },

  createVendor: async (data) => {
    try {
      const res = await vendorApi.createVendor(data);
      return res.data;
    } catch (e) {
      const code = `VND-0${Math.floor(21 + Math.random() * 79)}`;
      const doc = {
        code,
        status: data.status || 'ACTIVE',
        ...data,
      };
      return demoDb.insert(DEMO_KEYS.VENDORS, doc);
    }
  },

  updateVendor: async (id, data) => {
    try {
      const res = await vendorApi.updateVendor(id, data);
      return res.data;
    } catch (e) {
      return demoDb.update(DEMO_KEYS.VENDORS, id, data);
    }
  },

  deleteVendor: async (id) => {
    try {
      await vendorApi.deleteVendor(id);
      return true;
    } catch (e) {
      return demoDb.delete(DEMO_KEYS.VENDORS, id);
    }
  },
};

export default purchaseService;
