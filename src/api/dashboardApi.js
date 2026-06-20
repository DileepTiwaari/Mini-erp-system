/**
 * PURPOSE:
 * Declares the client-side HTTP request mappings for the system dashboard analytics.
 *
 * WHY:
 * Isolates direct REST URL paths and axios instances from the application's service logic,
 * allowing simple backend endpoint swaps or protocol changes.
 *
 * API:
 * - GET /api/v1/dashboard (getSummary)
 * - GET /api/v1/dashboard/sales-summary (getSalesSummary)
 * - GET /api/v1/dashboard/manufacturing-summary (getManufacturingSummary)
 * - GET /api/v1/dashboard/stock-alerts (getStockAlerts)
 * - GET /api/v1/dashboard/recent-activities (getRecentActivities)
 *
 * LOGIC USED:
 * Utilizes a shared Axios instance with interceptors for authentication header injection.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const dashboardApi = {
  /**
   * PURPOSE: Fetches the primary KPIs counts (Sales, Purchases, Manufacturing, Low Stock).
   * WHY: Feeds the top four summary metrics widgets on the dashboard.
   * API: GET /api/v1/dashboard
   */
  getSummary: () => axiosInstance.get(API_ENDPOINTS.DASHBOARD),

  /**
   * PURPOSE: Fetches monthly sales data.
   * WHY: Provides time-series points to render the sales bar charts.
   * API: GET /api/v1/dashboard/sales-summary
   */
  getSalesSummary: () => axiosInstance.get(`${API_ENDPOINTS.DASHBOARD}/sales-summary`),

  /**
   * PURPOSE: Fetches production shop floor statistics.
   * WHY: Feeds the active manufacturing runs dashboard widget.
   * API: GET /api/v1/dashboard/manufacturing-summary
   */
  getManufacturingSummary: () => axiosInstance.get(`${API_ENDPOINTS.DASHBOARD}/manufacturing-summary`),

  /**
   * PURPOSE: Fetches inventory low-stock alerts.
   * WHY: Highlights items below or near their reorder thresholds.
   * API: GET /api/v1/dashboard/stock-alerts
   */
  getStockAlerts: () => axiosInstance.get(`${API_ENDPOINTS.DASHBOARD}/stock-alerts`),

  /**
   * PURPOSE: Fetches recent system activities audit log logs.
   * WHY: Feeds the recent activity feed panel for system tracking.
   * API: GET /api/v1/dashboard/recent-activities
   */
  getRecentActivities: () => axiosInstance.get(`${API_ENDPOINTS.DASHBOARD}/recent-activities`),
};

export default dashboardApi;
