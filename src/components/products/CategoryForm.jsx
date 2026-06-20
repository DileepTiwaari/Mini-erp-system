// src/components/products/CategoryForm.jsx
// Form to add product categories (e.g. electrical, raw materials).

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const CategoryForm = ({ onSubmit, onCancel }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !code) {
      showToast('Please fill out both category name and code.', 'warning');
      return;
    }
    onSubmit({ name, code: code.toUpperCase() });
    setName('');
    setCode('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Category Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          placeholder="e.g. Electrical Components"
        />
      </div>

      {/* Code */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Category Short Code (SKU prefix)</label>
        <input
          type="text"
          maxLength="5"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          placeholder="e.g. ELE"
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
          Add Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
