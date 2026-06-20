/**
 * PURPOSE:
 * Implements business logic operations for vendors, purchase orders, and goods receipts.
 *
 * BUSINESS USE:
 * Orchestrates status transitions of Purchase Orders (RFQ -> Confirmed -> Received/Partial),
 * increments warehouse stock levels when incoming materials are received, logs ledger events,
 * and manages supplier directories, falling back to localStorage mock tables if backend servers are offline.
 *
 * API USAGE:
 * Calls REST client mappings in `purchaseApi` and `vendorApi`.
 *
 * LOGIC FLOW:
 * - `confirmPurchaseOrder`: Transitions status from draft to 'confirmed'.
 * - `receivePurchaseOrder`: Appends shipment parcel details to receipt history logs,
 *   increments physical product stock levels, increments freeToUseQty, and advances PO status
 *   dynamically to 'partially_received' or 'fully_received'.
 * - `cancelPurchaseOrder`: Marks PO status as 'cancelled'.
 * - Centralizes Vendor catalog CRUD operations.
 */

import purchaseApi from '../api/purchaseApi';
import vendorApi from '../api/vendorApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const purchaseService = {
  /**
   * PURPOSE: Fetches all purchase order records.
   * BUSINESS USE: Feeds the main Purchase Orders list grid page.
   * API USAGE: GET /api/v1/purchase-orders
   */
  getPurchaseOrders: async () => {
    try {
      const res = await purchaseApi.getPurchaseOrders();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.PURCHASES);
    }
  },

  /**
   * PURPOSE: Fetches a single purchase order record by ID.
   * BUSINESS USE: Displays detailed products lists and receipts log in the overlay card.
   * API USAGE: GET /api/v1/purchase-orders/{id}
   */
  getPurchaseOrderById: async (id) => {
    try {
      const res = await purchaseApi.getPurchaseOrderById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.PURCHASES, id);
    }
  },

  /**
   * PURPOSE: Creates a new Purchase RFQ quotation.
   * BUSINESS USE: Registers a new draft procurement request with tax and grand totals.
   * API USAGE: POST /api/v1/purchase-orders
   */
  createPurchaseOrder: async (data) => {
    try {
      const res = await purchaseApi.createPurchaseOrder(data);
      return res.data;
    } catch (e) {
      const orderTotal = (data.items || []).reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
      const taxTotal = Number((orderTotal * 0.18).toFixed(2));
      const grandTotal = Number((orderTotal + taxTotal).toFixed(2));

      const doc = {
        orderNumber: `PO-00${Math.floor(200 + Math.random() * 900)}`,
        orderDate: data.orderDate || new Date().toISOString().split('T')[0],
        expectedDate: data.expectedDate || '',
        totalAmount: grandTotal, // map totalAmount to grandTotal for list page consistency
        orderTotal,
        taxTotal,
        grandTotal,
        status: data.status || 'draft',
        items: data.items || [],
        receivedQty: {},
        receipts: [],
        ...data,
      };

      return mockDb.insert(DB_KEYS.PURCHASES, doc);
    }
  },

  /**
   * PURPOSE: Updates details of a draft Purchase RFQ.
   * BUSINESS USE: Edits quantities, costs, or dates before order is confirmed.
   * API USAGE: PUT /api/v1/purchase-orders/{id}
   */
  updatePurchaseOrder: async (id, data) => {
    try {
      const res = await purchaseApi.updatePurchaseOrder(id, data);
      return res.data;
    } catch (e) {
      const oldOrder = mockDb.getById(DB_KEYS.PURCHASES, id);
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
        totalAmount: grandTotal, // keep totalAmount mapped to grandTotal
      };

      return mockDb.update(DB_KEYS.PURCHASES, id, updated);
    }
  },

  /**
   * PURPOSE: Confirms a purchase quotation.
   * BUSINESS USE: Submits the PO to the supplier, locking costs and expected dates.
   * API USAGE: POST /api/v1/purchase-orders/{id}/confirm
   */
  confirmPurchaseOrder: async (id) => {
    try {
      const res = await purchaseApi.confirmPurchaseOrder(id);
      return res.data;
    } catch (e) {
      const order = mockDb.getById(DB_KEYS.PURCHASES, id);
      if (!order) throw new Error('Purchase Order not found');

      mockDb.logAudit('Confirm Purchase Order', `Confirmed Purchase Order ${order.orderNumber}.`, 'Purchase', order.orderNumber);
      return mockDb.update(DB_KEYS.PURCHASES, id, { ...order, status: 'confirmed' });
    }
  },

  /**
   * PURPOSE: Cancels an active or draft Purchase Order.
   * BUSINESS USE: Halts active procurements.
   * API USAGE: POST /api/v1/purchase-orders/{id}/cancel
   */
  cancelPurchaseOrder: async (id) => {
    try {
      const res = await purchaseApi.cancelPurchaseOrder(id);
      return res.data;
    } catch (e) {
      const order = mockDb.getById(DB_KEYS.PURCHASES, id);
      if (!order) throw new Error('Purchase Order not found');

      mockDb.logAudit('Cancel Purchase Order', `Cancelled Purchase Order ${order.orderNumber}.`, 'Purchase', order.orderNumber);
      return mockDb.update(DB_KEYS.PURCHASES, id, { ...order, status: 'cancelled' });
    }
  },

  /**
   * PURPOSE: Logs incoming materials, updates inventory stock, and advances status.
   * BUSINESS USE: Core logistics intake handler, supporting full or partial shipments.
   * API USAGE: POST /api/v1/purchase-orders/{id}/receive
   */
  receivePurchaseOrder: async (id, receiptData) => {
    try {
      const res = await purchaseApi.receivePurchaseOrder(id, receiptData);
      return res.data;
    } catch (e) {
      const order = mockDb.getById(DB_KEYS.PURCHASES, id);
      if (!order) throw new Error('Purchase Order not found');

      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      const receivedItems = receiptData.items || [];
      const currentReceivedMap = order.receivedQty || {};

      // 1. Loop through received lines, incrementing stock and updating moving averages
      receivedItems.forEach((rItem) => {
        const prod = products.find((p) => p.id === rItem.productId);
        if (prod && rItem.quantity > 0) {
          const qty = rItem.quantity;
          const stock = prod.stock + qty;
          const reservedQty = prod.reservedQty || 0;
          const freeToUseQty = stock - reservedQty;

          // Perform inventory stock level update
          mockDb.update(DB_KEYS.PRODUCTS, prod.id, { stock, freeToUseQty });

          // Record entry inside the stock ledger
          mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
            productId: prod.id,
            type: 'in',
            quantity: qty,
            reference: order.orderNumber,
            timestamp: new Date().toISOString(),
          });

          // Accumulate received quantities map
          currentReceivedMap[rItem.productId] = (currentReceivedMap[rItem.productId] || 0) + qty;
        }
      });

      // 2. Append receipt payload to PO history
      const newReceipts = order.receipts || [];
      newReceipts.push({
        date: receiptData.receiptDate || new Date().toISOString().split('T')[0],
        items: receivedItems,
        remarks: receiptData.remarks || 'Goods received successfully.',
        user: receiptData.user || 'System Administrator',
      });

      // 3. Evaluate total quantity to map status transitions
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

      mockDb.logAudit('Goods Receipt', `Processed goods receipt entry for PO ${order.orderNumber}.`, 'Purchase', order.orderNumber);
      return mockDb.update(DB_KEYS.PURCHASES, id, updatedOrder);
    }
  },

  /**
   * PURPOSE: Deletes a draft Purchase RFQ from the workspace.
   * BUSINESS USE: Prunes unwanted draft documents.
   * API USAGE: DELETE /api/v1/purchase-orders/{id}
   */
  deletePurchaseOrder: async (id) => {
    try {
      await purchaseApi.deletePurchaseOrder(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.PURCHASES, id);
    }
  },

  // ==========================================
  // VENDOR SUPPLIERS CATALOG SERVICE HELPERS
  // ==========================================

  /**
   * PURPOSE: Fetches all registered vendor profiles.
   */
  getVendors: async () => {
    try {
      const res = await vendorApi.getVendors();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.VENDORS);
    }
  },

  /**
   * PURPOSE: Fetches details for a single vendor by ID.
   */
  getVendorById: async (id) => {
    try {
      const res = await vendorApi.getVendorById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.VENDORS, id);
    }
  },

  /**
   * PURPOSE: Registers a new vendor supplier.
   */
  createVendor: async (data) => {
    try {
      const res = await vendorApi.createVendor(data);
      return res.data;
    } catch (e) {
      const code = `VND-0${Math.floor(100 + Math.random() * 900)}`;
      const doc = {
        code,
        status: data.status || 'ACTIVE',
        ...data,
      };
      return mockDb.insert(DB_KEYS.VENDORS, doc);
    }
  },

  /**
   * PURPOSE: Updates a vendor's details (phone, email, status).
   */
  updateVendor: async (id, data) => {
    try {
      const res = await vendorApi.updateVendor(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.VENDORS, id, data);
    }
  },

  /**
   * PURPOSE: Deletes a vendor supplier profile.
   */
  deleteVendor: async (id) => {
    try {
      await vendorApi.deleteVendor(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.VENDORS, id);
    }
  },
};

export default purchaseService;
