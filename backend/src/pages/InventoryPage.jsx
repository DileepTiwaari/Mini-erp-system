// src/pages/InventoryPage.jsx
// Inventory and warehouse stock ledger screen.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import inventoryService from '../services/inventoryService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Settings } from 'lucide-react';
import { checkPermission, ACTIONS, MODULES } from '../permissions/permissions';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import SearchBar from '../components/common/SearchBar';
import StockTable from '../components/inventory/StockTable';
import StockLedger from '../components/inventory/StockLedger';
import InventorySummary from '../components/inventory/InventorySummary';
import StockAdjustForm from '../components/inventory/StockAdjustForm';
import Modal from '../components/common/Modal';

export const InventoryPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Tabs: 'stock' | 'ledger'
  const [activeTab, setActiveTab] = useState('stock');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [prodsList, catsList, ledgerList, summaryData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
        inventoryService.getInventoryLedger(),
        inventoryService.getInventorySummary()
      ]);
      setProducts(prodsList);
      setCategories(catsList);
      setLedger(ledgerList);
      setSummary(summaryData);
    } catch (err) {
      setError(true);
      showToast('Failed to load inventory warehouse records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleApplyAdjustment = async (adjustmentData) => {
    try {
      await inventoryService.adjustStock(adjustmentData);
      showToast('Inventory level adjustment applied successfully.', 'success');
      setIsAdjustOpen(false);
      fetchResources();
    } catch (err) {
      showToast(err.message || 'Adjustment failed.', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) || (p.code || p.sku || '').toLowerCase().includes(q);
  });

  const canAdjust = checkPermission(user?.role, MODULES.INVENTORY, ACTIONS.CREATE);

  // Render Check: Error state — uses standardised ErrorState component
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState
          title="Failed to Load Inventory Data"
          message="Something went wrong while loading warehouse stock levels and movement records. Please try again."
          onRetry={fetchResources}
        />
      </div>
    );
  }

  // Render Check: Loading state — uses standardised Loader component
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading warehouse inventory..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Inventory Stock"
        subtitle="Track stock levels, valuations, and view material transaction audits."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search stock..." />
            {canAdjust && (
              <button
                onClick={() => setIsAdjustOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors duration-150"
              >
                <Settings className="w-4 h-4" />
                <span>Adjust Stock</span>
              </button>
            )}
          </div>
        }
      />

      {/* Aggregate metrics */}
      <InventorySummary summaryData={summary} />

      {/* Tab controls */}
      <div className="flex border-b border-slate-200 no-print">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'stock'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active Stock levels
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
            activeTab === 'ledger'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Audit Stock Movements ledger
        </button>
      </div>

      {/* Tables depending on active tab */}
      {activeTab === 'stock' ? (
        <StockTable
          products={filteredProducts}
          categories={categories}
          loading={loading}
        />
      ) : (
        <StockLedger
          ledger={ledger}
          products={products}
          loading={loading}
        />
      )}

      {/* Stock Adjust Form Modal */}
      <Modal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        title="Physical Inventory stock adjustment"
        size="md"
      >
        <StockAdjustForm
          onSubmit={handleApplyAdjustment}
          onCancel={() => setIsAdjustOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default InventoryPage;
