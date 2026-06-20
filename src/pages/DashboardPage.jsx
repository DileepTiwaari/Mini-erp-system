// src/pages/DashboardPage.jsx
// 
// WHAT IT DOES:
// Renders the primary dashboard page aggregate view of the ERP system,
// showing summary cards (counts of products, categories, sales, purchases, and manufacturing orders),
// a monthly Sales Chart, a critical Stock Alerts table, and Recent Activities logs.
// 
// WHY IT IS REQUIRED:
// 1. Serves as the first workspace entry screen for authenticated corporate users.
// 2. Aggregates operations KPIs and logs dynamically so workers get immediate status overviews.
// 3. Implements responsive grid columns so metrics fit neatly on different device viewports.
// 
// WHEN IT IS USED:
// Loaded automatically when landing on `/dashboard`.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { formatRole } from '../utils/formatters';

// Widgets & Layout Components
import SummaryCard from '../components/dashboard/SummaryCard';
import SalesChart from '../components/dashboard/SalesChart';
import StockAlerts from '../components/dashboard/StockAlerts';
import RecentActivities from '../components/dashboard/RecentActivities';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';

// Icons
import { 
  Package, 
  Tags, 
  ShoppingCart, 
  FileSpreadsheet, 
  Wrench, 
  AlertTriangle 
} from 'lucide-react';

/**
 * WHAT IT DOES: Page component presenting dashboard metrics and charts.
 * WHY IT IS REQUIRED: Aggregates fetch requests from multiple modules in one viewport container.
 * WHEN IT IS USED: Rendered for the `/dashboard` route endpoint.
 */
export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // WHAT IT DOES: States to manage loading indicator, KPI data objects, and catalog item lists.
  // WHY IT IS REQUIRED: Binds service payloads to component elements dynamically.
  // WHEN IT IS USED: Edited inside useEffect fetch routines.
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [products, setProducts] = useState([]);

  // WHAT IT DOES: Side effect routing data fetches on layout boot.
  // WHY IT IS REQUIRED: Gathers metrics synchronously from local databases or REST endpoints.
  // WHEN IT IS USED: Invoked on component mounting.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, prods] = await Promise.all([
          dashboardService.getSummary(),
          productService.getProducts()
        ]);

        setKpis(stats);
        setProducts(prods);
      } catch (err) {
        showToast('Error loading dashboard analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [showToast]);

  if (loading || !kpis) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}`}
        subtitle={`Active Profile: ${formatRole(user?.role)} | Operational overview for today.`}
      />

      {/* KPI Cards Row (Grid of 6 metrics cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <SummaryCard
          title="Total Products"
          value={kpis.totalProducts}
          icon={Package}
          description="Registered items"
        />
        <SummaryCard
          title="Categories"
          value={kpis.totalCategories}
          icon={Tags}
          description="Product divisions"
        />
        <SummaryCard
          title="Sales Orders"
          value={kpis.totalSalesOrders}
          icon={ShoppingCart}
          description="Total customer orders"
        />
        <SummaryCard
          title="Purchase Orders"
          value={kpis.totalPurchaseOrders}
          icon={FileSpreadsheet}
          description="Total vendor requests"
        />
        <SummaryCard
          title="Mfg Orders"
          value={kpis.totalMfgOrders}
          icon={Wrench}
          description="Total work orders"
        />
        <SummaryCard
          title="Low Stock"
          value={kpis.lowStockCount}
          icon={AlertTriangle}
          description="Items below safety point"
          trend={kpis.lowStockCount > 0 ? 'Urgent' : 'Clear'}
          className={kpis.lowStockCount > 0 ? 'border-rose-200 bg-rose-50/20' : ''}
        />
      </div>

      {/* Critical Stock Alerts list */}
      <StockAlerts items={products} />

      {/* Charts & System Timeline logs layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={kpis.salesChartData} title="Monthly Sales Revenue (USD)" />
        </div>
        <div>
          <RecentActivities activities={kpis.recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
