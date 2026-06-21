/**
 * PURPOSE:
 * Serves as the primary control center for Sales Quotations, Customer Catalog accounts, and Shipment tracking.
 *
 * BUSINESS USE:
 * Allows commercial operators to draft quotes, approve and confirm orders (reserving stock),
 * log partial/full shipments (deducting inventory), and manage client address and GST profiles.
 *
 * API USAGE:
 * - Reads orders via `salesService.getSalesOrders()`.
 * - Reads customers via `salesService.getCustomers()`.
 * - Creates/Updates orders via `salesService.createSalesOrder()` / `updateSalesOrder()`.
 * - Cancels/Confirms orders via `salesService.cancelSalesOrder()` / `confirmSalesOrder()`.
 * - Registers client CRUD operations via customer sub-methods in `salesService`.
 * - Processes deliveries via `salesService.processSalesOrderDelivery()`.
 *
 * LOGIC EXPLANATION:
 * - Implements a 2-tab switcher: "Sales Orders" vs "Customers".
 * - Implements search queries and filter boundaries (Status, Date Range, and Customer lookup) client-side.
 * - Restricts actions based on order status (e.g. shipping is only available for confirmed/partial orders).
 * - Enforces relational delete checks: prevents deleting a customer if they have active orders.
 * - Handles Loading, Empty, and Error states cleanly.
 */

import React, { useState, useEffect } from 'react';
import salesService from '../services/salesService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  UserPlus, 
  Search, 
  FileText, 
  User, 
  Edit2, 
  Trash2, 
  Eye, 
  AlertTriangle 
} from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SalesOrderList from '../components/sales/SalesOrderList';
import SalesOrderForm from '../components/sales/SalesOrderForm';
import SalesOrderDetail from '../components/sales/SalesOrderDetail';
import CustomerForm from '../components/sales/CustomerForm';
import DeliveryForm from '../components/sales/DeliveryForm';
import ProcurementBanner from '../components/sales/ProcurementBanner';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';

export const SalesOrdersPage = () => {
  const { showToast } = useToast();

  // Tab state: 'orders' or 'customers'
  const [activeTab, setActiveTab] = useState('orders');

  // Master lists
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search & Filter state hooks
  const [orderQuery, setOrderQuery] = useState('');
  const [custQuery, setCustQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Modals & selected entities
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isCustFormOpen, setIsCustFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isCustDetailOpen, setIsCustDetailOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [custToDelete, setCustToDelete] = useState(null);

  // Fetch all resources concurrently
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [ordersList, custsList, prodsList] = await Promise.all([
        salesService.getSalesOrders(),
        salesService.getCustomers(),
        productService.getProducts()
      ]);
      setOrders(Array.isArray(ordersList) ? ordersList : []);
      setCustomers(Array.isArray(custsList) ? custsList : []);
      setProducts(Array.isArray(prodsList) ? prodsList : []);
    } catch (err) {
      console.warn('[SalesOrdersPage] fetch failed:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Customer Actions

  const handleCreateOrUpdateCustomer = async (custData) => {
    try {
      if (selectedCustomer) {
        // Edit mode
        await salesService.updateCustomer(selectedCustomer.id, custData);
        showToast('Customer profile updated successfully.', 'success');
      } else {
        // Create mode
        await salesService.createCustomer(custData);
        showToast('Customer registered successfully.', 'success');
      }
      setIsCustFormOpen(false);
      setSelectedCustomer(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save customer profile.', 'error');
    }
  };

  const handleDeleteCustomer = async () => {
    if (!custToDelete) return;
    
    // Safety constraint: prevent deleting if customer has orders
    const hasOrders = orders.some(o => o.customerId === custToDelete.id);
    if (hasOrders) {
      showToast('Cannot delete customer. Active sales orders are linked to this client.', 'warning');
      setCustToDelete(null);
      return;
    }

    try {
      await salesService.deleteCustomer(custToDelete.id);
      showToast('Customer deleted successfully.', 'success');
      setCustToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete customer.', 'error');
    }
  };

  // Order Actions

  const handleCreateOrUpdateOrder = async (orderData) => {
    try {
      if (selectedOrder) {
        await salesService.updateSalesOrder(selectedOrder.id, orderData);
        showToast('Sales Order updated successfully.', 'success');
      } else {
        await salesService.createSalesOrder(orderData);
        showToast('Sales Order Quotation drafted successfully.', 'success');
      }
      setIsOrderFormOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save sales order.', 'error');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await salesService.confirmSalesOrder(orderId);
      showToast('Sales Order confirmed successfully! Stock reserved.', 'success');
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to confirm Sales Order.', 'error');
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToDelete) return;
    try {
      await salesService.cancelSalesOrder(orderToDelete.id);
      showToast(`Sales Order ${orderToDelete.orderNumber} successfully cancelled. Stock released.`, 'success');
      setOrderToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to cancel order.', 'error');
    }
  };

  const handleProcessDelivery = async (deliveryDetails) => {
    if (!selectedOrder) return;
    try {
      await salesService.processSalesOrderDelivery(selectedOrder.id, deliveryDetails);
      showToast(`Shipment delivery logged successfully for order ${selectedOrder.orderNumber}!`, 'success');
      setIsDeliveryOpen(false);
      setIsDetailOpen(false);
      setSelectedOrder(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to log delivery shipment.', 'error');
    }
  };

  // Trigger click handlers

  const handleAddOrderClick = () => {
    setSelectedOrder(null);
    setIsOrderFormOpen(true);
  };

  const handleEditOrderClick = (order) => {
    setSelectedOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleViewOrderClick = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleAddCustClick = () => {
    setSelectedCustomer(null);
    setIsCustFormOpen(true);
  };

  const handleEditCustClick = (cust) => {
    setSelectedCustomer(cust);
    setIsCustFormOpen(true);
  };

  const handleViewCustClick = (cust) => {
    setSelectedCustomer(cust);
    setIsCustDetailOpen(true);
  };

  // Filtering calculations

  // 1. Filter Sales Orders
  const filteredOrders = (orders || []).filter((o) => {
    const q = orderQuery.toLowerCase();
    const cust = (customers || []).find(c => c.id === o.customerId);
    const custName = cust ? (cust.name || '').toLowerCase() : '';
    
    const matchesSearch = (o.orderNumber || '').toLowerCase().includes(q) || custName.includes(q);
    const matchesStatus = !filterStatus || o.status === filterStatus;
    const matchesCustomer = !filterCustomer || o.customerId === filterCustomer;
    
    // Date Range check
    let matchesDate = true;
    if (filterStartDate) {
      matchesDate = matchesDate && o.orderDate >= filterStartDate;
    }
    if (filterEndDate) {
      matchesDate = matchesDate && o.orderDate <= filterEndDate;
    }

    return matchesSearch && matchesStatus && matchesCustomer && matchesDate;
  });

  // 2. Filter Customers
  const filteredCustomers = (customers || []).filter((c) => {
    const q = custQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  });

  // Customer Table columns definitions
  const customerColumns = [
    { header: 'Customer Name', key: 'name', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Contact Person', key: 'contactName' },
    { header: 'Email Address', key: 'email' },
    { header: 'Phone Number', key: 'phone' },
    { header: 'GST/Tax ID', key: 'gstNumber', cellClassName: 'font-mono text-xs uppercase text-slate-500' },
    { 
      header: 'Location', 
      key: 'location',
      render: (row) => `${row.city || ''}, ${row.state || ''} (${row.country || ''})`
    },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end no-print">
          <button
            onClick={() => handleViewCustClick(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-850"
            title="View Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditCustClick(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-850"
            title="Edit Customer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCustToDelete(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
            title="Delete Customer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const currentOrderCustomer = selectedOrder
    ? customers.find(c => c.id === selectedOrder.customerId)
    : null;

  // Render Check: Error State
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-2 animate-bounce" />
        <h3 className="text-sm font-semibold text-rose-600">Failed to load sales resources</h3>
        <button
          onClick={fetchResources}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Retry Fetching
        </button>
      </div>
    );
  }

  // Render Check: Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-2 text-slate-500 text-sm">
        <RefreshCwIcon className="w-6 h-6 text-blue-600 animate-spin" />
        <span>Loading sales details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Sales Management"
        subtitle="Manage client portfolios, issue quotations, and track order deliveries."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddCustClick}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-550" />
              <span>Register Customer</span>
            </button>
            <button
              onClick={handleAddOrderClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quotation</span>
            </button>
          </div>
        }
      />

      {/* Tab Switcher Controls */}
      <div className="border-b border-slate-200 flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600'
          } flex items-center gap-1.5`}
        >
          <FileText className="w-4 h-4" />
          <span>Sales Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'customers' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600'
          } flex items-center gap-1.5`}
        >
          <User className="w-4 h-4" />
          <span>Customers ({customers.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: SALES ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Grid */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search Order/Customer */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search order number or client..."
                />
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft (Quotation)</option>
                <option value="confirmed">Confirmed</option>
                <option value="partially_delivered">Partially Delivered</option>
                <option value="fully_delivered">Fully Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Customer lookup filter */}
              <select
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Date Filters block */}
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none"
                  title="Start Date"
                />
                <span className="text-slate-400 font-bold text-xs">-</span>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none"
                  title="End Date"
                />
              </div>
            </div>
          </div>

          {/* Sales Quotations List grid */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <SalesOrderList
              orders={filteredOrders}
              customers={customers}
              onEdit={handleEditOrderClick}
              onCancelOrder={setOrderToDelete}
              onView={handleViewOrderClick}
              loading={false}
            />
          </div>
        </div>
      )}

      {/* TAB CONTENT: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Customers Search filter */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={custQuery}
                onChange={(e) => setCustQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search by customer name, email, or phone number..."
              />
            </div>
          </div>

          {/* Customers Data Table grid */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <DataTable
              columns={customerColumns}
              data={filteredCustomers}
              loading={false}
              emptyMessage="No customer accounts registered."
            />
          </div>
        </div>
      )}

      {/* Sales Order Form Modal */}
      <Modal
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        title={selectedOrder ? 'Edit Sales Quotation' : 'Create Sales Quotation'}
        size="lg"
      >
        <SalesOrderForm
          onSubmit={handleCreateOrUpdateOrder}
          initialData={selectedOrder}
          onCancel={() => setIsOrderFormOpen(false)}
        />
      </Modal>

      {/* Customer Form Modal */}
      <Modal
        isOpen={isCustFormOpen}
        onClose={() => setIsCustFormOpen(false)}
        title={selectedCustomer ? 'Modify Customer Profile' : 'Register Customer Account'}
        size="lg"
      >
        <CustomerForm
          onSubmit={handleCreateOrUpdateCustomer}
          initialData={selectedCustomer}
          onCancel={() => setIsCustFormOpen(false)}
        />
      </Modal>

      {/* Sales Order Details View Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Sales Order Document Details"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Shortage check alert banner */}
            <ProcurementBanner order={selectedOrder} products={products} />

            <SalesOrderDetail
              order={selectedOrder}
              customer={currentOrderCustomer}
              products={products}
            />

            {/* Shipment and Confirmation Action controls */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 no-print">
              {/* Confirm quotation */}
              {selectedOrder.status === 'draft' && (
                <button
                  onClick={() => handleConfirmOrder(selectedOrder.id)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
                >
                  Confirm Sales Order
                </button>
              )}
              
              {/* Delivery dispatch trigger */}
              {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'partially_delivered') && (
                <button
                  onClick={() => setIsDeliveryOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors"
                >
                  Confirm Shipment Dispatch
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

      {/* Delivery shipment logging Modal */}
      <Modal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        title="Dispatch Shipment details"
        size="md"
      >
        <DeliveryForm
          order={selectedOrder}
          products={products}
          onSubmit={handleProcessDelivery}
          onCancel={() => setIsDeliveryOpen(false)}
        />
      </Modal>

      {/* Customer Details popup Card */}
      <Modal
        isOpen={isCustDetailOpen}
        onClose={() => setIsCustDetailOpen(false)}
        title="Customer Profile Details"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">{selectedCustomer.name}</h4>
                <p className="text-slate-400 font-medium">GST Number: {selectedCustomer.gstNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-slate-650 font-medium">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Contact Representative</p>
                <p className="text-xs text-slate-700 mt-0.5">{selectedCustomer.contactName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                <p className="text-xs text-slate-700 mt-0.5">{selectedCustomer.phone || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p className="text-xs text-slate-700 mt-0.5">{selectedCustomer.email || 'N/A'}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Billing / Shipping Address</p>
                <p className="text-xs text-slate-700 mt-0.5">
                  {selectedCustomer.address || 'N/A'}
                  {selectedCustomer.city && `, ${selectedCustomer.city}`}
                  {selectedCustomer.state && `, ${selectedCustomer.state}`}
                  {selectedCustomer.country && `, ${selectedCustomer.country}`}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsCustDetailOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete/Cancel Quotation confirm dialog */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleCancelOrder}
        title="Cancel Sales Order?"
        message={`Are you sure you want to cancel Sales Order Quotation ${orderToDelete?.orderNumber}? This will release any stock reservations.`}
        confirmText="Cancel Order"
        type="danger"
      />

      {/* Delete Customer confirm dialog */}
      <ConfirmDialog
        isOpen={!!custToDelete}
        onClose={() => setCustToDelete(null)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer profile?"
        message={`Are you sure you want to delete client account ${custToDelete?.name}? This cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

// Loader Icon component
const RefreshCwIcon = ({ className }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

export default SalesOrdersPage;
