// src/pages/PurchaseOrdersPage.jsx
// Purchase orders workspace. Handles vendor procurements, requests, and goods receipts.

import React, { useState, useEffect } from 'react';
import purchaseService from '../services/purchaseService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, UserPlus } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import PurchaseOrderList from '../components/purchase/PurchaseOrderList';
import PurchaseOrderForm from '../components/purchase/PurchaseOrderForm';
import PurchaseOrderDetail from '../components/purchase/PurchaseOrderDetail';
import VendorForm from '../components/purchase/VendorForm';
import ReceiveGoodsForm from '../components/purchase/ReceiveGoodsForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const PurchaseOrdersPage = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const [ordersList, vendsList, prodsList] = await Promise.all([
        purchaseService.getPurchaseOrders(),
        purchaseService.getVendors(),
        productService.getProducts()
      ]);
      setOrders(ordersList);
      setVendors(vendsList);
      setProducts(prodsList);
    } catch (err) {
      showToast('Failed to load purchase orders database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateOrUpdate = async (poData) => {
    try {
      if (selectedOrder) {
        await purchaseService.updatePurchaseOrder(selectedOrder.id, poData);
        showToast('Purchase Order updated successfully.', 'success');
      } else {
        await purchaseService.createPurchaseOrder(poData);
        showToast('Purchase Order drafted successfully.', 'success');
      }
      setIsFormOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save purchase order.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await purchaseService.deletePurchaseOrder(orderToDelete.id);
      showToast('Purchase Order deleted successfully.', 'success');
      setOrderToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete order.', 'error');
    }
  };

  const handleCreateVendor = async (vendorData) => {
    try {
      await purchaseService.createVendor(vendorData);
      showToast('Vendor supplier added successfully.', 'success');
      setIsVendorOpen(false);
      fetchResources();
    } catch (err) {
      showToast('Failed to add vendor.', 'error');
    }
  };

  const handleProcessReceipt = async (receiptData) => {
    if (!selectedOrder) return;
    try {
      // Completed status triggers inventory stock addition in service
      await purchaseService.updatePurchaseOrder(selectedOrder.id, {
        status: 'completed',
        receiptData
      });
      showToast(`Purchase Order ${selectedOrder.orderNumber} successfully received! Inventory stock updated.`, 'success');
      setIsReceiveOpen(false);
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to log goods receipt.', 'error');
    }
  };

  const handleApprovePO = async () => {
    if (!selectedOrder) return;
    try {
      await purchaseService.updatePurchaseOrder(selectedOrder.id, {
        status: 'approved'
      });
      showToast(`Purchase Order ${selectedOrder.orderNumber} is now approved and active.`, 'success');
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to approve order.', 'error');
    }
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleAddClick = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  // Filter
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const vend = vendors.find(v => v.id === o.vendorId);
    const vendName = vend ? vend.name.toLowerCase() : '';
    return o.orderNumber.toLowerCase().includes(q) || vendName.includes(q);
  });

  const selectedVendor = selectedOrder
    ? vendors.find(v => v.id === selectedOrder.vendorId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage supplier procurement, request quotations, and process material receipts."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search POs..." />
            <button
              onClick={() => setIsVendorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>Add Vendor</span>
            </button>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create RFQ</span>
            </button>
          </div>
        }
      />

      {/* List */}
      <PurchaseOrderList
        orders={filteredOrders}
        vendors={vendors}
        onEdit={handleEditClick}
        onDelete={setOrderToDelete}
        onView={handleViewClick}
        loading={loading}
      />

      {/* PO Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedOrder ? 'Edit Purchase Order' : 'Create Purchase RFQ'}
        size="lg"
      >
        <PurchaseOrderForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedOrder}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Vendor Form Modal */}
      <Modal
        isOpen={isVendorOpen}
        onClose={() => setIsVendorOpen(false)}
        title="Register Supplier Vendor"
        size="sm"
      >
        <VendorForm
          onSubmit={handleCreateVendor}
          onCancel={() => setIsVendorOpen(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Purchase Order Details View"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <PurchaseOrderDetail
              order={selectedOrder}
              vendor={selectedVendor}
              products={products}
            />

            {/* Operations buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 no-print">
              {selectedOrder.status === 'draft' && (
                <button
                  onClick={handleApprovePO}
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
                >
                  Approve Purchase Order
                </button>
              )}

              {selectedOrder.status === 'approved' && (
                <button
                  onClick={() => setIsReceiveOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors"
                >
                  Receive Goods / Inventory
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Receive Goods Modal */}
      <Modal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        title="Confirm Materials Receipt"
        size="sm"
      >
        <ReceiveGoodsForm
          onSubmit={handleProcessReceipt}
          onCancel={() => setIsReceiveOpen(false)}
          orderNumber={selectedOrder?.orderNumber}
        />
      </Modal>

      {/* Deletion confirmation */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDelete}
        title="Delete RFQ?"
        message={`Are you sure you want to delete purchase order draft ${orderToDelete?.orderNumber}?`}
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default PurchaseOrdersPage;
