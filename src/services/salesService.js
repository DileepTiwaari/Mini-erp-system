/**
 * PURPOSE:
 * Implements business logic operations for customers, sales orders, and shipments.
 *
 * BUSINESS USE:
 * Orchestrates stock reservation on order confirmation, stock deduction and timeline logs
 * on deliveries, reservation releases on cancellation, and customer profile CRUD, falling
 * back to localStorage mock tables if backend servers are offline.
 *
 * API USAGE:
 * Calls REST methods in `salesApi` and `customerApi`.
 *
 * LOGIC EXPLANATION:
 * - `confirmSalesOrder`: Increases product `reservedQty` by ordered quantities to lock stock.
 * - `processSalesOrderDelivery`: Receives target shipment quantities, logs delivery logs,
 *   deducts stock and reservedQty levels, and maps order status (`PARTIALLY_DELIVERED` vs `FULLY_DELIVERED`).
 * - `cancelSalesOrder`: Releases remaining stock reservations.
 */

import salesApi from '../api/salesApi';
import customerApi from '../api/customerApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const salesService = {
  /**
   * PURPOSE: Fetches all sales orders.
   * BUSINESS USE: Populates order datatables on the sales board.
   * API USAGE: GET /api/v1/sales-orders
   * LOGIC EXPLANATION: Queries REST API, falling back to mockDb local sales array on error.
   */
  getSalesOrders: async () => {
    try {
      const res = await salesApi.getOrders();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.SALES);
    }
  },

  /**
   * PURPOSE: Fetches a single sales order by ID.
   * BUSINESS USE: Inspects line items, delivery logs, and totals.
   * API USAGE: GET /api/v1/sales-orders/{id}
   * LOGIC EXPLANATION: Queries API by ID, falling back to mockDb sales row on error.
   */
  getSalesOrderById: async (id) => {
    try {
      const res = await salesApi.getOrderById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.SALES, id);
    }
  },

  /**
   * PURPOSE: Creates a new sales order quotation.
   * BUSINESS USE: Registers a new draft sales order, auto-calculating totals.
   * API USAGE: POST /api/v1/sales-orders
   * LOGIC EXPLANATION: Submits validated lines. In mock fallback, computes totals,
   * generates standard number SO-XXXXX, and defaults status to 'draft'.
   */
  createSalesOrder: async (data) => {
    try {
      const res = await salesApi.createOrder(data);
      return res.data;
    } catch (e) {
      const totalAmount = (data.items || []).reduce((acc, item) => acc + (item.quantity * item.price), 0);
      const doc = {
        orderNumber: `SO-00${Math.floor(100 + Math.random() * 900)}`,
        orderDate: data.orderDate || new Date().toISOString().split('T')[0],
        totalAmount,
        status: data.status || 'draft',
        items: data.items || [],
        deliveries: [],
        deliveredQty: {},
        ...data,
      };
      
      // If initialized directly as confirmed, handle reservations
      if (doc.status === 'confirmed') {
        salesService.reserveStockForOrder(doc);
      }
      
      return mockDb.insert(DB_KEYS.SALES, doc);
    }
  },

  /**
   * PURPOSE: Modifies sales order lines or fields.
   * BUSINESS USE: Edits draft or pending quotations.
   * API USAGE: PUT /api/v1/sales-orders/{id}
   * LOGIC EXPLANATION: Standard PUT mapping. In fallback, recalculates total values.
   */
  updateSalesOrder: async (id, data) => {
    try {
      const res = await salesApi.updateOrder(id, data);
      return res.data;
    } catch (e) {
      const oldOrder = mockDb.getById(DB_KEYS.SALES, id);
      let totalAmount = oldOrder.totalAmount;
      if (data.items) {
        totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
      }

      const updated = {
        ...oldOrder,
        ...data,
        totalAmount,
      };

      // Handle stock reservation transition
      if (oldOrder.status !== 'confirmed' && updated.status === 'confirmed') {
        salesService.reserveStockForOrder(updated);
      }

      return mockDb.update(DB_KEYS.SALES, id, updated);
    }
  },

  /**
   * PURPOSE: Cancels a sales order.
   * BUSINESS USE: Halts active orders and releases reserved stock back to free availability.
   * API USAGE: POST /api/v1/sales-orders/{id}/cancel
   * LOGIC EXPLANATION: Hits cancel API. In local fallback, releases reservations and tags order as 'cancelled'.
   */
  cancelSalesOrder: async (id) => {
    try {
      const res = await salesApi.cancelOrder(id);
      return res.data;
    } catch (e) {
      const order = mockDb.getById(DB_KEYS.SALES, id);
      if (order.status === 'confirmed' || order.status === 'partially_delivered') {
        salesService.releaseStockForOrder(order);
      }
      return mockDb.update(DB_KEYS.SALES, id, { ...order, status: 'cancelled' });
    }
  },

  /**
   * PURPOSE: Confirms a draft sales order.
   * BUSINESS USE: Locks order prices and reserves stock to ensure availability.
   * API USAGE: POST /api/v1/sales-orders/{id}/confirm
   * LOGIC EXPLANATION: Hits confirm API. In local fallback, reserves stock and tags order as 'confirmed'.
   */
  confirmSalesOrder: async (id) => {
    try {
      const res = await salesApi.confirmOrder(id);
      return res.data;
    } catch (e) {
      const order = mockDb.getById(DB_KEYS.SALES, id);
      salesService.reserveStockForOrder(order);
      return mockDb.update(DB_KEYS.SALES, id, { ...order, status: 'confirmed' });
    }
  },

  /**
   * PURPOSE: Deletes a sales order.
   * BUSINESS USE: Clears draft orders from database.
   * API USAGE: DELETE /api/v1/sales-orders/{id}
   * LOGIC EXPLANATION: Standard DELETE request. In local fallback, removes order row.
   */
  deleteSalesOrder: async (id) => {
    try {
      await salesApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.SALES, id);
    }
  },

  // Stock Reservation Helpers

  reserveStockForOrder: (order) => {
    const products = mockDb.getAll(DB_KEYS.PRODUCTS);
    const items = order.items || [];
    items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const reservedQty = (prod.reservedQty || 0) + item.quantity;
        const freeToUseQty = prod.stock - reservedQty;
        mockDb.update(DB_KEYS.PRODUCTS, prod.id, { reservedQty, freeToUseQty });
      }
    });
  },

  releaseStockForOrder: (order) => {
    const products = mockDb.getAll(DB_KEYS.PRODUCTS);
    const items = order.items || [];
    const delivered = order.deliveredQty || {};
    items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const alreadyDelivered = delivered[item.productId] || 0;
        const remainingReserved = Math.max(0, item.quantity - alreadyDelivered);
        const reservedQty = Math.max(0, (prod.reservedQty || 0) - remainingReserved);
        const freeToUseQty = prod.stock - reservedQty;
        mockDb.update(DB_KEYS.PRODUCTS, prod.id, { reservedQty, freeToUseQty });
      }
    });
  },

  // Delivery Execution Logic

  /**
   * PURPOSE: Registers a shipment parcel against order items and updates inventory levels.
   * BUSINESS USE: Tracks partial/full shipments, records dates, and deducts physical stock.
   * API USAGE: POST /api/v1/sales-orders/{id}/deliver
   * LOGIC EXPLANATION:
   * - Saves new delivery row in order's deliveries history array.
   * - Deducts delivered quantities from product stock counts and reservedQty counts.
   * - Computes sum of delivered items vs ordered items to map order status to partial/fully delivered.
   */
  processSalesOrderDelivery: async (id, deliveryDetails) => {
    // Falls back to mockDb operations
    const order = mockDb.getById(DB_KEYS.SALES, id);
    if (!order) throw new Error('Order not found');

    const products = mockDb.getAll(DB_KEYS.PRODUCTS);
    const deliveredItems = deliveryDetails.items || []; // Array of { productId, quantity }
    const currentDeliveredMap = order.deliveredQty || {};
    
    // 1. Deduct stock & reserved levels, log inventory movement ledger entries
    deliveredItems.forEach(dItem => {
      const prod = products.find(p => p.id === dItem.productId);
      if (prod && dItem.quantity > 0) {
        const qty = dItem.quantity;
        const stock = Math.max(0, prod.stock - qty);
        // Reduce reserved stock since the item is now officially delivered (left the building)
        const reservedQty = Math.max(0, (prod.reservedQty || 0) - qty);
        const freeToUseQty = stock - reservedQty;
        
        mockDb.update(DB_KEYS.PRODUCTS, prod.id, { stock, reservedQty, freeToUseQty });
        
        // Log movement entry
        mockDb.insert(DB_KEYS.INVENTORY_LEDGER, {
          productId: prod.id,
          type: 'out',
          quantity: qty,
          reference: order.orderNumber,
          timestamp: new Date().toISOString()
        });

        // Update local map
        currentDeliveredMap[dItem.productId] = (currentDeliveredMap[dItem.productId] || 0) + qty;
      }
    });

    // 2. Append to deliveries list
    const newDeliveries = order.deliveries || [];
    newDeliveries.push({
      date: deliveryDetails.deliveryDate || new Date().toISOString().split('T')[0],
      items: deliveredItems,
      remarks: deliveryDetails.remarks || 'Shipped'
    });

    // 3. Compute overall status
    let totalOrdered = 0;
    let totalDelivered = 0;

    (order.items || []).forEach(item => {
      totalOrdered += item.quantity;
      totalDelivered += (currentDeliveredMap[item.productId] || 0);
    });

    let nextStatus = 'confirmed';
    if (totalDelivered >= totalOrdered) {
      nextStatus = 'fully_delivered';
    } else if (totalDelivered > 0) {
      nextStatus = 'partially_delivered';
    }

    const updatedOrder = {
      ...order,
      status: nextStatus,
      deliveredQty: currentDeliveredMap,
      deliveries: newDeliveries
    };

    return mockDb.update(DB_KEYS.SALES, id, updatedOrder);
  },

  // Customer Catalog Management

  /**
   * PURPOSE: Fetches all customer profiles.
   * BUSINESS USE: Renders customer lookup forms and detail views.
   * API USAGE: GET /api/v1/customers
   * LOGIC EXPLANATION: standard API catch wrapper falling back to DB_KEYS.CUSTOMERS mock table.
   */
  getCustomers: async () => {
    try {
      const res = await customerApi.getCustomers();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.CUSTOMERS);
    }
  },

  /**
   * PURPOSE: Registers a new customer profile.
   * BUSINESS USE: Adds client profiles with address, country, and GST detail fields.
   * API USAGE: POST /api/v1/customers
   * LOGIC EXPLANATION: Submits client data to backend or inserts row into local storage.
   */
  createCustomer: async (data) => {
    try {
      const res = await customerApi.createCustomer(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.CUSTOMERS, data);
    }
  },

  /**
   * PURPOSE: Updates an existing customer profile by ID.
   * BUSINESS USE: Updates client phone numbers, state, or GST tax codes.
   * API USAGE: PUT /api/v1/customers/{id}
   * LOGIC EXPLANATION: Standard PUT wrapper mapping customer details changes.
   */
  updateCustomer: async (id, data) => {
    try {
      const res = await customerApi.updateCustomer(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.CUSTOMERS, id, data);
    }
  },

  /**
   * PURPOSE: Deletes a customer profile by ID.
   * BUSINESS USE: Prunes client catalog.
   * API USAGE: DELETE /api/v1/customers/{id}
   * LOGIC EXPLANATION: Standard DELETE catch wrapper mapping customer deletes.
   */
  deleteCustomer: async (id) => {
    try {
      await customerApi.deleteCustomer(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.CUSTOMERS, id);
    }
  }
};

export default salesService;
