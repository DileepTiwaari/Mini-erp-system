// src/pages/ReportsPage.jsx
// Cumulative enterprise reporting module screen.
//
// PURPOSE:
// Provides analytical dashboards with detailed widgets and print layouts.
//
// BUSINESS USE:
// Helps corporate management analyze revenues, inventory assets, and purchase trends.
//
// LOGIC:
// Resolves multiple service calls concurrently using Promise.all, checks for error triggers,
// and mounts Sales, Inventory, and Procurement sub-report dashboards.

import React, { useState, useEffect } from 'react';
import salesService from '../services/salesService';
import productService from '../services/productService';
import purchaseService from '../services/purchaseService';
import manufacturingService from '../services/manufacturingService';
import procurementService from '../services/procurementService';
import { useToast } from '../context/ToastContext';

// Components
import PageHeader from '../components/common/PageHeader';
import SalesReport from '../components/reports/SalesReport';
import InventoryReport from '../components/reports/InventoryReport';
import ProcurementReport from '../components/reports/ProcurementReport';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';

export const ReportsPage = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [manufacturingOrders, setManufacturingOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Active Report Tab: 'sales' | 'inventory' | 'procurement'
  const [activeTab, setActiveTab] = useState('sales');

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [sales, purchases, prods, cats, custs, vends, mfgs, recs] = await Promise.all([
        salesService.getSalesOrders(),
        purchaseService.getPurchaseOrders(),
        productService.getProducts(),
        productService.getCategories(),
        salesService.getCustomers(),
        purchaseService.getVendors(),
        manufacturingService.getManufacturingOrders(),
        procurementService.getRecommendations()
      ]);

      setSalesOrders(sales || []);
      setPurchaseOrders(purchases || []);
      setProducts(prods || []);
      setCategories(cats || []);
      setCustomers(custs || []);
      setVendors(vends || []);
      setManufacturingOrders(mfgs || []);
      setRecommendations(recs || []);
    } catch (err) {
      console.warn('[ReportsPage] fetch failed:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading Reports Dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytical Reports"
          isDemo={true}
          subtitle="Extract print-ready sheets for sales distributions, assets valuation, and procurements spend."
        />
        <ErrorState onRetry={fetchResources} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Analytical Reports"
        isDemo={true}
        subtitle="Extract print-ready sheets for sales distributions, assets valuation, and procurements spend."
      />

      {/* Tab controls */}
      <div className="flex border-b border-slate-200 no-print">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'sales'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Sales Distribution Report
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Inventory Valuation Report
        </button>
        <button
          onClick={() => setActiveTab('procurement')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'procurement'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Purchase & Procurement Report
        </button>
      </div>

      {/* Report views render depending on active tab */}
      <div>
        {activeTab === 'sales' && (
          <SalesReport orders={salesOrders} customers={customers} products={products} />
        )}
        {activeTab === 'inventory' && (
          <InventoryReport products={products} categories={categories} orders={salesOrders} />
        )}
        {activeTab === 'procurement' && (
          <ProcurementReport 
            orders={purchaseOrders} 
            vendors={vendors} 
            mfgOrders={manufacturingOrders} 
            recommendations={recommendations}
            products={products}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
