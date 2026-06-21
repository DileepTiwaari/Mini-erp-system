// src/pages/InventoryPage.jsx
// Inventory and warehouse stock ledger screen.
// When inventory service is unavailable, shows a professional "Coming Soon" placeholder.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import inventoryService from '../services/inventoryService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Settings, Warehouse } from 'lucide-react';
import { checkPermission, ACTIONS, MODULES } from '../permissions/permissions';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
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
  const [serviceAvailable, setServiceAvailable] = useState(true);

  // Tabs: 'stock' | 'ledger'
  const [activeTab, setActiveTab] = useState('stock');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);

      // Fetch products and categories — these work via the product API
      let prodsList = [];
      let catsList = [];
      try {
        [prodsList, catsList] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);
      } catch (e) {
        console.warn('[InventoryPage] Product/category fetch failed:', e.message);
      }

      // Fetch inventory-specific data separately (may fail if service is down)
      let ledgerList = [];
      let summaryData = null;
      try {
        [ledgerList, summaryData] = await Promise.all([
          inventoryService.getInventoryLedger(),
          inventoryService.getInventorySummary(),
        ]);
      } catch (e) {
        console.warn('[InventoryPage] Inventory service unavailable:', e.message);
      }

      setProducts(Array.isArray(prodsList) ? prodsList : []);
      setCategories(Array.isArray(catsList) ? catsList : []);
      setLedger(Array.isArray(ledgerList) ? ledgerList : []);
      setSummary(summaryData);

      // Determine if there's meaningful data to display
      const hasInventoryData = (Array.isArray(prodsList) && prodsList.length > 0) ||
                               (Array.isArray(ledgerList) && ledgerList.length > 0);
      setServiceAvailable(hasInventoryData);
    } catch (err) {
      console.warn('[InventoryPage] Unexpected error:', err.message);
      setServiceAvailable(false);
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

  const filteredProducts = (products || []).filter((p) => {
    const q = searchQuery.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q);
  });

  const canAdjust = user && checkPermission(user.role, MODULES.INVENTORY, ACTIONS.EDIT);

  // Render Check: Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading warehouse inventory..." />
      </div>
    );
  }

  // Render: Service unavailable or no data — show professional placeholder
  if (!serviceAvailable) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Inventory Stock"
          isDemo={true}
          subtitle="Track stock levels, valuations, and view material transaction audits."
        />
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <EmptyState
            icon={Warehouse}
            title="Inventory Module"
            message="No inventory records available. Connect inventory service to enable live stock tracking."
            action={
              <button
                onClick={fetchResources}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded shadow-sm transition-colors duration-150"
              >
                Retry Connection
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Inventory Stock"
        isDemo={true}
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
