// src/components/sales/SalesOrderForm.jsx
// Form to draft Sales Orders. Supports adding line items, selecting customers,
// and calculating total amounts dynamically.

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import salesService from '../../services/salesService';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const SalesOrderForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form Fields
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0.00 }]);

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const custs = await salesService.getCustomers();
        const prods = await productService.getProducts();
        
        setCustomers(custs);
        // Only finished goods or parts (skip components if needed, but listing all is fine)
        setProducts(prods);

        if (custs.length > 0 && !customerId) {
          setCustomerId(custs[0].id);
        }
      } catch (err) {
        showToast('Failed to load customers or products catalog', 'error');
      }
    };
    loadResources();
  }, [customerId, showToast]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setCustomerId(initialData.customerId || '');
      setStatus(initialData.status || 'draft');
      setItems(initialData.items || [{ productId: '', quantity: 1, price: 0.00 }]);
    }
  }, [initialData]);

  // Items lines management
  const handleAddItemLine = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0.00 }]);
  };

  const handleRemoveItemLine = (index) => {
    if (items.length === 1) {
      showToast('A Sales Order must contain at least one line item.', 'warning');
      return;
    }
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemFieldChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Auto-fill price if product is selected
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      if (prod) {
        newItems[index].price = prod.price;
      }
    }

    setItems(newItems);
  };

  // Calculate Running Order Total
  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0;
      const prc = Number(item.price) || 0;
      return acc + (qty * prc);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validations
    if (!customerId) {
      showToast('Please select a customer.', 'warning');
      return;
    }

    const invalidLines = items.some(item => !item.productId || item.quantity <= 0);
    if (invalidLines) {
      showToast('Please select a valid product and positive quantity for all lines.', 'warning');
      return;
    }

    onSubmit({
      customerId,
      status,
      items: items.map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity) || 1,
        price: Number(i.price) || 0
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="draft">Draft (Quotation)</option>
            <option value="pending">Pending Approval</option>
            {initialData && <option value="completed">Completed (Ship & Invoice)</option>}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Lines Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="font-semibold text-slate-800 text-sm">Order Lines (Products)</h4>
          <button
            type="button"
            onClick={handleAddItemLine}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Dynamic Rows */}
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

              {/* Price */}
              <div className="w-28">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={item.price}
                  onChange={(e) => handleItemFieldChange(index, 'price', Number(e.target.value))}
                  className="block w-full px-2 py-1 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Subtotal */}
              <div className="w-24 text-right self-center pr-2">
                <span className="text-[10px] block font-bold text-slate-400 uppercase">Subtotal</span>
                <span className="text-sm font-semibold text-slate-700">
                  {formatCurrency((item.quantity || 0) * (item.price || 0))}
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

      {/* Summary Total calculation */}
      <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-slate-500" />
          <span>Estimated Total Amount:</span>
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
          {initialData ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default SalesOrderForm;
