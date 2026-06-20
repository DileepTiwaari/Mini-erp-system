// src/components/bom/ComponentEditor.jsx
// Displays a detailed breakdown of BOM cost calculations, factoring in waste percentages.
// Purpose: Summarizes item cost details and waste factors.
// Business Use: Informs production planners and cost accountants of total assembly material cost.
// API Usage: Reads localized product costs and parameters.

import React from 'react';
import { formatCurrency, formatQuantity } from '../../utils/formatters';

export const ComponentEditor = ({ bom, products = [] }) => {
  if (!bom) return null;

  // Calculate costs contributions factoring in waste percentages
  let totalCost = 0;
  const itemsBreakdown = (bom.items || []).map(item => {
    const prod = products.find(p => p.id === item.productId);
    const cost = prod ? prod.cost : 0;
    const wasteFactor = 1 + (Number(item.wastePercent) || 0) / 100;
    const totalQty = item.quantity * wasteFactor;
    const subtotal = cost * totalQty;
    totalCost += subtotal;
    
    return {
      ...item,
      name: prod ? prod.name : 'Unknown Component',
      code: prod ? prod.code : 'N/A',
      uom: prod ? prod.uom : 'pcs',
      cost,
      totalQty,
      subtotal
    };
  });

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Costing Calculations</h5>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 font-semibold">Total Materials Cost Contribution (with Waste):</span>
          <span className="text-lg font-bold text-indigo-700">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 font-semibold text-slate-600">
            <tr>
              <th className="px-4 py-2.5">Component Material</th>
              <th className="px-4 py-2.5 text-right">Net Qty</th>
              <th className="px-4 py-2.5 text-right">Waste %</th>
              <th className="px-4 py-2.5 text-right">Gross Qty Needed</th>
              <th className="px-4 py-2.5 text-right">Standard Unit Cost</th>
              <th className="px-4 py-2.5 text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {itemsBreakdown.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-4 py-2.5">
                  <span className="font-semibold text-slate-800">{row.name}</span>
                  <span className="block text-[10px] text-slate-400 font-bold">{row.code}</span>
                </td>
                <td className="px-4 py-2.5 text-right">{formatQuantity(row.quantity, row.uom)}</td>
                <td className="px-4 py-2.5 text-right text-slate-500 font-medium">{row.wastePercent || 0}%</td>
                <td className="px-4 py-2.5 text-right font-medium text-slate-900">{formatQuantity(row.totalQty, row.uom)}</td>
                <td className="px-4 py-2.5 text-right">{formatCurrency(row.cost)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-800">
                  {formatCurrency(row.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponentEditor;
