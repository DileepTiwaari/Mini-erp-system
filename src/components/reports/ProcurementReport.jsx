// src/components/reports/ProcurementReport.jsx
// Procurement and purchase spend analysis report.

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingCart, Printer, Calendar } from 'lucide-react';

export const ProcurementReport = ({ orders = [], vendors = [] }) => {
  const getVendorName = (id) => vendors.find(v => v.id === id)?.name || 'Unknown';

  const completed = orders.filter(o => o.status === 'completed');
  const approved = orders.filter(o => o.status === 'approved');
  const draft = orders.filter(o => o.status === 'draft');

  const totalSpend = completed.reduce((sum, o) => sum + o.totalAmount, 0);
  const committedSpend = approved.reduce((sum, o) => sum + o.totalAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-600" />
            <span>Procurement & Purchase Spend Report</span>
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
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Purchase Spend (Completed)</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalSpend)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{completed.length} completed receipts</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Active Committed Spend</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(committedSpend)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{approved.length} approved purchase orders</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Draft PO (Estimates)</p>
          <p className="text-xl font-bold text-slate-700 mt-1">
            {formatCurrency(draft.reduce((sum, o) => sum + o.totalAmount, 0))}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{draft.length} pending quotations</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Purchase Order Ledger</h4>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">PO Number</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Vendor Name</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-800">{o.orderNumber}</td>
                  <td className="px-4 py-2.5">{formatDate(o.orderDate)}</td>
                  <td className="px-4 py-2.5 font-medium">{getVendorName(o.vendorId)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      o.status === 'approved' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{formatCurrency(o.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcurementReport;
