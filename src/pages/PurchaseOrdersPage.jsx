/**
 * PURPOSE:
 * Serves as the primary control center for Purchase RFQs, Approvals, and Goods Receipts.
 *
 * BUSINESS USE:
 * Allows procurement managers to draft requests for quotations (RFQs), submit orders to suppliers,
 * log incoming materials to warehouse stock (handling partial batches), and monitor cash outlays.
 *
 * API USAGE:
 * - Reads orders via `purchaseService.getPurchaseOrders()`.
 * - Reads vendors via `purchaseService.getVendors()`.
 * - Reads products via `productService.getProducts()`.
 * - Writes POs via `purchaseService.createPurchaseOrder()` / `updatePurchaseOrder()`.
 * - Confirms POs via `purchaseService.confirmPurchaseOrder()`.
 * - Receives goods via `purchaseService.receivePurchaseOrder()`.
 * - Cancels POs via `purchaseService.cancelPurchaseOrder()`.
 *
 * LOGIC FLOW:
 * - Employs a single master board with comprehensive filter inputs (Vendor, Status, Date Ranges)
 *   and search queries (matching order number or supplier name).
 * - Restricts action transitions depending on order status (e.g. Receipt is only allowed on Confirmed/Partial).
 * - Handles Loading, Empty, and Error states cleanly.
 */

import React, { useState, useEffect } from 'react';
import purchaseService from '../services/purchaseService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, Search, FileText, Calendar, Filter } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import PurchaseOrderList from '../components/purchase/PurchaseOrderList';
import PurchaseOrderForm from '../components/purchase/PurchaseOrderForm';
import PurchaseOrderDetail from '../components/purchase/PurchaseOrderDetail';
import ReceiveGoodsForm from '../components/purchase/ReceiveGoodsForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const PurchaseOrdersPage = () => {
  const { showToast } = useToast();

  // Resource lists
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search & Filter state hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Modals & Selected entities
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Fetch all resources concurrently
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [ordersList, vendsList, prodsList] = await Promise.all([
        purchaseService.getPurchaseOrders(),
        purchaseService.getVendors(),
        productService.getProducts()
      ]);
      
      setOrders(Array.isArray(ordersList) ? ordersList : []);
      // Only link active vendors for select inputs, but retain all for mapping
      setVendors(Array.isArray(vendsList) ? vendsList : []);
      setProducts(Array.isArray(prodsList) ? prodsList : []);
    } catch (err) {
      console.warn('[PurchaseOrdersPage] fetch failed:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Purchase Order Actions

  const handleCreateOrUpdate = async (poData) => {
    try {
      if (selectedOrder) {
        // Edit mode
        await purchaseService.updatePurchaseOrder(selectedOrder.id, poData);
        showToast('Purchase Order updated successfully.', 'success');
      } else {
        // Create mode
        await purchaseService.createPurchaseOrder(poData);
        showToast('Purchase RFQ drafted successfully.', 'success');
      }
      setIsFormOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save purchase order.', 'error');
    }
  };

  const handleConfirmPO = async (orderId) => {
    try {
      await purchaseService.confirmPurchaseOrder(orderId);
      showToast('Purchase Order confirmed! RFQ has been sent to supplier.', 'success');
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to confirm Purchase Order.', 'error');
    }
  };

  const handleCancelPO = async () => {
    if (!orderToCancel) return;
    try {
      await purchaseService.cancelPurchaseOrder(orderToCancel.id);
      showToast(`Purchase Order ${orderToCancel.orderNumber} cancelled successfully.`, 'success');
      setOrderToCancel(null);
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to cancel Purchase Order.', 'error');
    }
  };

  const handleProcessReceipt = async (receiptData) => {
    if (!selectedOrder) return;
    try {
      await purchaseService.receivePurchaseOrder(selectedOrder.id, receiptData);
      showToast(`Shipment parcel successfully received for PO ${selectedOrder.orderNumber}!`, 'success');
      setIsReceiveOpen(false);
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to process materials receipt.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await purchaseService.deletePurchaseOrder(orderToDelete.id);
      showToast(`Draft quotation ${orderToDelete.orderNumber} removed successfully.`, 'success');
      setOrderToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete quotation.', 'error');
    }
  };

  // Triggers handlers

  const handleAddClick = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleConfirmClickFromList = async (order) => {
    await handleConfirmPO(order.id);
  };

  const handleReceiveClickFromList = (order) => {
    setSelectedOrder(order);
    setIsReceiveOpen(true);
  };

  // Filtering calculations

  const filteredOrders = (orders || []).filter((o) => {
    const q = searchQuery.toLowerCase();
    const vend = (vendors || []).find(v => v.id === o.vendorId);
    const vendName = vend ? (vend.name || '').toLowerCase() : '';
    const vendCode = vend ? (vend.code || '').toLowerCase() : '';

    const matchesSearch = (o.orderNumber || '').toLowerCase().includes(q) || vendName.includes(q) || vendCode.includes(q);
    const matchesStatus = !filterStatus || o.status === filterStatus;
    const matchesVendor = !filterVendor || o.vendorId === filterVendor;

    // Date range boundaries
    let matchesDate = true;
    if (filterStartDate) {
      matchesDate = matchesDate && o.orderDate >= filterStartDate;
    }
    if (filterEndDate) {
      matchesDate = matchesDate && o.orderDate <= filterEndDate;
    }

    return matchesSearch && matchesStatus && matchesVendor && matchesDate;
  });

  const selectedVendor = selectedOrder
    ? vendors.find(v => v.id === selectedOrder.vendorId)
    : null;

  // Render Check: Error state — uses standardised ErrorState component
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState
          title="Failed to Load Purchase Data"
          message="Something went wrong while fetching purchase orders, vendors, and products. Please try again."
          onRetry={fetchResources}
        />
      </div>
    );
  }

  // Render Check: Loading state — uses standardised Loader component
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading purchase workspace..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Purchase Orders"
        isDemo={true}
        subtitle="Manage material procurement, request quotations, and process material receipts."
        actions={
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create RFQ</span>
          </button>
        }
      />

      {/* Filters Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search order/supplier */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-405"
              placeholder="Search PO number or vendor..."
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft (RFQ)</option>
            <option value="confirmed">Confirmed</option>
            <option value="partially_received">Partially Received</option>
            <option value="fully_received">Fully Received</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Vendor filter */}
          <select
            value={filterVendor}
            onChange={(e) => setFilterVendor(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Date range start */}
          <div className="flex gap-2 items-center md:col-span-2">
            <div className="relative flex-1">
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded text-slate-700 focus:outline-none"
                title="Start Date"
              />
            </div>
            <span className="text-slate-400 font-bold text-xs">-</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded text-slate-700 focus:outline-none"
                title="End Date"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid List Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <PurchaseOrderList
          orders={filteredOrders}
          vendors={vendors}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onConfirm={handleConfirmClickFromList}
          onReceive={handleReceiveClickFromList}
          onCancel={setOrderToCancel}
          onDelete={setOrderToDelete}
          loading={false}
        />
      </div>

      {/* Purchase RFQ creation/editing Form modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedOrder ? `Edit Purchase Order (${selectedOrder.orderNumber})` : 'Create Purchase RFQ'}
        size="lg"
      >
        <PurchaseOrderForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedOrder}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* PO Document Details View Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Purchase Order details"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <PurchaseOrderDetail
              order={selectedOrder}
              vendor={selectedVendor}
              products={products}
            />

            {/* Shipment and Approval Actions */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 no-print">
              {/* Confirm RFQ */}
              {selectedOrder.status === 'draft' && (
                <button
                  onClick={() => handleConfirmPO(selectedOrder.id)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
                >
                  Confirm Purchase Order
                </button>
              )}

              {/* Receive Goods dispatch */}
              {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'partially_received') && (
                <button
                  onClick={() => setIsReceiveOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors"
                >
                  Receive Goods / Intake
                </button>
              )}

              {/* Cancel PO */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'fully_received' && (
                <button
                  onClick={() => setOrderToCancel(selectedOrder)}
                  className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                >
                  Cancel Order
                </button>
              )}

              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Receive Goods Intake Form Modal */}
      <Modal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        title="Intake Goods receipt"
        size="md"
      >
        <ReceiveGoodsForm
          order={selectedOrder}
          products={products}
          onSubmit={handleProcessReceipt}
          onCancel={() => setIsReceiveOpen(false)}
        />
      </Modal>

      {/* Hard delete PO confirmation dialog */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDelete}
        title="Delete RFQ?"
        message={`Are you sure you want to permanently delete purchase quotation draft ${orderToDelete?.orderNumber}?`}
        confirmText="Delete RFQ"
        type="danger"
      />

      {/* Cancel PO confirmation dialog */}
      <ConfirmDialog
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleCancelPO}
        title="Cancel Purchase Order?"
        message={`Are you sure you want to cancel Purchase Order ${orderToCancel?.orderNumber}? This will halt any supplier operations.`}
        confirmText="Cancel Order"
        type="danger"
      />
    </div>
  );
};

export default PurchaseOrdersPage;
