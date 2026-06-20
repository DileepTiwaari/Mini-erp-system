// src/services/dashboardService.js
// Aggregated analytics dashboard metrics service layer.

import dashboardApi from '../api/dashboardApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const dashboardService = {
  getSummary: async () => {
    try {
      const res = await dashboardApi.getSummary();
      return res.data;
    } catch (e) {
      // Aggregates dashboard details from our database tables
      const sales = mockDb.getAll(DB_KEYS.SALES);
      const purchases = mockDb.getAll(DB_KEYS.PURCHASES);
      const mos = mockDb.getAll(DB_KEYS.MANUFACTURING);
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      const audits = mockDb.getAll(DB_KEYS.AUDIT_LOGS);

      // Calculations
      const completedSales = sales.filter(s => s.status === 'completed');
      const salesRevenue = completedSales.reduce((sum, s) => sum + s.totalAmount, 0);

      const approvedPurchases = purchases.filter(p => p.status === 'approved' || p.status === 'completed');
      const purchaseSpend = approvedPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

      const activeMos = mos.filter(m => m.status === 'in_progress').length;
      const finishedMos = mos.filter(m => m.status === 'done').length;

      const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;

      // Mock recent activities (combination of audit logs)
      const recentActivities = audits.slice(0, 5).map(a => ({
        id: a.id,
        user: a.userName,
        action: a.action,
        description: a.description,
        timestamp: a.timestamp
      }));

      // Weekly Sales metrics simulation
      const salesByDay = [
        { day: 'Mon', amount: 450 },
        { day: 'Tue', amount: 800 },
        { day: 'Wed', amount: 1200 },
        { day: 'Thu', amount: 900 },
        { day: 'Fri', amount: 1600 },
        { day: 'Sat', amount: 500 },
        { day: 'Sun', amount: 200 }
      ];

      return {
        salesRevenue,
        purchaseSpend,
        activeMos,
        finishedMos,
        lowStockCount: lowStockProducts,
        recentActivities,
        salesChartData: salesByDay
      };
    }
  }
};

export default dashboardService;
// Also mock audit logs service here since it shares similar report logic
export const auditService = {
  getLogs: async () => {
    return mockDb.getAll(DB_KEYS.AUDIT_LOGS);
  }
};
