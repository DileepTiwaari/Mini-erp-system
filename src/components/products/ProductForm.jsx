// src/components/products/ProductForm.jsx
// Form component to register or update raw materials and assemblies.

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0.00);
  const [cost, setCost] = useState(0.00);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [uom, setUom] = useState('pcs'); // Unit of measure

  // Load product categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await productService.getCategories();
        setCategories(list);
        if (list.length > 0 && !categoryId) {
          setCategoryId(list[0].id);
        }
      } catch (e) {
        showToast('Failed to load product categories', 'error');
      }
    };
    fetchCats();
  }, [categoryId, showToast]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setCategoryId(initialData.categoryId || '');
      setPrice(initialData.price || 0);
      setCost(initialData.cost || 0);
      setStock(initialData.stock || 0);
      setMinStock(initialData.minStock || 0);
      setUom(initialData.uom || 'pcs');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !code || !categoryId) {
      showToast('Please fill out all mandatory fields.', 'warning');
      return;
    }

    onSubmit({
      name,
      code,
      categoryId,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      uom
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            placeholder="e.g. Copper Wire Coil 1.5mm"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Product Code / SKU</label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            placeholder="e.g. RM-COP-15"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Product Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.code})
              </option>
            ))}
          </select>
        </div>

        {/* Unit of measure */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Unit of Measure (UoM)</label>
          <select
            value={uom}
            onChange={(e) => setUom(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="pcs">Pieces (pcs)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="meters">Meters (m)</option>
            <option value="liters">Liters (l)</option>
            <option value="boxes">Boxes (box)</option>
          </select>
        </div>

        {/* Min stock safety threshold */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Min Safety Threshold</label>
          <input
            type="number"
            min="0"
            required
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Sales Price */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Sales Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Unit Cost */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Internal Unit Cost ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Stock on Hand (Disabled when editing, adjustments are handled in StockAdjustForm) */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Initial Stock on Hand {initialData && '(Adjustments should be made in Stock Adjustments page)'}
          </label>
          <input
            type="number"
            min="0"
            disabled={!!initialData}
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-slate-50 disabled:opacity-70 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
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
          {initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
