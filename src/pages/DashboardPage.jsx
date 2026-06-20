/**
 * PURPOSE:
 * Serves as the central Dashboard page panel for the FlowERP application.
 *
 * WHY:
 * Consolidates all operational analytics modules in a unified layout. It fetches and displays
 * top KPI figures, historical sales trends, shortage lists, procurement recommendations,
 * shop floor statistics, and timeline logs.
 *
 * API:
 * - GET /api/v1/dashboard
 * - GET /api/v1/dashboard/sales-summary
 * - GET /api/v1/dashboard/manufacturing-summary
 * - GET /api/v1/dashboard/stock-alerts
 * - GET /api/v1/dashboard/recent-activities
 *
 * LOGIC USED:
 * Runs `Promise.all` inside a React `useEffect` hook on page load. Binds separate states for
 * loading flags, error flags, and returned datasets. Directs the user to a generic fallback block
 * if responses are empty or have thrown a REST call exception.
 */

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import { formatRole } from '../utils/formatters';

// Icons
import { 
  ShoppingCart, 
  FileSpreadsheet, 
  Wrench, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/dashboard/SummaryCard';
import SalesChart from '../components/dashboard/SalesChart';
import StockAlerts from '../components/dashboard/StockAlerts';
import LowStockWidget from '../components/dashboard/LowStockWidget';
import ProcurementWidget from '../components/dashboard/ProcurementWidget';
import ManufacturingWidget from '../components/dashboard/ManufacturingWidget';
import RecentActivities from '../components/dashboard/RecentActivities';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';

export const DashboardPage = () => {
  const { user } = useAuth();

  // Component states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    summary: null,
    salesSummary: [],
    manufacturingSummary: null,
    stockAlerts: [],
    recentActivities: [],
  });

  // Fetch all dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(false);

      // Run calls concurrently
      const [
        summary,
        salesSummary,
        manufacturingSummary,
        stockAlerts,
        recentActivities,
      ] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getSalesSummary(),
        dashboardService.getManufacturingSummary(),
        dashboardService.getStockAlerts(),
        dashboardService.getRecentActivities(),
      ]);

      // Verify if data is empty or invalid
      if (!summary) {
        setData({
          summary: null,
          salesSummary: [],
          manufacturingSummary: null,
          stockAlerts: [],
          recentActivities: [],
        });
      } else {
        setData({
          summary,
          salesSummary,
          manufacturingSummary,
          stockAlerts,
          recentActivities,
        });
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader size="lg" label="Loading Dashboard..." />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <ErrorState onRetry={fetchDashboardStats} />
      </div>
    );
  }

  // 3. Empty State (Summary counts are missing or null)
  const isDataEmpty = 
    !data.summary || 
    (data.summary.totalSalesOrders === 0 &&
     data.summary.totalPurchaseOrders === 0 &&
     data.summary.totalMfgOrders === 0 &&
     data.summary.lowStockCount === 0);

  if (isDataEmpty) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <PageHeader
          title={`Welcome, ${user?.name || 'User'}`}
          subtitle={`Active Profile: ${formatRole(user?.role)}`}
        />
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm font-medium">No data available</p>
          <p className="text-slate-400 text-xs mt-1">Please seed materials, products, or orders to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}`}
        subtitle={`Active Profile: ${formatRole(user?.role)} | Real-time operations feed.`}
      />

      {/* Top Section: 4 Summary Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Sales Orders"
          value={data.summary.totalSalesOrders}
          icon={ShoppingCart}
          description="Total customer sales"
        />
        <SummaryCard
          title="Purchase Orders"
          value={data.summary.totalPurchaseOrders}
          icon={FileSpreadsheet}
          description="Total vendor requests"
        />
        <SummaryCard
          title="Mfg Orders"
          value={data.summary.totalMfgOrders}
          icon={Wrench}
          description="Total works on shopfloor"
        />
        <SummaryCard
          title="Low Stock"
          value={data.summary.lowStockCount}
          icon={AlertTriangle}
          description="Items below safety reorder"
          className={data.summary.lowStockCount > 0 ? 'border-rose-100 bg-rose-50/10' : ''}
        />
      </div>

      {/* Main Charts & Timelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 columns on desktop) */}
        <div className="lg:col-span-2">
          <SalesChart data={data.salesSummary} title="Monthly Sales Revenue (USD)" />
        </div>
        
        {/* Recent timeline feed */}
        <div>
          <RecentActivities activities={data.recentActivities} />
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <ProcurementWidget items={data.stockAlerts} />
        </div>
        <div>
          <ManufacturingWidget summary={data.manufacturingSummary} />
        </div>
        <div>
          <LowStockWidget items={data.stockAlerts} />
        </div>
      </div>

      {/* Critical Stock Alerts Table */}
      <StockAlerts items={data.stockAlerts} />
    </div>
  );
};

export default DashboardPage;
