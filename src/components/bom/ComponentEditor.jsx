// src/components/bom/ComponentEditor.jsx
// Displays a detailed breakdown of BOM cost calculations.

import React from 'react';
import { formatCurrency, formatQuantity } from '../../utils/formatters';

export const ComponentEditor = ({ bom, products = [] }) => {
  if (!bom) return null;

  // Calculate costs contributions
  let totalCost = 0;
  const itemsBreakdown = (bom.items || []).map(item => {
    const prod = products.find(p => p.id === item.productId);
    const cost = prod ? prod.cost : 0;
    const subtotal = cost * item.quantity;
    totalCost += subtotal;
    
    return {
      ...item,
      name: prod ? prod.name : 'Unknown Component',
      code: prod ? prod.code : 'N/A',
      uom: prod ? prod.uom : '',
      cost,
      subtotal
    };
  });

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Costing Calculations</h5>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 font-semibold">Total Materials Cost Contribution:</span>
          <span className="text-lg font-bold text-indigo-700">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 font-semibold text-slate-600">
            <tr>
              <th className="px-4 py-2.5">Component Material</th>
              <th className="px-4 py-2.5 text-right">Qty Needed</th>
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
