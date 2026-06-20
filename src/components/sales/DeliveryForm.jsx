/**
 * PURPOSE:
 * Renders the dispatch shipment form for confirming sales order item deliveries.
 *
 * BUSINESS USE:
 * Allows warehouse handlers to record partial or full shipments of products,
 * adjust delivered quantity counters, and log delivery dates and shipping comments.
 *
 * API USAGE:
 * Triggered on submit to invoke `salesService.processSalesOrderDelivery()`.
 *
 * LOGIC EXPLANATION:
 * - Iterates through each sales order line item.
 * - Shows ordered count vs. previously shipped count.
 * - Dynamically calculates remaining count to pre-populate input fields.
 * - Provides validation checks to ensure dispatched quantities are positive numbers
 *   and do not exceed remaining quantities.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export const DeliveryForm = ({ order, products = [], onSubmit, onCancel }) => {
  const { showToast } = useToast();

  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  
  // State to hold dispatch quantities for each line: { [productId]: quantityToDeliver }
  const [dispatchQty, setDispatchQty] = useState({});

  useEffect(() => {
    if (order) {
      const initialMap = {};
      const deliveredMap = order.deliveredQty || {};
      (order.items || []).forEach(item => {
        const alreadyDelivered = deliveredMap[item.productId] || 0;
        const remaining = Math.max(0, item.quantity - alreadyDelivered);
        initialMap[item.productId] = remaining;
      });
      setDispatchQty(initialMap);
    }
  }, [order]);

  const handleQtyChange = (productId, val, maxLimit) => {
    const num = Number(val);
    if (isNaN(num) || num < 0) return;
    if (num > maxLimit) {
      showToast(`Quantity to deliver cannot exceed the remaining balance of ${maxLimit} units.`, 'warning');
      return;
    }
    setDispatchQty({
      ...dispatchQty,
      [productId]: num
    });
  };

  const getProductInfo = (productId) => {
    const prod = products.find(p => p.id === productId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Product';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Compile items list
    const itemsToShip = Object.keys(dispatchQty).map(pId => ({
      productId: pId,
      quantity: Number(dispatchQty[pId]) || 0
    })).filter(item => item.quantity > 0);

    if (itemsToShip.length === 0) {
      showToast('Please enter a delivery quantity greater than zero for at least one item.', 'warning');
      return;
    }

    onSubmit({
      deliveryDate,
      remarks: remarks.trim(),
      items: itemsToShip
    });
  };

  if (!order) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded text-xs leading-normal">
        Log Shipment Dispatch for Sales Order <span className="font-bold text-slate-800">{order.orderNumber}</span>. 
        Deductions will update available stock levels.
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Delivery / Shipment Date *</label>
        <input
          type="date"
          required
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Item quantities input */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase">Items to Ship</label>
        <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-white divide-y divide-slate-100 max-h-48 overflow-y-auto">
          {(order.items || []).map((item) => {
            const alreadyDelivered = (order.deliveredQty || {})[item.productId] || 0;
            const remaining = Math.max(0, item.quantity - alreadyDelivered);
            
            return (
              <div key={item.productId} className="pt-2 first:pt-0 text-xs flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 truncate">{getProductInfo(item.productId)}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Ordered: {item.quantity} | Prev Shipped: {alreadyDelivered}
                  </p>
                </div>
                
                {remaining === 0 ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Fully Shipped
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-slate-500">Ship:</span>
                    <input
                      type="number"
                      min="0"
                      max={remaining}
                      value={dispatchQty[item.productId] ?? 0}
                      onChange={(e) => handleQtyChange(item.productId, e.target.value, remaining)}
                      className="w-16 px-1.5 py-1 text-xs border border-slate-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Remarks / Dispatch Notes</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
          placeholder="e.g. Carrier UPS, tracking info..."
          rows="2"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
        >
          Confirm Delivery
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;
