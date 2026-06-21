// src/services/dashboardService.js
// Dashboard analytics service layer — live APIs only, no mock fallbacks.

import dashboardApi from '../api/dashboardApi';
import auditApi from '../api/auditApi';

export const dashboardService = {
  getSummary: async () => {
    const res = await dashboardApi.getSummary();
    return res.data;
  },

  getSalesSummary: async () => {
    const res = await dashboardApi.getSalesSummary();
    return res.data;
  },

  getManufacturingSummary: async () => {
    const res = await dashboardApi.getManufacturingSummary();
    return res.data;
  },

  getStockAlerts: async () => {
    const res = await dashboardApi.getStockAlerts();
    const data = res.data;
    return Array.isArray(data) ? data : (data?.content ?? []);
  },

  getRecentActivities: async () => {
    const res = await dashboardApi.getRecentActivities();
    const data = res.data;
    return Array.isArray(data) ? data : (data?.content ?? []);
  },
};

export default dashboardService;

export const auditService = {
  getLogs: async (params) => {
    const res = await auditApi.getLogs(params);
    const data = res.data;
    return Array.isArray(data) ? data : (data?.content ?? []);
  },
};
