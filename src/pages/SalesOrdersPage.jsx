// src/pages/SalesOrdersPage.jsx
// Sales orders workspace. Handles sales order workflows, customer registrations,
// and delivery processing.

import React, { useState, useEffect } from 'react';
import salesService from '../services/salesService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, UserPlus } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import SalesOrderList from '../components/sales/SalesOrderList';
import SalesOrderForm from '../components/sales/SalesOrderForm';
import SalesOrderDetail from '../components/sales/SalesOrderDetail';
import CustomerForm from '../components/sales/CustomerForm';
import DeliveryForm from '../components/sales/DeliveryForm';
import ProcurementBanner from '../components/sales/ProcurementBanner';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const SalesOrdersPage = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals & triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCustOpen, setIsCustOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const [ordersList, custsList, prodsList] = await Promise.all([
        salesService.getSalesOrders(),
        salesService.getCustomers(),
        productService.getProducts()
      ]);
      setOrders(ordersList);
      setCustomers(custsList);
      setProducts(prodsList);
    } catch (err) {
      showToast('Failed to load sales resources.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateOrUpdate = async (orderData) => {
    try {
      if (selectedOrder) {
        await salesService.updateSalesOrder(selectedOrder.id, orderData);
        showToast('Sales Order updated successfully.', 'success');
      } else {
        await salesService.createSalesOrder(orderData);
        showToast('Sales Order created successfully.', 'success');
      }
      setIsFormOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save sales order.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await salesService.deleteSalesOrder(orderToDelete.id);
      showToast('Sales Order deleted successfully.', 'success');
      setOrderToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete order.', 'error');
    }
  };

  const handleCreateCustomer = async (custData) => {
    try {
      await salesService.createCustomer(custData);
      showToast('Customer client registered successfully.', 'success');
      setIsCustOpen(false);
      fetchResources();
    } catch (err) {
      showToast('Failed to register customer.', 'error');
    }
  };

  const handleProcessDelivery = async (deliveryDetails) => {
    if (!selectedOrder) return;
    try {
      // Shifting status to completed triggers inventory stock reduction automatically in standalone service
      await salesService.updateSalesOrder(selectedOrder.id, {
        status: 'completed',
        deliveryDetails
      });
      showToast(`Sales Order ${selectedOrder.orderNumber} successfully shipped & completed! Stock deducted.`, 'success');
      setIsDeliveryOpen(false);
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to complete delivery.', 'error');
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

  const handleDeliveryClick = () => {
    setIsDeliveryOpen(true);
  };

  // Filter orders by search
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const cust = customers.find(c => c.id === o.customerId);
    const custName = cust ? cust.name.toLowerCase() : '';
    
    return o.orderNumber.toLowerCase().includes(q) || custName.includes(q);
  });

  const selectedCustomer = selectedOrder
    ? customers.find(c => c.id === selectedOrder.customerId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Sales Orders"
        subtitle="Manage customer orders, issue quotations, and track shipments."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search orders..." />
            <button
              onClick={() => setIsCustOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>Add Customer</span>
            </button>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quotation</span>
            </button>
          </div>
        }
      />

      {/* Orders List */}
      <SalesOrderList
        orders={filteredOrders}
        customers={customers}
        onEdit={handleEditClick}
        onDelete={setOrderToDelete}
        onView={handleViewClick}
        loading={loading}
      />

      {/* Sales Order Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedOrder ? 'Edit Sales Order' : 'Create Sales Order Quotation'}
        size="lg"
      >
        <SalesOrderForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedOrder}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Customer Form Modal */}
      <Modal
        isOpen={isCustOpen}
        onClose={() => setIsCustOpen(false)}
        title="Register New Customer"
        size="sm"
      >
        <CustomerForm
          onSubmit={handleCreateCustomer}
          onCancel={() => setIsCustOpen(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Sales Order Details View"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Shortage Check Warning banner */}
            <ProcurementBanner order={selectedOrder} products={products} />

            <SalesOrderDetail
              order={selectedOrder}
              customer={selectedCustomer}
              products={products}
            />

            {/* Quick Actions inside detail view */}
            {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 no-print">
                <button
                  onClick={handleDeliveryClick}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors"
                >
                  Confirm Shipment (Dispatch)
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delivery Form Modal */}
      <Modal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        title="Confirm Goods Dispatch"
        size="sm"
      >
        <DeliveryForm
          onSubmit={handleProcessDelivery}
          onCancel={() => setIsDeliveryOpen(false)}
          orderNumber={selectedOrder?.orderNumber}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDelete}
        title="Cancel Quotation?"
        message={`Are you sure you want to remove Sales Quotation ${orderToDelete?.orderNumber}? This cannot be undone.`}
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default SalesOrdersPage;
