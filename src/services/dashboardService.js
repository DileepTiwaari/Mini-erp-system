// src/services/dashboardService.js
// 
// WHAT IT DOES:
// Aggregates analytics dashboard metrics and charts from database tables.
// Computes products counts, categories counts, sales, purchases, manufacturing runs,
// low stock highlights, and activity logs.
// 
// WHY IT IS REQUIRED:
// 1. Centralizes computation rules for KPIs so widgets receive pre-processed values.
// 2. Isolates raw database schemas from visual card elements.
// 3. Prepares endpoints for subsequent Spring Boot reporting integration.
// 
// WHEN IT IS USED:
// Loaded inside DashboardPage.jsx on page boot or refresh.

import dashboardApi from '../api/dashboardApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

/**
 * WHAT IT DOES: Central business service layer for dashboard aggregates.
 * WHY IT IS REQUIRED: Returns pre-aggregated business KPIs and chart arrays.
 * WHEN IT IS USED: Executed inside DashboardPage during data fetch.
 */
export const dashboardService = {
  // WHAT IT DOES: Fetches dashboard summary analytics.
  // WHY IT IS REQUIRED: Returns counts, low-stock metrics, monthly sales data, and timeline logs.
  // WHEN IT IS USED: Invoked on DashboardPage mount.
  getSummary: async () => {
    try {
      const res = await dashboardApi.getSummary();
      return res.data;
    } catch (e) {
      // WHAT IT DOES: Local mock logic querying localStorage tables.
      // WHY IT IS REQUIRED: Feeds dashboard calculations when backend is absent.
      // WHEN IT IS USED: Fallback triggered on REST request errors.
      const sales = mockDb.getAll(DB_KEYS.SALES);
      const purchases = mockDb.getAll(DB_KEYS.PURCHASES);
      const mos = mockDb.getAll(DB_KEYS.MANUFACTURING);
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);
      const categories = mockDb.getAll(DB_KEYS.CATEGORIES);
      const audits = mockDb.getAll(DB_KEYS.AUDIT_LOGS);

      // Calculations
      const totalProducts = products.length;
      const totalCategories = categories.length;
      const totalSalesOrders = sales.length;
      const totalPurchaseOrders = purchases.length;
      const totalMfgOrders = mos.length;

      // Filter products where stock quantity is below safety threshold
      const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;

      // Mock recent activities (combination of audit logs)
      const recentActivities = audits.slice(0, 6).map(a => ({
        id: a.id,
        user: a.userName,
        action: a.action,
        description: a.description,
        timestamp: a.timestamp
      }));

      // Monthly Sales metrics simulation (Jan - Dec)
      const monthlySalesData = [
        { month: 'Jan', amount: 4500 },
        { month: 'Feb', amount: 5200 },
        { month: 'Mar', amount: 6100 },
        { month: 'Apr', amount: 5800 },
        { month: 'May', amount: 7100 },
        { month: 'Jun', amount: 8000 },
        { month: 'Jul', amount: 7500 },
        { month: 'Aug', amount: 8200 },
        { month: 'Sep', amount: 9000 },
        { month: 'Oct', amount: 8800 },
        { month: 'Nov', amount: 9500 },
        { month: 'Dec', amount: 11000 }
      ];

      return {
        totalProducts,
        totalCategories,
        totalSalesOrders,
        totalPurchaseOrders,
        totalMfgOrders,
        lowStockCount: lowStockProducts,
        recentActivities,
        salesChartData: monthlySalesData
      };
    }
  }
};

export default dashboardService;

/**
 * WHAT IT DOES: Business service layer for system audit logs.
 * WHY IT IS REQUIRED: Standardizes queries towards system action histories.
 * WHEN IT IS USED: Rendered inside Administration or logs boards.
 */
export const auditService = {
  getLogs: async () => {
    return mockDb.getAll(DB_KEYS.AUDIT_LOGS);
  }
};
