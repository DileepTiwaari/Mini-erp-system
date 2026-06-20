/**
 * PURPOSE:
 * Integrates dashboard API payloads with business logic. If the backend is unavailable,
 * fallback logic calculates real-time aggregates from the client-side local database.
 *
 * WHY:
 * Provides a robust service wrapper that handles API error handling and keeps the dashboard
 * functional in offline/mock mode using client-side tables.
 *
 * API:
 * - GET /api/v1/dashboard
 * - GET /api/v1/dashboard/sales-summary
 * - GET /api/v1/dashboard/manufacturing-summary
 * - GET /api/v1/dashboard/stock-alerts
 * - GET /api/v1/dashboard/recent-activities
 *
 * LOGIC USED:
 * Standard Javascript try/catch blocks wrapper. In the catch block, it falls back to
 * `mockDb.js` collections (Sales, Purchases, Manufacturing, Products, Audit Logs) to
 * compute counts, status groupings, stock levels, and timelines.
 */

import dashboardApi from '../api/dashboardApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const dashboardService = {
  /**
   * PURPOSE: Fetches top-level KPIs counts.
   * BUSINESS USE: Gives operations management an instant summary of sales, purchases, manufacturing runs, and stock shortages.
   * API USED: GET /api/v1/dashboard
   * LOGIC USED: Pulls lengths of sales, purchases, and manufacturing tables, and counts items below safety threshold.
   */
  getSummary: async () => {
    try {
      const res = await dashboardApi.getSummary();
      return res.data;
    } catch (e) {
      const sales = mockDb.getAll(DB_KEYS.SALES);
      const purchases = mockDb.getAll(DB_KEYS.PURCHASES);
      const mos = mockDb.getAll(DB_KEYS.MANUFACTURING);
      const products = mockDb.getAll(DB_KEYS.PRODUCTS);

      return {
        totalSalesOrders: sales.length,
        totalPurchaseOrders: purchases.length,
        totalMfgOrders: mos.length,
        lowStockCount: products.filter((p) => p.stock <= p.minStock).length,
      };
    }
  },

  /**
   * PURPOSE: Fetches monthly sales revenue figures.
   * BUSINESS USE: Visualizes monthly sales performance to track growth and plan operations.
   * API USED: GET /api/v1/dashboard/sales-summary
   * LOGIC USED: Returns a chronological array of monthly sales figures (Jan-Dec).
   */
  getSalesSummary: async () => {
    try {
      const res = await dashboardApi.getSalesSummary();
      return res.data;
    } catch (e) {
      // Mock fallback monthly data
      return [
        { month: 'Jan', sales: 12000 },
        { month: 'Feb', sales: 18000 },
        { month: 'Mar', sales: 15000 },
        { month: 'Apr', sales: 22000 },
        { month: 'May', sales: 24000 },
        { month: 'Jun', sales: 29000 },
        { month: 'Jul', sales: 26000 },
        { month: 'Aug', sales: 31000 },
        { month: 'Sep', sales: 28000 },
        { month: 'Oct', sales: 34000 },
        { month: 'Nov', sales: 38000 },
        { month: 'Dec', sales: 42000 },
      ];
    }
  },

  /**
   * PURPOSE: Fetches shop floor manufacturing summaries.
   * BUSINESS USE: Informs production supervisors on planned vs in-progress workloads and daily completions.
   * API USED: GET /api/v1/dashboard/manufacturing-summary
   * LOGIC USED: Filters manufacturing orders by status to categorize open, running, or done runs.
   */
  getManufacturingSummary: async () => {
    try {
      const res = await dashboardApi.getManufacturingSummary();
      return res.data;
    } catch (e) {
      const mos = mockDb.getAll(DB_KEYS.MANUFACTURING);
      return {
        openCount: mos.filter((o) => o.status === 'planned').length,
        inProgressCount: mos.filter((o) => o.status === 'in_progress').length,
        completedTodayCount: mos.filter((o) => o.status === 'done').length,
      };
    }
  },

  /**
   * PURPOSE: Fetches product listings for low-stock flagging.
   * BUSINESS USE: Alerts logistics managers about items running low to prompt replenishment orders.
   * API USED: GET /api/v1/dashboard/stock-alerts
   * LOGIC USED: Returns all product catalog listings to be dynamically analyzed by alert components.
   */
  getStockAlerts: async () => {
    try {
      const res = await dashboardApi.getStockAlerts();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.PRODUCTS);
    }
  },

  /**
   * PURPOSE: Fetches recent system activities audit logs.
   * BUSINESS USE: Audit tracking for operations security and verification.
   * API USED: GET /api/v1/dashboard/recent-activities
   * LOGIC USED: Returns the latest 5 log entries sorted chronologically.
   */
  getRecentActivities: async () => {
    try {
      const res = await dashboardApi.getRecentActivities();
      return res.data;
    } catch (e) {
      const audits = mockDb.getAll(DB_KEYS.AUDIT_LOGS);
      return audits.slice(-5).reverse().map((a) => ({
        id: a.id,
        user: a.userName,
        action: a.action,
        description: a.description,
        timestamp: a.timestamp,
      }));
    }
  },
};

export default dashboardService;

/**
 * PURPOSE:
 * Business service layer for system audit logs.
 *
 * WHY:
 * Provides a structured service wrapper for pulling system execution logs.
 *
 * API:
 * GET /api/v1/audit-logs
 *
 * LOGIC USED:
 * Reads from the local mockDb AUDIT_LOGS table and returns the entries array.
 */
export const auditService = {
  getLogs: async () => {
    return mockDb.getAll(DB_KEYS.AUDIT_LOGS);
  }
};

