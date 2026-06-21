// src/components/inventory/InventorySummary.jsx
// Displays a collection of layout widgets summarizing inventory health metrics.

import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Warehouse, ShieldAlert, BadgeDollarSign, Ban } from 'lucide-react';

export const InventorySummary = ({ summaryData }) => {
  if (!summaryData) return null;

  const cards = [
    { title: 'Inventory Valuation', value: formatCurrency(summaryData.totalValuation), icon: BadgeDollarSign, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { title: 'Total SKUs Cataloged', value: `${summaryData.totalItems} products`, icon: Warehouse, color: 'text-brand-600 bg-brand-50 border-brand-200' },
    { title: 'Safety Margin Alarms', value: `${summaryData.lowStockCount} shortages`, icon: ShieldAlert, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Out of Stock Items', value: `${summaryData.outOfStockCount} items`, icon: Ban, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{c.title}</span>
              <span className="text-lg font-bold text-slate-800 tracking-tight block mt-1">{c.value}</span>
            </div>
            <div className={`p-3 rounded-lg border ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventorySummary;
