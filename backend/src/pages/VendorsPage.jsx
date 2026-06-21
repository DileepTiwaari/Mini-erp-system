/**
 * PURPOSE:
 * Serves as the primary control center for the Vendor Suppliers catalog database.
 *
 * BUSINESS USE:
 * Allows procurement operations to manage company supplier relationships, track supplier contact info,
 * review total cash outlays per vendor, and look up past purchase histories.
 *
 * API USAGE:
 * - Reads vendors via `purchaseService.getVendors()`.
 * - Reads purchase orders via `purchaseService.getPurchaseOrders()`.
 * - Creates vendors via `purchaseService.createVendor()`.
 * - Updates vendors via `purchaseService.updateVendor()`.
 * - Deletes vendors via `purchaseService.deleteVendor()`.
 *
 * LOGIC FLOW:
 * - Employs a filter row (Search, Status: ACTIVE/INACTIVE/ALL) client-side.
 * - Restricts deleting a vendor if they have active purchase orders (safety constraint).
 * - Opens modals for profile creation, profile edits, and detailed supplier analytics dashboards.
 */

import React, { useState, useEffect } from 'react';
import purchaseService from '../services/purchaseService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, Search, User } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import VendorList from '../components/purchase/VendorList';
import VendorForm from '../components/purchase/VendorForm';
import VendorDetailCard from '../components/purchase/VendorDetailCard';
import PurchaseOrderDetail from '../components/purchase/PurchaseOrderDetail';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const VendorsPage = () => {
  const { showToast } = useToast();

  // Master lists
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Page States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search & Filter hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals & Selected entities
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Fetch all resources concurrently
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [vendorsList, ordersList, productsList] = await Promise.all([
        purchaseService.getVendors(),
        purchaseService.getPurchaseOrders(),
        productService.getProducts()
      ]);
      setVendors(vendorsList);
      setOrders(ordersList);
      setProducts(productsList);
    } catch (err) {
      setError(true);
      showToast('Failed to load supplier catalog details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Vendor Action Handlers

  const handleCreateOrUpdate = async (vendorData) => {
    try {
      if (selectedVendor) {
        // Edit mode
        await purchaseService.updateVendor(selectedVendor.id, vendorData);
        showToast('Vendor profile updated successfully.', 'success');
      } else {
        // Create mode
        await purchaseService.createVendor(vendorData);
        showToast('Supplier vendor registered successfully.', 'success');
      }
      setIsFormOpen(false);
      setSelectedVendor(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save vendor details.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!vendorToDelete) return;

    // Safety check: prevent deleting if vendor is linked to purchase orders
    const hasLinkedOrders = orders.some(o => o.vendorId === vendorToDelete.id);
    if (hasLinkedOrders) {
      showToast('Cannot delete vendor. Active purchase orders are linked to this supplier.', 'warning');
      setVendorToDelete(null);
      return;
    }

    try {
      await purchaseService.deleteVendor(vendorToDelete.id);
      showToast('Vendor supplier removed successfully.', 'success');
      setVendorToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete vendor supplier.', 'error');
    }
  };

  // Triggers handlers

  const handleAddClick = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  const handleViewClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsDetailOpen(true);
  };

  const handleViewOrderFromVendorCard = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // Filter calculations

  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (v.name || '').toLowerCase().includes(q) ||
      (v.code || '').toLowerCase().includes(q) ||
      (v.contactName || '').toLowerCase().includes(q) ||
      (v.email || '').toLowerCase().includes(q) ||
      (v.phone || '').toLowerCase().includes(q);

    const matchesStatus = !filterStatus || v.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Render Check: Error state — uses standardised ErrorState component
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState
          title="Failed to Load Vendor Directory"
          message="Something went wrong while loading the suppliers catalog. Please try again."
          onRetry={fetchResources}
        />
      </div>
    );
  }

  // Render Check: Loading state — uses standardised Loader component
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading suppliers database..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Vendors Directory"
        subtitle="Manage material suppliers, contact profiles, and billing details."
        actions={
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        }
      />

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-405"
              placeholder="Search by vendor name, code, contact, email..."
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-705 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Data Table Grid */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <VendorList
          vendors={filteredVendors}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={setVendorToDelete}
          loading={false}
        />
      </div>

      {/* Supplier Register / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedVendor ? `Modify Supplier Account (${selectedVendor.code})` : 'Register Supplier Vendor'}
        size="lg"
      >
        <VendorForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedVendor}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Supplier detail cards Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Supplier details"
        size="lg"
      >
        <VendorDetailCard
          vendor={selectedVendor}
          orders={orders}
          onViewOrder={handleViewOrderFromVendorCard}
          onClose={() => setIsDetailOpen(false)}
        />
      </Modal>

      {/* Relational Purchase Order Document Details Modal */}
      <Modal
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        title="Purchase Order details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <PurchaseOrderDetail
              order={selectedOrder}
              vendor={selectedVendor}
              products={products}
            />
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsOrderDetailOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
              >
                Close document
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Vendor delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!vendorToDelete}
        onClose={() => setVendorToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Vendor Supplier?"
        message={`Are you sure you want to remove supplier ${vendorToDelete?.name} (${vendorToDelete?.code})? This will delete their catalog details.`}
        confirmText="Remove Supplier"
        type="danger"
      />
    </div>
  );
};

export default VendorsPage;
