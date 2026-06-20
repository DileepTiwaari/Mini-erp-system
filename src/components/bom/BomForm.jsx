// src/components/bom/BomForm.jsx
// Form to design Bills of Materials (BOM). Links a finished product to raw component lines and routing steps.
// Purpose: Configures material requirements and assembly routes for manufacturing.
// Business Use: Master data foundation for ERP manufacturing scheduling and costing.
// API Usage: Reads products catalog using productService, writes via parent callback.

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Settings, List, Shuffle } from 'lucide-react';
import { formatQuantity } from '../../utils/formatters';

export const BomForm = ({ onSubmit, initialData, workCenters = [], onCancel }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  // Form states
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0');
  const [status, setStatus] = useState('ACTIVE');
  const [items, setItems] = useState([{ productId: '', quantity: 1, wastePercent: 0 }]);
  const [operations, setOperations] = useState([{ name: '', workCenterId: '', durationMinutes: 15, sequence: 10 }]);

  // Tabs: 'components' | 'operations'
  const [activeTab, setActiveTab] = useState('components');

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await productService.getProducts();
        
        // Split list for usability: Assemblies (FG) vs Raw components (RM)
        setProducts(list.filter(p => p.code.startsWith('FG')));
        setRawMaterials(list.filter(p => p.code.startsWith('RM') || !p.code.startsWith('FG')));
        
        if (list.length > 0) {
          const fg = list.find(p => p.code.startsWith('FG'));
          if (fg && !productId && !initialData) {
            setProductId(fg.id);
            setName(`${fg.name} Standard BOM`);
          }
        }
      } catch (err) {
        showToast('Failed to load products for BOM assembly', 'error');
      }
    };
    loadProducts();
  }, [productId, showToast, initialData]);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setProductId(initialData.productId || '');
      setName(initialData.name || '');
      setVersion(initialData.version || '1.0');
      setStatus(initialData.status || 'ACTIVE');
      setItems(
        initialData.items && initialData.items.length > 0
          ? initialData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              wastePercent: item.wastePercent || 0
            }))
          : [{ productId: '', quantity: 1, wastePercent: 0 }]
      );
      setOperations(
        initialData.operations && initialData.operations.length > 0
          ? initialData.operations
          : [{ name: '', workCenterId: '', durationMinutes: 15, sequence: 10 }]
      );
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

  // Component items actions
  const handleAddItemLine = () => {
    setItems([...items, { productId: '', quantity: 1, wastePercent: 0 }]);
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

  // Routing operations actions
  const handleAddOperationLine = () => {
    const nextSeq = (operations.length + 1) * 10;
    setOperations([...operations, { name: '', workCenterId: '', durationMinutes: 15, sequence: nextSeq }]);
  };

  const handleRemoveOperationLine = (index) => {
    if (operations.length === 1) {
      showToast('A BOM must contain at least one routing operation step.', 'warning');
      return;
    }
    const newOps = [...operations];
    newOps.splice(index, 1);
    setOperations(newOps);
  };

  const handleOperationFieldChange = (index, field, value) => {
    const newOps = [...operations];
    newOps[index][field] = value;
    setOperations(newOps);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productId || !name || !version) {
      showToast('Please fill out all general details: Finished Product, Name, and Version.', 'warning');
      return;
    }

    const invalidLines = items.some(item => !item.productId || item.quantity <= 0 || item.wastePercent < 0);
    if (invalidLines) {
      showToast('Please select a valid raw material and positive quantity/waste for all components.', 'warning');
      return;
    }

    const invalidOps = operations.some(op => !op.name || !op.workCenterId || op.durationMinutes <= 0 || op.sequence <= 0);
    if (invalidOps) {
      showToast('Please specify a valid name, work center, duration, and sequence for all routing operations.', 'warning');
      return;
    }

    onSubmit({
      productId,
      name,
      version,
      status,
      items: items.map(i => {
        const prod = rawMaterials.find(r => r.id === i.productId);
        return {
          productId: i.productId,
          quantity: Number(i.quantity) || 1,
          unit: prod ? prod.uom : 'pcs',
          wastePercent: Number(i.wastePercent) || 0
        };
      }),
      operations: operations.map(op => ({
        name: op.name,
        workCenterId: op.workCenterId,
        durationMinutes: Number(op.durationMinutes) || 15,
        sequence: Number(op.sequence) || 10
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
        {/* Output Finished Product */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Finished Assembly Product</label>
          <select
            value={productId}
            disabled={!!initialData}
            onChange={(e) => handleProductChange(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white disabled:bg-slate-100 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">-- Select FG Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        {/* Version */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Version</label>
          <input
            type="text"
            required
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. 1.0"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* BOM Recipe Name */}
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">BOM Recipe Identifier Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. Electric Motor 1HP Standard BOM"
          />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('components')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors ${
            activeTab === 'components'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Components List</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('operations')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors ${
            activeTab === 'operations'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>Operations Routing</span>
        </button>
      </div>

      {/* Tab Contents: Components List */}
      {activeTab === 'components' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Bill of Quantities (Raw components & quantities needed)</span>
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

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((item, index) => (
              <div key={index} className="flex flex-wrap gap-3 items-end bg-slate-50 p-3 rounded border border-slate-200">
                {/* Material Select */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Component / Material</label>
                  <select
                    value={item.productId}
                    required
                    onChange={(e) => handleItemFieldChange(index, 'productId', e.target.value)}
                    className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800"
                  >
                    <option value="">-- Choose Component --</option>
                    {rawMaterials.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.code}) [Stock: {r.stock} {r.uom}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Qty Needed */}
                <div className="w-32">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qty per unit FG</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemFieldChange(index, 'quantity', Number(e.target.value))}
                      className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-right text-slate-800"
                    />
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      {rawMaterials.find(r => r.id === item.productId)?.uom || 'pcs'}
                    </span>
                  </div>
                </div>

                {/* Waste % */}
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Waste %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={item.wastePercent}
                    onChange={(e) => handleItemFieldChange(index, 'wastePercent', Number(e.target.value))}
                    className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-right text-slate-800"
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveItemLine(index)}
                  className="p-2 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Contents: Operations Routing */}
      {activeTab === 'operations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Operations Sequence Routing (Work order steps)</span>
            </h4>
            <button
              type="button"
              onClick={handleAddOperationLine}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Routing Step</span>
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {operations.map((op, index) => (
              <div key={index} className="flex flex-wrap gap-3 items-end bg-slate-50 p-3 rounded border border-slate-200">
                {/* Sequence */}
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sequence</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={op.sequence}
                    onChange={(e) => handleOperationFieldChange(index, 'sequence', Number(e.target.value))}
                    className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-right text-slate-800"
                  />
                </div>

                {/* Operation Name */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Operation Name</label>
                  <input
                    type="text"
                    required
                    value={op.name}
                    onChange={(e) => handleOperationFieldChange(index, 'name', e.target.value)}
                    className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800"
                    placeholder="e.g. Cut casing sheets"
                  />
                </div>

                {/* Work Center Station */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Work Center Station</label>
                  <select
                    value={op.workCenterId}
                    required
                    onChange={(e) => handleOperationFieldChange(index, 'workCenterId', e.target.value)}
                    className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800"
                  >
                    <option value="">-- Select Work Center --</option>
                    {workCenters.map((wc) => (
                      <option key={wc.id} value={wc.id}>
                        {wc.name} ({wc.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Minutes */}
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={op.durationMinutes}
                    onChange={(e) => handleOperationFieldChange(index, 'durationMinutes', Number(e.target.value))}
                    className="block w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-right text-slate-800"
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveOperationLine(index)}
                  className="p-2 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
