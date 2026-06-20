// src/components/reports/InventoryReport.jsx
// Inventory Valuation and status report with printing triggers.

import React from 'react';
import { formatCurrency, formatQuantity } from '../../utils/formatters';
import { Warehouse, Printer, Calendar } from 'lucide-react';

export const InventoryReport = ({ products = [], categories = [] }) => {
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'N/A';

  const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const lowStock = products.filter(p => p.stock <= p.minStock);
  const outOfStock = products.filter(p => p.stock === 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-brand-600" />
            <span>Inventory Valuation & Health Report</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Date: {new Date().toLocaleDateString()}</span>
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-sm transition-colors no-print"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>
      </div>

      {/* KPI stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Asset Valuation</p>
          <p className="text-xl font-bold text-indigo-700 mt-1">{formatCurrency(totalValuation)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Asset capital held in warehouse</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Critical Shortages</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{lowStock.length} items</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Safety margins breached</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Out of Stock</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{outOfStock.length} items</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Completely exhausted lines</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Material Valuation Ledger</h4>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">SKU / Code</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5 text-right">Available Stock</th>
                <th className="px-4 py-2.5 text-right">Unit Cost</th>
                <th className="px-4 py-2.5 text-right">Total Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{p.code}</td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-slate-500">{getCategoryName(p.categoryId)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{formatQuantity(p.stock, p.uom)}</td>
                  <td className="px-4 py-2.5 text-right">{formatCurrency(p.cost)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-indigo-700">{formatCurrency(p.stock * p.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
// Also mock reports
