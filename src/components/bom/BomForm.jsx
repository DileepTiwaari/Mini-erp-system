// src/components/bom/BomForm.jsx
// Form to design Bills of Materials (BOM). Links a finished product to raw component lines.

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Settings } from 'lucide-react';
import { formatQuantity } from '../../utils/formatters';

export const BomForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  // Form states
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await productService.getProducts();
        
        // Split list for usability: Assemblies vs Raw components
        // e.g. code starts with FG- (Finished Goods) vs RM- (Raw Materials)
        setProducts(list.filter(p => p.code.startsWith('FG')));
        setRawMaterials(list.filter(p => p.code.startsWith('RM') || !p.code.startsWith('FG')));
        
        if (list.length > 0) {
          const fg = list.find(p => p.code.startsWith('FG'));
          if (fg && !productId) {
            setProductId(fg.id);
            setName(`${fg.name} Standard BOM`);
          }
        }
      } catch (err) {
        showToast('Failed to load products for BOM assembly', 'error');
      }
    };
    loadProducts();
  }, [productId, showToast]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setProductId(initialData.productId || '');
      setName(initialData.name || '');
      setItems(initialData.items || [{ productId: '', quantity: 1 }]);
    }
  }, [initialData]);

  // Sync BOM title if product selection changes
  const handleProductChange = (val) => {
    setProductId(val);
    const prod = products.find(p => p.id === val);
    if (prod) {
      setName(`${prod.name} Standard BOM`);
    }
  };

  const handleAddItemLine = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItemLine = (index) => {
    if (items.length === 1) {
      showToast('A BOM must contain at least one component raw material.', 'warning');
      return;
    }
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemFieldChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productId || !name) {
      showToast('Please select a finished product and assign a BOM name.', 'warning');
      return;
    }

    const invalidLines = items.some(item => !item.productId || item.quantity <= 0);
    if (invalidLines) {
      showToast('Please select a valid raw material and positive quantity for all components.', 'warning');
      return;
    }

    onSubmit({
      productId,
      name,
      items: items.map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity) || 1
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Output Finished Product */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Finished Assembly Product</label>
          <select
            value={productId}
            disabled={!!initialData}
            onChange={(e) => handleProductChange(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white disabled:bg-slate-100 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        {/* BOM Recipe Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">BOM Recipe Identifier Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. Standard BOM"
          />
        </div>
      </div>

      {/* Component lines editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Raw Components & Bill of Quantities</span>
          </h4>
          <button
            type="button"
            onClick={handleAddItemLine}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </button>
        </div>

        {/* Rows */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded border border-slate-200">
              {/* Product */}
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Component / Material</label>
                <select
                  value={item.productId}
                  required
                  onChange={(e) => handleItemFieldChange(index, 'productId', e.target.value)}
                  className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">-- Choose Raw Material --</option>
                  {rawMaterials.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code}) [Stock: {r.stock} {r.uom}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="w-32">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qty per unit FG</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemFieldChange(index, 'quantity', Number(e.target.value))}
                    className="block w-full px-2 py-1 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-right"
                  />
                  <span className="text-xs text-slate-400 font-medium">
                    {rawMaterials.find(r => r.id === item.productId)?.uom || ''}
                  </span>
                </div>
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
          {initialData ? 'Update BOM' : 'Create BOM'}
        </button>
      </div>
    </form>
  );
};

export default BomForm;
