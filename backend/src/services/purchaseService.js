// src/services/purchaseService.js
// Purchase order and vendor service layer — live APIs only, no mock fallbacks.

import purchaseApi from '../api/purchaseApi';
import vendorApi from '../api/vendorApi';

const extractList = (data) => (Array.isArray(data) ? data : (data?.content ?? []));

export const purchaseService = {
  getPurchaseOrders: async (params) => {
    const res = await purchaseApi.getPurchaseOrders(params);
    return extractList(res.data);
  },

  getPurchaseOrderById: async (id) => {
    const res = await purchaseApi.getPurchaseOrderById(id);
    return res.data;
  },

  createPurchaseOrder: async (data) => {
    const res = await purchaseApi.createPurchaseOrder(data);
    return res.data;
  },

  updatePurchaseOrder: async (id, data) => {
    const res = await purchaseApi.updatePurchaseOrder(id, data);
    return res.data;
  },

  confirmPurchaseOrder: async (id) => {
    const res = await purchaseApi.confirmPurchaseOrder(id);
    return res.data;
  },

  receivePurchaseOrder: async (id, receiptData) => {
    const res = await purchaseApi.receivePurchaseOrder(id, receiptData);
    return res.data;
  },

  cancelPurchaseOrder: async (id) => {
    const res = await purchaseApi.cancelPurchaseOrder(id);
    return res.data;
  },

  deletePurchaseOrder: async (id) => {
    await purchaseApi.deletePurchaseOrder(id);
    return true;
  },

  getVendors: async (params) => {
    const res = await vendorApi.getVendors(params);
    return extractList(res.data);
  },

  createVendor: async (data) => {
    const res = await vendorApi.createVendor(data);
    return res.data;
  },

  updateVendor: async (id, data) => {
    const res = await vendorApi.updateVendor(id, data);
    return res.data;
  },

  deleteVendor: async (id) => {
    await vendorApi.deleteVendor(id);
    return true;
  },
};

export default purchaseService;
