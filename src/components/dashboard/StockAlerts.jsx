/**
 * PURPOSE:
 * Displays critical inventory items that have dropped below safety stock reorder thresholds.
 *
 * WHY:
 * Informs warehouse and purchase managers immediately about low items to prevent production halts or stockouts.
 *
 * API:
 * GET /api/v1/dashboard/stock-alerts
 *
 * LOGIC USED:
 * Filters incoming products list to find items where `stock <= minStock`.
 * If any shortages are found, renders a table highlighting the available quantity and reorder point.
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const StockAlerts = ({ items = [] }) => {
  // Filter products below or equal to reorder safety points
  const shortages = items.filter((prod) => prod.stock <= prod.minStock);

  if (shortages.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm">
        <p className="text-slate-500 text-xs italic">All stock levels are currently healthy.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Stock Alerts ({shortages.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs text-left text-slate-650">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px]">
              <th className="px-5 py-2.5">Product Name</th>
              <th className="px-5 py-2.5">SKU / Code</th>
              <th className="px-5 py-2.5 text-center">Reorder Point</th>
              <th className="px-5 py-2.5 text-right">Available Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {shortages.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-slate-800 font-semibold">{prod.name}</td>
                <td className="px-5 py-3 text-slate-400 font-mono text-[10px]">{prod.code}</td>
                <td className="px-5 py-3 text-center text-slate-600">{prod.minStock} {prod.uom || 'pcs'}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                    prod.stock === 0
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {prod.stock} {prod.uom || 'pcs'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlerts;
