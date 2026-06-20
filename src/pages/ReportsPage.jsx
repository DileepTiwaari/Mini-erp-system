// src/pages/ReportsPage.jsx
// Cumulative enterprise reporting module page.

import React, { useState, useEffect } from 'react';
import salesService from '../services/salesService';
import productService from '../services/productService';
import purchaseService from '../services/purchaseService';
import { useToast } from '../context/ToastContext';

// Components
import PageHeader from '../components/common/PageHeader';
import SalesReport from '../components/reports/SalesReport';
import InventoryReport from '../components/reports/InventoryReport';
import ProcurementReport from '../components/reports/ProcurementReport';
import Loader from '../components/common/Loader';

export const ReportsPage = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Active Report Tab: 'sales' | 'inventory' | 'procurement'
  const [activeTab, setActiveTab] = useState('sales');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const [sales, purchases, prods, cats, custs, vends] = await Promise.all([
        salesService.getSalesOrders(),
        purchaseService.getPurchaseOrders(),
        productService.getProducts(),
        productService.getCategories(),
        salesService.getCustomers(),
        purchaseService.getVendors()
      ]);

      setSalesOrders(sales);
      setPurchaseOrders(purchases);
      setProducts(prods);
      setCategories(cats);
      setCustomers(custs);
      setVendors(vends);
    } catch (err) {
      showToast('Failed to aggregate reports resources database.', 'error');
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
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Analytical Reports"
        subtitle="Extract print-ready sheets for sales distributions, assets valuation, and procurements spend."
      />

      {/* Tab controls */}
      <div className="flex border-b border-slate-200 no-print">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'sales'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Sales Distribution Report
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'inventory'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Inventory Valuation Report
        </button>
        <button
          onClick={() => setActiveTab('procurement')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'procurement'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Purchase & Procurement Report
        </button>
      </div>

      {/* Report views render depending on active tab */}
      <div>
        {activeTab === 'sales' && (
          <SalesReport orders={salesOrders} customers={customers} />
        )}
        {activeTab === 'inventory' && (
          <InventoryReport products={products} categories={categories} />
        )}
        {activeTab === 'procurement' && (
          <ProcurementReport orders={purchaseOrders} vendors={vendors} />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
