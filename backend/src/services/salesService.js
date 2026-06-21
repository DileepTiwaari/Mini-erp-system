// src/services/salesService.js
// Sales orders and customer service layer — live APIs only, no mock fallbacks.
// Handles Spring Page<T> responses by extracting .content when present.

import salesApi from '../api/salesApi';
import customerApi from '../api/customerApi';

const extractList = (data) => (Array.isArray(data) ? data : (data?.content ?? []));

export const salesService = {
  getSalesOrders: async (params) => {
    const res = await salesApi.getOrders(params);
    return extractList(res.data);
  },

  getSalesOrderById: async (id) => {
    const res = await salesApi.getOrderById(id);
    return res.data;
  },

  createSalesOrder: async (data) => {
    const res = await salesApi.createOrder(data);
    return res.data;
  },

  updateSalesOrder: async (id, data) => {
    const res = await salesApi.updateOrder(id, data);
    return res.data;
  },

  cancelSalesOrder: async (id) => {
    const res = await salesApi.cancelOrder(id);
    return res.data;
  },

  confirmSalesOrder: async (id) => {
    const res = await salesApi.confirmOrder(id);
    return res.data;
  },

  deleteSalesOrder: async (id) => {
    await salesApi.delete?.(id);
    return true;
  },

  // Delivery — uses same sales-orders path
  processSalesOrderDelivery: async (id, deliveryDetails) => {
    const res = await salesApi.deliver?.(id, deliveryDetails);
    return res.data;
  },

  getCustomers: async (params) => {
    const res = await customerApi.getCustomers(params);
    return extractList(res.data);
  },

  createCustomer: async (data) => {
    const res = await customerApi.createCustomer(data);
    return res.data;
  },

  updateCustomer: async (id, data) => {
    const res = await customerApi.updateCustomer(id, data);
    return res.data;
  },

  deleteCustomer: async (id) => {
    await customerApi.deleteCustomer(id);
    return true;
  },
};

export default salesService;
