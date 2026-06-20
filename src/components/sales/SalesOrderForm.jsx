/**
 * PURPOSE:
 * Renders the form for drafting and editing Sales Orders and quotations.
 *
 * BUSINESS USE:
 * Allows sales representatives to select customers, manage ordered product lines,
 * review inventory availability in real-time, and view procurement recommendations
 * if stock deficits occur.
 *
 * API USAGE:
 * - Calls `salesService.getCustomers()` on mount to load customer selectors.
 * - Calls `productService.getProducts()` on mount to load product selections.
 *
 * LOGIC EXPLANATION:
 * - Tracks line items inside an array state: `[{ productId, quantity, price }]`.
 * - Auto-fills unit pricing upon product selection.
 * - Calculates line totals (`quantity * price`) and running order totals dynamically.
 * - Stock Validation: Under each product line, queries the selected product's stock metrics:
 *   - Available Stock: `stock`
 *   - Reserved Stock: `reservedQty`
 *   - Free to Use Stock: `stock - reservedQty`
 * - Shortage Warnings: If the ordered quantity exceeds available stock, displays an inline warning highlighting
 *   the shortage count and procurement recommendation (PO vs MO based on `procurementType`).
 */

import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { salesService } from '../../services/salesService';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Calculator, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const SalesOrderForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();
  
  // Catalogs state
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0.00 }]);

  // Load catalogs on mount
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [custs, prods] = await Promise.all([
          salesService.getCustomers(),
          productService.getProducts()
        ]);
        setCustomers(custs);
        setProducts(prods);

        if (custs.length > 0 && !customerId) {
          setCustomerId(custs[0].id);
        }
      } catch (err) {
        showToast('Failed to load customers or products catalogs.', 'error');
      }
    };
    loadCatalogs();
  }, [customerId, showToast]);

  // Load initialData when in Edit mode
  useEffect(() => {
    if (initialData) {
      setCustomerId(initialData.customerId || '');
      setOrderDate(initialData.orderDate || new Date().toISOString().split('T')[0]);
      setStatus(initialData.status || 'draft');
      setItems(initialData.items || [{ productId: '', quantity: 1, price: 0.00 }]);
    }
  }, [initialData]);

  // Add a new product line row
  const handleAddItemLine = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0.00 }]);
  };

  // Remove a product line row
  const handleRemoveItemLine = (index) => {
    if (items.length === 1) {
      showToast('A Sales Order must contain at least one line item.', 'warning');
      return;
    }
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Synchronize fields in order line rows
  const handleItemFieldChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Auto-fill price from product catalog if product ID updates
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

  // Validates lines and submits order data
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerId) {
      showToast('Please select a customer.', 'warning');
      return;
    }

    const invalidLines = items.some(item => !item.productId || item.quantity <= 0);
    if (invalidLines) {
      showToast('Please select a valid product and positive quantity for all rows.', 'warning');
      return;
    }

    onSubmit({
      customerId,
      orderDate,
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Customer Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Order Date *</label>
          <input
            type="date"
            required
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Order Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="draft">Draft (Quotation)</option>
            <option value="confirmed">Confirmed</option>
            {initialData && <option value="partially_delivered">Partially Delivered</option>}
            {initialData && <option value="fully_delivered">Fully Delivered</option>}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Lines Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Order Lines (Product items)</h4>
          <button
            type="button"
            onClick={handleAddItemLine}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item Row</span>
          </button>
        </div>

        {/* Dynamic Rows */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {items.map((item, index) => {
            // Find active product properties for Stock checks
            const prod = products.find(p => p.id === item.productId);
            const stock = prod ? Number(prod.stock) || 0 : 0;
            const reserved = prod ? Number(prod.reservedQty) || 0 : 0;
            const freeToUse = stock - reserved;
            const hasShortage = prod && item.quantity > stock;
            const shortageQty = hasShortage ? item.quantity - stock : 0;
            const recommendation = prod && prod.procurementType === 'MANUFACTURING' 
              ? 'Recommended Manufacturing Order' 
              : 'Recommended Purchase Order';

            return (
              <div key={index} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                  {/* Product */}
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Item Product</label>
                    <select
                      value={item.productId}
                      required
                      onChange={(e) => handleItemFieldChange(index, 'productId', e.target.value)}
                      className="block w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <div className="w-full sm:w-20">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemFieldChange(index, 'quantity', Number(e.target.value))}
                      className="block w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price */}
                  <div className="w-full sm:w-28">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={item.price}
                      onChange={(e) => handleItemFieldChange(index, 'price', Number(e.target.value))}
                      className="block w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="w-full sm:w-24 text-right self-center pr-2">
                    <span className="text-[9px] block font-bold text-slate-400 uppercase">Subtotal</span>
                    <span className="text-xs font-bold text-slate-700">
                      {formatCurrency((item.quantity || 0) * (item.price || 0))}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItemLine(index)}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 self-center"
                    title="Remove Line"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stock Validation details and Procurement warning inline */}
                {prod && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="text-slate-500 font-medium">
                      Stock: <span className="font-semibold text-slate-700">Available: {stock}</span> |{' '}
                      <span className="font-semibold text-slate-700">Reserved: {reserved}</span> |{' '}
                      <span className="font-semibold text-slate-700">Free to Use: {freeToUse}</span>
                    </div>

                    {hasShortage && (
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Shortage of {shortageQty} units. {recommendation}.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Total */}
      <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-slate-500" />
          <span>Total Quotation Amount:</span>
        </span>
        <span className="text-lg font-bold text-blue-700">{formatCurrency(calculateTotal())}</span>
      </div>

      {/* Action buttons */}
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
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors duration-150"
        >
          {initialData ? 'Update Order' : 'Create Quotation'}
        </button>
      </div>
    </form>
  );
};

export default SalesOrderForm;
