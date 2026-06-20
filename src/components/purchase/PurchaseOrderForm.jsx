// src/components/purchase/PurchaseOrderForm.jsx
// Form to draft Purchase Orders (POs) for vendor procurement.
// Dynamically adjusts rows and handles unitCost auto-filling from standard cost.

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
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitCost: 0.00 }]);

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const vends = await purchaseService.getVendors();
        const prods = await productService.getProducts();

        setVendors(vends);
        setProducts(prods);

        if (vends.length > 0 && !vendorId) {
          setVendorId(vends[0].id);
        }
      } catch (err) {
        showToast('Failed to load vendors or products catalog', 'error');
      }
    };
    loadResources();
  }, [vendorId, showToast]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setVendorId(initialData.vendorId || '');
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
    newItems[index][field] = value;

    // Auto-fill unitCost if product is selected
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      if (prod) {
        newItems[index].unitCost = prod.cost;
      }
    }

    setItems(newItems);
  };

  // Calculate Running Total
  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0;
      const cost = Number(item.unitCost) || 0;
      return acc + (qty * cost);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendorId) {
      showToast('Please select a vendor.', 'warning');
      return;
    }

    const invalidLines = items.some(item => !item.productId || item.quantity <= 0);
    if (invalidLines) {
      showToast('Please select a valid product and positive quantity for all lines.', 'warning');
      return;
    }

    onSubmit({
      vendorId,
      status,
      items: items.map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity) || 1,
        unitCost: Number(i.unitCost) || 0
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vendor Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Vendor Supplier</label>
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="draft">Draft (RFQ)</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved / Active</option>
            {initialData && <option value="completed">Completed (Goods Received)</option>}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Lines Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="font-semibold text-slate-800 text-sm">Purchase Items</h4>
          <button
            type="button"
            onClick={handleAddItemLine}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Dynamic Lines */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded border border-slate-200">
              {/* Product */}
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Item</label>
                <select
                  value={item.productId}
                  required
                  onChange={(e) => handleItemFieldChange(index, 'productId', e.target.value)}
                  className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="w-20">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity}
                  onChange={(e) => handleItemFieldChange(index, 'quantity', Number(e.target.value))}
                  className="block w-full px-2 py-1 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Cost */}
              <div className="w-28">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={item.unitCost}
                  onChange={(e) => handleItemFieldChange(index, 'unitCost', Number(e.target.value))}
                  className="block w-full px-2 py-1 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Subtotal */}
              <div className="w-24 text-right self-center pr-2">
                <span className="text-[10px] block font-bold text-slate-400 uppercase">Subtotal</span>
                <span className="text-sm font-semibold text-slate-700">
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

      {/* Summary Total */}
      <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-slate-500" />
          <span>Total Purchase Spend:</span>
        </span>
        <span className="text-xl font-bold text-indigo-700">{formatCurrency(calculateTotal())}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors duration-150"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors duration-150"
        >
          {initialData ? 'Update Purchase Order' : 'Create Purchase Order'}
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
