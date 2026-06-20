/**
 * PURPOSE:
 * Renders an inline modal form and data table for managing product categories.
 *
 * BUSINESS USE:
 * Allows managers to create, edit, or delete inventory category divisions (e.g. Electronics,
 * Furniture, Raw Materials) dynamically within the product catalog context.
 *
 * API USAGE:
 * Triggers category addition, modification, and deletion APIs inside `productService`.
 *
 * LOGIC EXPLANATION:
 * Renders a list of existing categories with active edit/delete action controls alongside
 * an interactive form. Tracks inputs using local state hooks, handles edit form pre-population,
 * and clears inputs upon successful submission or cancellation.
 */

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Trash2, Edit3, Plus, RefreshCw } from 'lucide-react';

export const CategoryForm = ({ categories = [], onSubmit, onDelete, onCancel }) => {
  const { showToast } = useToast();
  
  // React state hooks for form parameters
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editId, setEditId] = useState(null);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      showToast('Please fill out both category name and short code.', 'warning');
      return;
    }
    
    onSubmit({
      id: editId,
      name: name.trim(),
      code: code.trim().toUpperCase()
    });

    // Reset inputs
    setName('');
    setCode('');
    setEditId(null);
  };

  // Pre-populates inputs to trigger category edit mode
  const handleEditInit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setCode(cat.code);
  };

  // Discards active category edits
  const handleEditCancel = () => {
    setName('');
    setCode('');
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      {/* Category List */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Categories ({categories.length})
          </span>
        </div>
        
        {categories.length === 0 ? (
          <p className="p-4 text-xs italic text-slate-400 text-center">No categories registered.</p>
        ) : (
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[9px] font-bold text-slate-500 uppercase">
                    {cat.code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditInit(cat)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {editId ? 'Modify Selected Category' : 'Register New Category'}
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Electrical Components"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Short Code
            </label>
            <input
              type="text"
              maxLength="5"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="block w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. ELE"
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-2 pt-2">
          {editId ? (
            <>
              <button
                type="button"
                onClick={handleEditCancel}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update Category</span>
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Create Category</span>
            </button>
          )}
        </div>
      </form>
      
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors duration-150"
        >
          Close Manager
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
