// src/components/reports/SalesReport.jsx
// Sales Report component showing sales order statuses, total values, and customer distribution.

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileText, Printer, Calendar } from 'lucide-react';

export const SalesReport = ({ orders = [], customers = [] }) => {
  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown';

  const completed = orders.filter(o => o.status === 'completed');
  const pending = orders.filter(o => o.status === 'pending');
  const draft = orders.filter(o => o.status === 'draft');
  const cancelled = orders.filter(o => o.status === 'cancelled');

  const totalRevenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingRevenue = pending.reduce((sum, o) => sum + o.totalAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <span>Sales Order Distribution Report</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Completed Revenue</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{completed.length} sales orders</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Pending Value</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(pendingRevenue)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{pending.length} orders pending</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Draft Quotations</p>
          <p className="text-xl font-bold text-slate-700 mt-1">
            {formatCurrency(draft.reduce((sum, o) => sum + o.totalAmount, 0))}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{draft.length} quotations</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Cancelled runs</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{cancelled.length} orders</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Rejected from floor</p>
        </div>
      </div>

      {/* Detailed Ledger List */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Order History Ledger</h4>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">SO Number</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Customer Name</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Total amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-800">{o.orderNumber}</td>
                  <td className="px-4 py-2.5">{formatDate(o.orderDate)}</td>
                  <td className="px-4 py-2.5 font-medium">{getCustomerName(o.customerId)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      o.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      o.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
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

export default SalesReport;
