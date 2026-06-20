// src/components/products/ProductForm.jsx
// 
// WHAT IT DOES:
// Renders the input and edit form for raw materials and manufactured assemblies.
// Implements client-side inputs checking: alphanumeric SKU formatting validation,
// non-empty value boundaries, and positive numeric validations for pricing and quantity details.
// 
// WHY IT IS REQUIRED:
// 1. Blocks corrupted or invalid entries before they propagate to the mock database or Spring Boot REST API.
// 2. Guides non-technical business operators with friendly inline warning notifications and prompts.
// 3. Centralizes data modeling parameters (reserved quantities, sourcing dropdown links, statuses).
// 
// WHEN IT IS USED:
// Rendered inside the products page modal when registering new items or editing active listings.

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';

/**
 * WHAT IT DOES: Main form panel component supporting product creations and revisions.
 * WHY IT IS REQUIRED: Standardizes inputs fields, error checks, and state mapping.
 * WHEN IT IS USED: Loaded by ProductsPage.jsx.
 */
export const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();

  // WHAT IT DOES: State variables mapping all product entities attributes.
  // WHY IT IS REQUIRED: Keeps input fields synchronized with state values.
  // WHEN IT IS USED: Updated on typing, submitted on button click.
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.00');
  const [cost, setCost] = useState('0.00');
  const [stock, setStock] = useState('0');
  const [reservedQty, setReservedQty] = useState('0');
  const [minStock, setMinStock] = useState('0');
  const [uom, setUom] = useState('pcs');
  const [procurementType, setProcurementType] = useState('PURCHASE');
  const [procurementStrategy, setProcurementStrategy] = useState('MTS');
  const [vendorId, setVendorId] = useState('');
  const [bomId, setBomId] = useState('');
  const [status, setStatus] = useState('active');

  // Load product categories on component boot
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

  // Load initial product data values when entering Edit Mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setCategoryId(initialData.categoryId || '');
      setDescription(initialData.description || '');
      setPrice(String(initialData.price || '0.00'));
      setCost(String(initialData.cost || '0.00'));
      setStock(String(initialData.stock || '0'));
      setReservedQty(String(initialData.reservedQty || '0'));
      setMinStock(String(initialData.minStock || '0'));
      setUom(initialData.uom || 'pcs');
      setProcurementType(initialData.procurementType || 'PURCHASE');
      setProcurementStrategy(initialData.procurementStrategy || 'MTS');
      setVendorId(initialData.vendorId || '');
      setBomId(initialData.bomId || '');
      setStatus(initialData.status || 'active');
    }
  }, [initialData]);

  // WHAT IT DOES: Helper checking if SKU matches alphanumeric characters and hyphens.
  // WHY IT IS REQUIRED: Enforces standard ERP naming conventions.
  // WHEN IT IS USED: Consulted during handleSubmit checks.
  const isValidSku = (sku) => {
    const skuRegex = /^[A-Za-z0-9-]+$/;
    return skuRegex.test(sku);
  };

  // WHAT IT DOES: Checks if values are numbers greater than or equal to zero.
  // WHY IT IS REQUIRED: Prevents negative costs, prices, or inventory quantities.
  // WHEN IT IS USED: Checked on submit button click.
  const isPositiveNumber = (val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  };

  // WHAT IT DOES: Coordinates form validation checks and dispatches onSubmit.
  // WHY IT IS REQUIRED: Blocks submit events if fields are incorrect.
  // WHEN IT IS USED: Fired on clicking the form submit button.
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Required field checks
    if (!name.trim()) {
      showToast('Product name is required.', 'warning');
      return;
    }
    if (!code.trim()) {
      showToast('Product SKU code is required.', 'warning');
      return;
    }
    if (!categoryId) {
      showToast('Please select a product category.', 'warning');
      return;
    }

    // 2. SKU format check
    if (!isValidSku(code)) {
      showToast('SKU code must only contain letters, numbers, and hyphens (e.g. FG-MTR-01).', 'warning');
      return;
    }

    // 3. Positive number checks
    if (!isPositiveNumber(price)) {
      showToast('Sales price must be a positive number.', 'warning');
      return;
    }
    if (!isPositiveNumber(cost)) {
      showToast('Cost price must be a positive number.', 'warning');
      return;
    }
    if (!isPositiveNumber(stock)) {
      showToast('On hand stock quantity must be a positive number.', 'warning');
      return;
    }
    if (!isPositiveNumber(reservedQty)) {
      showToast('Reserved quantity must be a positive number.', 'warning');
      return;
    }
    if (!isPositiveNumber(minStock)) {
      showToast('Reorder safety point must be a positive number.', 'warning');
      return;
    }

    // Free to use quantity is calculated as: stock - reservedQty
    const totalStock = Number(stock) || 0;
    const reservedVal = Number(reservedQty) || 0;
    const freeToUseVal = totalStock - reservedVal;

    // Dispatches formatted payload
    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      categoryId,
      description: description.trim(),
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: totalStock,
      reservedQty: reservedVal,
      freeToUseQty: freeToUseVal,
      minStock: Number(minStock) || 0,
      uom,
      procurementType,
      procurementStrategy,
      vendorId: procurementType === 'PURCHASE' ? vendorId : null,
      bomId: procurementType === 'MANUFACTURING' ? bomId : null,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            placeholder="e.g. Copper Wire Coil 1.5mm"
          />
        </div>

        {/* Code / SKU */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Product SKU / Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 font-mono uppercase"
            placeholder="e.g. RM-COP-15"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Product Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.code})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Write brief description of the product or assembly details..."
          />
        </div>

        {/* Unit of measure */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Unit of Measure (UoM)
          </label>
          <select
            value={uom}
            onChange={(e) => setUom(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="pcs">Pieces (pcs)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="meters">Meters (m)</option>
            <option value="liters">Liters (l)</option>
            <option value="boxes">Boxes (box)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Catalog Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sales Price */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Sales Price ($) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="0.00"
          />
        </div>

        {/* Unit Cost */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Internal Cost Price ($) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="0.00"
          />
        </div>

        {/* Initial Stock on Hand */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Stock On Hand <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="0"
          />
        </div>

        {/* Reserved Stock */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Reserved Qty
          </label>
          <input
            type="number"
            required
            value={reservedQty}
            onChange={(e) => setReservedQty(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="0"
          />
        </div>

        {/* Min stock safety threshold */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Reorder Point (Safety Stock) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="0"
          />
        </div>

        {/* Procurement Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Procurement Type
          </label>
          <select
            value={procurementType}
            onChange={(e) => setProcurementType(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="PURCHASE">PURCHASE (PO Sourced)</option>
            <option value="MANUFACTURING">MANUFACTURING (BOM Built)</option>
          </select>
        </div>

        {/* Procurement Strategy */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Strategy
          </label>
          <select
            value={procurementStrategy}
            onChange={(e) => setProcurementStrategy(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="MTS">Make to Stock (MTS)</option>
            <option value="MTO">Make to Order (MTO)</option>
          </select>
        </div>

        {/* Vendor Link or BOM Link depending on type */}
        {procurementType === 'PURCHASE' ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Preferred Vendor
            </label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">No vendor bound</option>
              <option value="v1">Apex Metal Corp (v1)</option>
              <option value="v2">ElectroParts Distributors (v2)</option>
              <option value="v3">Fastener Direct (v3)</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Bill of Materials (BOM)
            </label>
            <select
              value={bomId}
              onChange={(e) => setBomId(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">No BOM bound</option>
              <option value="bom-301">Electric Motor 1HP Standard BOM (bom-301)</option>
              <option value="bom-302">Industrial Assembly Workbench BOM (bom-302)</option>
            </select>
          </div>
        )}
      </div>

      {/* Action triggers */}
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
          {initialData ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
