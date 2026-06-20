/**
 * PURPOSE:
 * Renders the form to create or edit Purchase Orders (POs) and Requests for Quotations (RFQs).
 *
 * BUSINESS USE:
 * Allows procurement managers to select a vendor, define expected delivery dates,
 * add multiple product lines, configure purchase quantities, and edit costs.
 * It computes line subtotals, order total, tax total, and grand total in real-time.
 *
 * API USAGE:
 * None directly. Invokes submit and cancel callbacks.
 * Reads vendors list via `purchaseService.getVendors()` and products via `productService.getProducts()`.
 *
 * LOGIC FLOW:
 * - Real-time auto-calculations: line total = quantity * unitCost.
 * - Order total = sum of line totals.
 * - Tax total = 18% of order total.
 * - Grand total = order total + tax total.
 * - Enforces validations: quantities > 0, costs >= 0, valid expected dates.
 */

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import purchaseService from '../../services/purchaseService';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const PurchaseOrderForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  // Form Fields
  const [vendorId, setVendorId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitCost: 0.00 }]);

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const vends = await purchaseService.getVendors();
        const activeVends = vends.filter(v => v.status === 'ACTIVE');
        const prods = await productService.getProducts();

        setVendors(activeVends);
        setProducts(prods);

        if (activeVends.length > 0 && !vendorId) {
          setVendorId(activeVends[0].id);
        }
      } catch (err) {
        showToast('Failed to load vendors or products catalog.', 'error');
      }
    };
    loadResources();
  }, [showToast]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setVendorId(initialData.vendorId || '');
      setOrderDate(initialData.orderDate || new Date().toISOString().split('T')[0]);
      setExpectedDate(initialData.expectedDate || '');
      setStatus(initialData.status || 'draft');
      setItems(initialData.items || [{ productId: '', quantity: 1, unitCost: 0.00 }]);
    }
  }, [initialData]);

  // Items lines management
  const handleAddItemLine = () => {
    setItems([...items, { productId: '', quantity: 1, unitCost: 0.00 }]);
  };

  const handleRemoveItemLine = (index) => {
    if (items.length === 1) {
      showToast('A Purchase Order must contain at least one line item.', 'warning');
      return;
    }
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemFieldChange = (index, field, value) => {
    const newItems = [...items];
    
    if (field === 'quantity') {
      newItems[index][field] = Math.max(1, parseInt(value) || 0);
    } else if (field === 'unitCost') {
      newItems[index][field] = Math.max(0, parseFloat(value) || 0);
    } else {
      newItems[index][field] = value;
    }

    // Auto-fill unitCost if product is selected
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      if (prod) {
        newItems[index].unitCost = prod.cost || 0;
      }
    }

    setItems(newItems);
  };

  // Calculate Realtime Financial Summary
  const orderTotal = items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const cost = Number(item.unitCost) || 0;
    return acc + (qty * cost);
  }, 0);

  const taxTotal = Number((orderTotal * 0.18).toFixed(2));
  const grandTotal = Number((orderTotal + taxTotal).toFixed(2));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendorId) {
      showToast('Please select a vendor supplier.', 'warning');
      return;
    }

    if (expectedDate && expectedDate < orderDate) {
      showToast('Expected delivery date cannot be before order date.', 'warning');
      return;
    }

    const invalidLines = items.some(item => !item.productId || item.quantity <= 0 || item.unitCost < 0);
    if (invalidLines) {
      showToast('Please select a product, positive quantity, and non-negative cost for all rows.', 'warning');
      return;
    }

    onSubmit({
      vendorId,
      orderDate,
      expectedDate,
      status,
      items: items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitCost: i.unitCost
      })),
      orderTotal,
      taxTotal,
      grandTotal
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs font-medium">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Vendor Select */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Vendor Supplier *</label>
          <select
            value={vendorId}
            required
            onChange={(e) => setVendorId(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          >
            <option value="">-- Choose Vendor --</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.code})
              </option>
            ))}
          </select>
        </div>

        {/* Order Date */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Order Date *</label>
          <input
            type="date"
            required
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          />
        </div>

        {/* Expected Delivery Date */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Expected Date</label>
          <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!initialData} // default to draft for new orders
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="draft">Draft (RFQ)</option>
            <option value="confirmed">Confirmed</option>
            {initialData && <option value="partially_received">Partially Received</option>}
            {initialData && <option value="fully_received">Fully Received</option>}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Item Lines Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-800 text-sm">Purchase Order Lines</h4>
          <button
            type="button"
            onClick={handleAddItemLine}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item Line</span>
          </button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded border border-slate-200">
              {/* Product */}
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Product Item *</label>
                <select
                  value={item.productId}
                  required
                  onChange={(e) => handleItemFieldChange(index, 'productId', e.target.value)}
                  className="block w-full px-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="w-20">
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Qty *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity}
                  onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                  className="block w-full px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* Unit Cost */}
              <div className="w-28">
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Unit Cost ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={item.unitCost}
                  onChange={(e) => handleItemFieldChange(index, 'unitCost', e.target.value)}
                  className="block w-full px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* Subtotal */}
              <div className="w-24 text-right self-center pr-2">
                <span className="text-[10px] block font-bold text-slate-400 uppercase">Subtotal</span>
                <span className="text-xs font-semibold text-slate-800">
                  {formatCurrency((item.quantity || 0) * (item.unitCost || 0))}
                </span>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleRemoveItemLine(index)}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 self-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-slate-650">
          <Calculator className="w-4 h-4 text-slate-400" />
          <span>Realtime Financial Calculations (18% Standard GST):</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-slate-750">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Order Subtotal</span>
            <span>{formatCurrency(orderTotal)}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block">GST Tax (18%)</span>
            <span>{formatCurrency(taxTotal)}</span>
          </div>
          <div className="pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 text-base font-black text-blue-700">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
        >
          {initialData ? 'Update Purchase Order' : 'Draft Purchase Order'}
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
