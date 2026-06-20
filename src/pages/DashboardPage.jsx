// src/pages/DashboardPage.jsx
// Main workspace dashboard for FlowERP.
// Aggregates operations KPIs and renders visual layout widgets.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import productService from '../services/productService';
import manufacturingService from '../services/manufacturingService';
import procurementService from '../services/procurementService';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

// Widgets
import SummaryCard from '../components/dashboard/SummaryCard';
import SalesChart from '../components/dashboard/SalesChart';
import StockAlerts from '../components/dashboard/StockAlerts';
import RecentActivities from '../components/dashboard/RecentActivities';
import ProcurementWidget from '../components/dashboard/ProcurementWidget';
import ManufacturingWidget from '../components/dashboard/ManufacturingWidget';
import LowStockWidget from '../components/dashboard/LowStockWidget';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';

// Icons
import { BadgeDollarSign, Wrench, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [products, setProducts] = useState([]);
  const [mOrders, setMOrders] = useState([]);
  const [reorders, setReorders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await dashboardService.getSummary();
        const prods = await productService.getProducts();
        const mos = await manufacturingService.getManufacturingOrders();
        const recs = await procurementService.getRecommendations();

        setKpis(stats);
        setProducts(prods);
        setMOrders(mos);
        setReorders(recs);
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
      {/* Stock Alerts Banner */}
      <StockAlerts items={products} />

      {/* Header */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}`}
        subtitle={`Role: ${user?.role?.toUpperCase()} | Here is what is happening on the shop floor today.`}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Sales Revenue"
          value={formatCurrency(kpis.salesRevenue)}
          icon={BadgeDollarSign}
          description="Invoiced & Completed orders"
          trend="+12%"
        />
        <SummaryCard
          title="Procurement Spend"
          value={formatCurrency(kpis.purchaseSpend)}
          icon={BadgeDollarSign}
          description="Active & Approved PO spend"
          trend="+5%"
        />
        <SummaryCard
          title="Active Work Orders"
          value={kpis.activeMos}
          icon={Wrench}
          description="Ongoing manufacturing runs"
        />
        <SummaryCard
          title="Material Shortages"
          value={kpis.lowStockCount}
          icon={AlertTriangle}
          description="Items below safety threshold"
          trend={kpis.lowStockCount > 0 ? 'Urgent' : 'Clear'}
        />
      </div>

      {/* Charts & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={kpis.salesChartData} />
        </div>
        <div>
          <RecentActivities activities={kpis.recentActivities} />
        </div>
      </div>

      {/* Operations Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <LowStockWidget items={products} />
        <ManufacturingWidget orders={mOrders} />
        <ProcurementWidget suggestions={reorders} />
      </div>
    </div>
  );
};

export default DashboardPage;
