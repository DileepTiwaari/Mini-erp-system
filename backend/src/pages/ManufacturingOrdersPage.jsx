// src/pages/ManufacturingOrdersPage.jsx
// Manufacturing workspace. Handles shop floor production runs, BOM checks,
// and Kanban work order updates.

import React, { useState, useEffect } from 'react';
import manufacturingService from '../services/manufacturingService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import SearchBar from '../components/common/SearchBar';
import ManufacturingOrderList from '../components/manufacturing/ManufacturingOrderList';
import ManufacturingOrderForm from '../components/manufacturing/ManufacturingOrderForm';
import ManufacturingOrderDetail from '../components/manufacturing/ManufacturingOrderDetail';
import WorkOrderBoard from '../components/manufacturing/WorkOrderBoard';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const ManufacturingOrdersPage = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [boms, setBoms] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [mosList, prodsList, bomsList, wosList, wcsList] = await Promise.all([
        manufacturingService.getManufacturingOrders(),
        productService.getProducts(),
        manufacturingService.getBoms(),
        manufacturingService.getWorkOrders(),
        manufacturingService.getWorkCenters()
      ]);
      setOrders(mosList);
      setProducts(prodsList);
      setBoms(bomsList);
      setWorkOrders(wosList);
      setWorkCenters(wcsList);
    } catch (err) {
      setError(true);
      showToast('Failed to load shop floor database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateOrder = async (moData) => {
    try {
      await manufacturingService.createManufacturingOrder(moData);
      showToast('Manufacturing run scheduled. Subtasks assigned.', 'success');
      setIsFormOpen(false);
      fetchResources();
    } catch (err) {
      showToast('Failed to schedule manufacturing.', 'error');
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToDelete) return;
    try {
      await manufacturingService.deleteManufacturingOrder(orderToDelete.id);
      showToast('Manufacturing run cancelled successfully.', 'success');
      setOrderToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to cancel order.', 'error');
    }
  };

  const handleWorkOrderStatusChange = async (woId, newStatus) => {
    try {
      await manufacturingService.updateWorkOrderStatus(woId, newStatus);
      showToast('Operational step status updated.', 'success');
      fetchResources();
    } catch (err) {
      showToast('Failed to update step status.', 'error');
    }
  };

  const handleMoComplete = async (mo) => {
    try {
      // Completed status triggers component consumption and output finished good stock additions in service
      await manufacturingService.updateManufacturingOrder(mo.id, {
        status: 'done'
      });
      showToast(`Manufacturing run ${mo.moNumber} marked complete. Inventory levels adjusted!`, 'success');
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to complete manufacturing run.', 'error');
    }
  };

  const handleMoStart = async (mo) => {
    try {
      await manufacturingService.updateManufacturingOrder(mo.id, {
        status: 'in_progress'
      });
      showToast(`Manufacturing run ${mo.moNumber} started!`, 'success');
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to start run.', 'error');
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Filters
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const prod = products.find(p => p.id === o.productId);
    const prodName = prod ? prod.name.toLowerCase() : '';
    return o.moNumber.toLowerCase().includes(q) || prodName.includes(q);
  });

  const selectedProduct = selectedOrder
    ? products.find(p => p.id === selectedOrder.productId)
    : null;

  const selectedBom = selectedOrder
    ? boms.find(b => b.id === selectedOrder.bomId)
    : null;

  const activeOrderWorkOrders = selectedOrder
    ? workOrders.filter(w => w.moId === selectedOrder.id)
    : [];

  // Render Check: Error state — uses standardised ErrorState component
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState
          title="Failed to Load Manufacturing Data"
          message="Something went wrong while loading shop floor orders, BOMs, and work centers. Please try again."
          onRetry={fetchResources}
        />
      </div>
    );
  }

  // Render Check: Loading state — uses standardised Loader component
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading shop floor workspace..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Mfg Orders & Shop Floor"
        subtitle="Schedule assembly runs, track components safety alerts, and manage work center stations."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search MOs..." />
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Run</span>
            </button>
          </div>
        }
      />

      {/* Kanban Board of subtask work orders */}
      <div className="border-b border-slate-200 pb-6 mb-2 no-print">
        <h3 className="text-base font-bold text-slate-800">Operational Shop Floor Task board</h3>
        <p className="text-slate-500 text-xs mt-0.5">Quickly update operations status from station checklist below.</p>
        <WorkOrderBoard
          workOrders={workOrders}
          manufacturingOrders={orders}
          workCenters={workCenters}
          onStatusChange={handleWorkOrderStatusChange}
        />
      </div>

      {/* Orders List */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">Scheduled Manufacturing Orders</h3>
        <ManufacturingOrderList
          orders={filteredOrders}
          products={products}
          onEdit={handleViewClick} // Detailed triggers
          onDelete={setOrderToDelete}
          onView={handleViewClick}
          loading={loading}
        />
      </div>

      {/* MO Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Schedule Manufacturing Production Run"
        size="md"
      >
        <ManufacturingOrderForm
          onSubmit={handleCreateOrder}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Manufacturing Order Information Details"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <ManufacturingOrderDetail
              order={selectedOrder}
              product={selectedProduct}
              bom={selectedBom}
              components={products}
              workOrders={activeOrderWorkOrders}
              workCenters={workCenters}
            />

            {/* Production Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 no-print">
              {selectedOrder.status === 'planned' && (
                <button
                  onClick={() => handleMoStart(selectedOrder)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
                >
                  Start Production Run
                </button>
              )}

              {selectedOrder.status === 'in_progress' && (
                <button
                  onClick={() => handleMoComplete(selectedOrder)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors"
                >
                  Signoff Production (Complete MO)
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Deletion confirmation */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleCancelOrder}
        title="Cancel Manufacturing Run?"
        message={`Are you sure you want to cancel and remove manufacturing order ${orderToDelete?.moNumber}? Associated sub-operational work orders will be lost.`}
        confirmText="Cancel Run"
        type="danger"
      />
    </div>
  );
};

export default ManufacturingOrdersPage;
