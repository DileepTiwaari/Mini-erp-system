// src/components/manufacturing/ManufacturingOrderForm.jsx
// Form to declare a new Manufacturing Order (MO) run.

import React, { useState, useEffect } from 'react';
import manufacturingService from '../../services/manufacturingService';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export const ManufacturingOrderForm = ({ onSubmit, onCancel }) => {
  const { showToast } = useToast();
  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);

  // Fields
  const [bomId, setBomId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [plannedStartDate, setPlannedStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const activeBoms = await manufacturingService.getBoms();
        const activeProds = await productService.getProducts();

        setBoms(activeBoms);
        setProducts(activeProds);

        if (activeBoms.length > 0) {
          setBomId(activeBoms[0].id);
          setProductId(activeBoms[0].productId);
        }
      } catch (err) {
        showToast('Failed to load active BOM recipes.', 'error');
      }
    };
    loadResources();
  }, [showToast]);

  // If BOM changes, automatically align the output product ID
  const handleBomChange = (val) => {
    setBomId(val);
    const selectedBom = boms.find(b => b.id === val);
    if (selectedBom) {
      setProductId(selectedBom.productId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bomId || !productId || quantity <= 0) {
      showToast('Please specify a valid BOM and positive production quantity.', 'warning');
      return;
    }

    onSubmit({
      bomId,
      productId,
      quantity: Number(quantity) || 1,
      plannedStartDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* BOM Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Select BOM Recipe</label>
        <select
          value={bomId}
          required
          onChange={(e) => handleBomChange(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">-- Choose BOM --</option>
          {boms.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Target product (Auto filled) */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Finished output item (Target)</label>
        <input
          type="text"
          disabled
          value={
            products.find(p => p.id === productId)
              ? `${products.find(p => p.id === productId).name} (${products.find(p => p.id === productId).code})`
              : 'Selection triggers finished target...'
          }
          className="block w-full px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-md text-slate-600 font-semibold"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Production Run Quantity (units)</label>
        <input
          type="number"
          min="1"
          required
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Scheduled Start Date</label>
        <input
          type="date"
          required
          value={plannedStartDate}
          onChange={(e) => setPlannedStartDate(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
          Confirm Manufacturing Run
        </button>
      </div>
    </form>
  );
};

export default ManufacturingOrderForm;
