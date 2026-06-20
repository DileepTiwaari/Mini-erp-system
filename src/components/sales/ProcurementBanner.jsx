// src/components/sales/ProcurementBanner.jsx
// Warning banner to alert operations staff if inventory stocks are too low to satisfy order lines.

import React from 'react';
import { AlertTriangle, Hammer, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProcurementBanner = ({ order, products = [] }) => {
  if (!order || order.status === 'completed' || order.status === 'cancelled') return null;

  // Identify items where quantity ordered > current stock
  const shortages = (order.items || []).filter(item => {
    const prod = products.find(p => p.id === item.productId);
    return prod && prod.stock < item.quantity;
  });

  if (shortages.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 no-print">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold">Stock Insufficiency Warning</h4>
          <p className="text-xs text-amber-700 mt-0.5 leading-normal">
            Inventory stock is insufficient to fulfill {shortages.length} of the line items. You must replenish inventory before shipping.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
        <Link
          to="/procurement"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Replenish Parts</span>
        </Link>
        <Link
          to="/manufacturing-orders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>Schedule Manufacturing</span>
        </Link>
      </div>
    </div>
  );
};

export default ProcurementBanner;
