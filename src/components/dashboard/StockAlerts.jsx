// src/components/dashboard/StockAlerts.jsx
// 
// WHAT IT DOES:
// Renders a low-stock alert block displaying a detailed, professional table of items 
// whose stock hand quantities are below their specified safety reorder margins.
// 
// WHY IT IS REQUIRED:
// 1. Keeps warehouse managers informed of immediate material shortages or raw material deficiencies.
// 2. Groups stock data (On Hand, Safety Thresholds) dynamically in a high-contrast layout.
// 3. Prompts actions by providing direct links to operations boards or procurement triggers.
// 
// WHEN IT IS USED:
// Loaded on the DashboardPage space if any products are running low.

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * WHAT IT DOES: Component displaying low-stock alerts.
 * WHY IT IS REQUIRED: Provides warning boxes and details grid for products below safety margins.
 * WHEN IT IS USED: Rendered inside DashboardPage.jsx.
 * 
 * @param {Array} items - All products list containing name, stock, minStock.
 */
export const StockAlerts = ({ items = [] }) => {
  // WHAT IT DOES: Filters products list to identify items that are below or equal to reorder safety points.
  // WHY IT IS REQUIRED: Identifies material shortages.
  // WHEN IT IS USED: Checked on every render.
  const shortages = items.filter(i => i.stock <= i.minStock);

  // If no shortages exist, do not render this alert container
  if (shortages.length === 0) return null;

  return (
    <div className="bg-white border border-rose-200 rounded-lg shadow-sm overflow-hidden no-print">
      {/* Alert Header Banner */}
      <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <h4 className="text-sm font-bold uppercase tracking-wider">Critical Inventory shortages</h4>
        </div>
        <Link
          to="/procurement"
          className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors"
        >
          <span>Open Procurement Wizard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid table listing critical products */}
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-xs text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-4 py-2.5 rounded-l">Product Name</th>
              <th className="px-4 py-2.5">SKU / Code</th>
              <th className="px-4 py-2.5 text-center">Safety Reorder Point</th>
              <th className="px-4 py-2.5 text-right rounded-r">Current On Hand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {shortages.map((prod) => (
              <tr 
                key={prod.id} 
                className="hover:bg-rose-50/30 transition-colors"
              >
                <td className="px-4 py-3 text-slate-800 font-semibold">{prod.name}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{prod.code}</td>
                <td className="px-4 py-3 text-center">{prod.minStock} {prod.uom || 'pcs'}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                    prod.stock === 0
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
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
