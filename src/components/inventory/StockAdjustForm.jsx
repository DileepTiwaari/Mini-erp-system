// src/components/inventory/StockAdjustForm.jsx
// Form to register manual stock adjustments (re-counts, scraps, overrides).

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export const StockAdjustForm = ({ onSubmit, onCancel }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);

  // Fields
  const [productId, setProductId] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('in'); // 'in' (add) | 'out' (deduct)
  const [quantity, setQuantity] = useState(0);
  const [reference, setReference] = useState('Physical Stocktake');

  // Load products list
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await productService.getProducts();
        setProducts(list);
        if (list.length > 0) {
          setProductId(list[0].id);
        }
      } catch (err) {
        showToast('Failed to load products for inventory adjustments.', 'error');
      }
    };
    loadProducts();
  }, [showToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId || quantity <= 0) {
      showToast('Please select a product and enter a positive adjustment quantity.', 'warning');
      return;
    }

    onSubmit({
      productId,
      adjustmentType,
      quantity: Number(quantity) || 0,
      reference,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Select */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Target Product</label>
        <select
          value={productId}
          required
          onChange={(e) => setProductId(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">-- Choose Product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.code}) [On Hand: {p.stock} {p.uom}]
            </option>
          ))}
        </select>
      </div>

      {/* Adjustment type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Adjustment Action</label>
        <select
          value={adjustmentType}
          onChange={(e) => setAdjustmentType(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="in">Increase Stock Levels (Inflow / Receipt)</option>
          <option value="out">Decrease Stock Levels (Outflow / Scrap / Writeoff)</option>
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Adjustment Quantity</label>
        <input
          type="number"
          min="1"
          required
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Reference note */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Adjustment Reason / Doc Ref</label>
        <input
          type="text"
          required
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Annual Audit discrepancy, Scrap metal log"
        />
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
          Apply Inventory Adjustment
        </button>
      </div>
    </form>
  );
};

export default StockAdjustForm;
