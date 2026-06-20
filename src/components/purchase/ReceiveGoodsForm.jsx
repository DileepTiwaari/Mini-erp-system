/**
 * PURPOSE:
 * Renders the form to log material shipments and goods receipts from suppliers.
 *
 * BUSINESS USE:
 * Allows warehouse controllers to record the exact quantities received for each product line,
 * supporting full receipts or partial receipts, and adjusting raw inventory stock levels.
 *
 * API USAGE:
 * None directly. Invokes the `onSubmit` callback.
 *
 * LOGIC FLOW:
 * - Maps PO line items.
 * - Compares original ordered quantities with already received totals.
 * - Exposes editable inputs for current received batch quantities, defaulting to the remaining balance.
 * - Validates inputs to ensure positive integers.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Calendar, Package, Clipboard } from 'lucide-react';

export const ReceiveGoodsForm = ({ onSubmit, onCancel, order, products = [] }) => {
  const { showToast } = useToast();
  
  // Local form states
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [quantities, setQuantities] = useState({});

  // Initialize receipt quantities with remaining balance
  useEffect(() => {
    if (order && order.items) {
      const initialQtyMap = {};
      order.items.forEach((item) => {
        const received = (order.receivedQty || {})[item.productId] || 0;
        const remaining = Math.max(0, item.quantity - received);
        initialQtyMap[item.productId] = remaining;
      });
      setQuantities(initialQtyMap);
    }
  }, [order]);

  if (!order) return null;

  const getProductName = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Product';
  };

  const handleQtyChange = (productId, val) => {
    const intVal = Math.max(0, parseInt(val) || 0);
    setQuantities({
      ...quantities,
      [productId]: intVal
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verify date
    if (!receiptDate) {
      showToast('Receipt date is required.', 'warning');
      return;
    }

    if (receiptDate < order.orderDate) {
      showToast('Receipt date cannot be earlier than order date.', 'warning');
      return;
    }

    // Verify that at least one item is being received
    const itemsToSubmit = [];
    let hasInvalidQty = false;
    let totalReceivedThisBatch = 0;

    order.items.forEach((item) => {
      const qty = quantities[item.productId] || 0;
      const alreadyReceived = (order.receivedQty || {})[item.productId] || 0;
      const remaining = item.quantity - alreadyReceived;

      if (qty < 0) {
        hasInvalidQty = true;
      }

      if (qty > 0) {
        // Warning if user over-receives, but let's allow it if needed, or cap it.
        // Let's allow but double-check.
        itemsToSubmit.push({
          productId: item.productId,
          quantity: qty
        });
        totalReceivedThisBatch += qty;
      }
    });

    if (hasInvalidQty) {
      showToast('Received quantities must be non-negative integers.', 'warning');
      return;
    }

    if (totalReceivedThisBatch === 0) {
      showToast('Please enter a received quantity greater than 0 for at least one item line.', 'warning');
      return;
    }

    onSubmit({
      receiptDate,
      items: itemsToSubmit,
      remarks: remarks.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg leading-normal flex items-start gap-2">
        <Package className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
        <div>
          Logging material receipt shipment for Purchase Order <span className="font-bold">{order.orderNumber}</span>. This will increase product physical stock levels immediately.
        </div>
      </div>

      {/* Item Lines Grid */}
      <div className="space-y-2">
        <h4 className="font-bold text-slate-800 text-sm">Goods Dispatch Quantities</h4>
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-650 font-bold">
              <tr>
                <th className="px-3 py-2">Item Name</th>
                <th className="px-3 py-2 text-right">Ordered</th>
                <th className="px-3 py-2 text-right">Received</th>
                <th className="px-3 py-2 text-right w-24">Current Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {order.items.map((item) => {
                const received = (order.receivedQty || {})[item.productId] || 0;
                const remaining = Math.max(0, item.quantity - received);
                
                return (
                  <tr key={item.productId} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-semibold text-slate-800">{getProductName(item.productId)}</td>
                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-emerald-600 font-semibold">{received}</td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        value={quantities[item.productId] !== undefined ? quantities[item.productId] : remaining}
                        onChange={(e) => handleQtyChange(item.productId, e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-xs"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Receipt Date */}
        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Receipt Intake Date *</span>
          </label>
          <input
            type="date"
            required
            value={receiptDate}
            onChange={(e) => setReceiptDate(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          />
        </div>

        {/* Remarks / Notes */}
        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
            <Clipboard className="w-3.5 h-3.5 text-slate-400" />
            <span>Receipt Notes / Remarks</span>
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. Batch inspected, no defects"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
        >
          Process Goods Receipt
        </button>
      </div>
    </form>
  );
};

export default ReceiveGoodsForm;
