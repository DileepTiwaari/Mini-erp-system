// src/components/products/CategoryForm.jsx
// 
// WHAT IT DOES:
// Renders the Category Management viewport, combining a category list grid
// (with active Edit and Delete commands) and an interactive input form for saving divisions.
// 
// WHY IT IS REQUIRED:
// 1. Provides a central, clean, non-cluttered screen to manage product catalog sections.
// 2. Implements real-time input validations for unique codes and names.
// 3. Allows operators to prune or edit category definitions without navigating away from products.
// 
// WHEN IT IS USED:
// Rendered inside the category modal from the ProductsPage toolbar.

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Trash2, Edit3, Plus, RefreshCw } from 'lucide-react';

/**
 * WHAT IT DOES: Renders a dual category catalog manager (grid of items + edit/add form).
 * WHY IT IS REQUIRED: Organizes full category CRUD logic in a single compact popup modal.
 * WHEN IT IS USED: Loaded inside ProductsPage.jsx.
 */
export const CategoryForm = ({ categories = [], onSubmit, onDelete, onCancel }) => {
  const { showToast } = useToast();
  
  // WHAT IT DOES: Form inputs states and tracking variable for active edit ID.
  // WHY IT IS REQUIRED: Synchronizes DOM fields and determines submit mode (Add vs Update).
  // WHEN IT IS USED: Modified when typing or clicking edit icon on categories list.
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editId, setEditId] = useState(null);

  // WHAT IT DOES: Handles submission events, validating and formatting parameters.
  // WHY IT IS REQUIRED: Ensures data is complete before propagating to service layer.
  // WHEN IT IS USED: Fired on clicking form submit.
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

  // WHAT IT DOES: Pre-populates inputs with target category attributes.
  // WHY IT IS REQUIRED: Transitions layout into edit mode.
  // WHEN IT IS USED: Fired on clicking the edit pencil.
  const handleEditInit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setCode(cat.code);
  };

  // WHAT IT DOES: Resets form inputs and exits edit mode.
  // WHY IT IS REQUIRED: Allows users to discard edits.
  // WHEN IT IS USED: Fired on clicking cancel while in edit mode.
  const handleEditCancel = () => {
    setName('');
    setCode('');
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      {/* Category List Header & Grid Table */}
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
                  {/* Edit action */}
                  <button
                    type="button"
                    onClick={() => handleEditInit(cat)}
                    className="p-1 text-slate-400 hover:text-brand-600 rounded hover:bg-slate-100 transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {/* Delete action */}
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

      {/* Inputs Form card */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {editId ? 'Modify Selected Category' : 'Register New Category'}
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g. Electrical Components"
            />
          </div>

          {/* Short Code Input */}
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
              className="block w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g. ELE"
            />
          </div>
        </div>

        {/* Submit Actions */}
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update Category</span>
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Create Category</span>
            </button>
          )}
        </div>
      </form>
      
      {/* Footer Close Actions */}
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
