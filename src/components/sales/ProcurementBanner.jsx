/**
 * PURPOSE:
 * Displays a warning banner alerting operations staff about product stock shortages in a Sales Order.
 *
 * BUSINESS USE:
 * Informs logistics and purchasing operators about required procurement orders (Purchase vs Manufacturing)
 * to satisfy the draft or confirmed quotation lines.
 *
 * API USAGE:
 * Rendered inside `SalesOrdersPage` Details frame, using product stock data values.
 *
 * LOGIC EXPLANATION:
 * - Checks if the sales order is in a completed or cancelled state (returns null if so).
 * - Filters order items where `ordered quantity > available stock`.
 * - Computes the deficit shortage quantity.
 * - Formulates recommendations dynamically depending on the product's `procurementType`.
 */

import React from 'react';
import { AlertTriangle, Hammer, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProcurementBanner = ({ order, products = [] }) => {
  if (!order || order.status === 'fully_delivered' || order.status === 'cancelled') return null;

  // Identify lines where ordered quantity exceeds available stock
  const shortages = (order.items || [])
    .map(item => {
      const prod = products.find(p => p.id === item.productId);
      const stockVal = prod ? Number(prod.stock) || 0 : 0;
      if (prod && item.quantity > stockVal) {
        return {
          productId: item.productId,
          name: prod.name,
          code: prod.code,
          shortageQty: item.quantity - stockVal,
          procurementType: prod.procurementType || 'PURCHASE'
        };
      }
      return null;
    })
    .filter(Boolean);

  if (shortages.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4 mb-6 no-print text-xs">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Stock Shortage Warnings</h4>
          <div className="space-y-1 text-amber-800">
            {shortages.map((s, idx) => (
              <p key={idx} className="font-medium">
                Shortage of <strong className="text-rose-700">{s.shortageQty} units</strong> detected for{' '}
                <span className="font-semibold text-slate-800">{s.name} ({s.code})</span>.{' '}
                <span className="font-bold text-blue-700">
                  {s.procurementType === 'MANUFACTURING'
                    ? 'Recommended Manufacturing Order.'
                    : 'Recommended Purchase Order.'}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
        <Link
          to="/procurement"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Procurement</span>
        </Link>
        <Link
          to="/boms"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-350 rounded transition-colors"
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>BOM List</span>
        </Link>
      </div>
    </div>
  );
};

export default ProcurementBanner;
