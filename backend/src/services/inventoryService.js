// src/services/inventoryService.js
// Inventory and stock-ledger service layer — live APIs only, no mock fallbacks.

import inventoryApi from '../api/inventoryApi';

export const inventoryService = {
  getInventoryLedger: async (params) => {
    const res = await inventoryApi.getLedger(params);
    const data = res.data;
    return Array.isArray(data) ? data : (data?.content ?? []);
  },

  adjustStock: async (data) => {
    const res = await inventoryApi.adjust(data);
    return res.data;
  },

  getInventorySummary: async () => {
    const res = await inventoryApi.getSummary();
    return res.data;
  },
};

export default inventoryService;
