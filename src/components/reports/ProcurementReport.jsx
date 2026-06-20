// src/components/reports/ProcurementReport.jsx
// Procurement operations, PO spend analysis, and MO workload charts dashboard.
//
// PURPOSE:
// Computes and charts procurement spend and manufacturing volumes.
//
// BUSINESS USE:
// Enables replenishment personnel to review PO budgets, MO schedules, and current material shortages.
//
// API:
// Receives pre-fetched purchase orders, vendors, manufacturing orders, and shortages recommendations.
//
// LOGIC:
// Groups PO vs MO transaction volumes chronologically, aggregates total expenditures, and lists shortages.

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingCart, Printer, Calendar, BarChart3, AlertCircle, Wrench } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const ProcurementReport = ({
  orders = [],
  vendors = [],
  mfgOrders = [],
  recommendations = [],
  products = []
}) => {
  const getVendorName = (id) => vendors.find(v => v.id === id)?.name || 'Unknown Vendor';
  const getProductName = (id) => products.find(p => p.id === id)?.name || `Product ${id}`;

  // 1. Calculations & Aggregations
  const activePOs = orders.filter(o => o.status !== 'cancelled');
  const completedPOs = orders.filter(o => o.status === 'fully_received');
  const totalSpend = completedPOs.reduce((sum, o) => sum + o.totalAmount, 0);
  const committedSpend = orders.filter(o => o.status === 'confirmed').reduce((sum, o) => sum + o.totalAmount, 0);

  const activeMOs = mfgOrders.filter(m => m.status !== 'CANCELLED' && m.status !== 'cancelled');
  const completedMOsCount = mfgOrders.filter(m => m.status === 'COMPLETED' || m.status === 'completed' || m.status === 'done' || m.status === 'DONE').length;
  const inProgressMOsCount = mfgOrders.filter(m => m.status === 'IN_PROGRESS' || m.status === 'in_progress').length;

  // Group PO count vs MO count by date for trends
  const dateMap = {};
  activePOs.forEach(po => {
    const d = po.orderDate;
    if (!dateMap[d]) dateMap[d] = { date: d, POs: 0, MOs: 0 };
    dateMap[d].POs += 1;
  });
  activeMOs.forEach(mo => {
    const d = mo.plannedStartDate;
    if (d) {
      if (!dateMap[d]) dateMap[d] = { date: d, POs: 0, MOs: 0 };
      dateMap[d].MOs += 1;
    }
  });

  const trendData = Object.keys(dateMap)
    .sort()
    .map(date => ({
      date: formatDate(date),
      'Purchase Orders': dateMap[date].POs,
      'Manufacturing Orders': dateMap[date].MOs
    }))
    .slice(-10); // display last 10 dates

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      {/* Header Banner */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>Procurement & Supply Chain Spend Report</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Generated: {new Date().toLocaleDateString()}</span>
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

      {/* KPI Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Purchase Spend</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalSpend)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{completedPOs.length} completed receipts</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Committed PO Budget</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(committedSpend)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active pending intakes</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Manufacturing Workload</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{activeMOs.length} runs</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{inProgressMOsCount} in progress, {completedMOsCount} completed</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Pending Shortages</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{recommendations.length} items</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Replenishment recommendations</p>
        </div>
      </div>

      {/* Procurement Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="p-4 border border-slate-200 rounded-lg lg:col-span-2">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span>Procurement Activity Trends</span>
          </h4>
          <div className="h-64">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No PO or MO records found.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Purchase Orders" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Manufacturing Orders" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Manufacturing Order Status distribution */}
        <div className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-purple-500" />
              <span>Mfg Orders Status</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Planned</span>
                <span className="font-bold text-slate-700">{mfgOrders.filter(m => m.status === 'PLANNED' || m.status === 'planned').length} orders</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">In Progress</span>
                <span className="font-bold text-amber-600">{inProgressMOsCount} orders</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Completed</span>
                <span className="font-bold text-emerald-600">{completedMOsCount} orders</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Cancelled</span>
                <span className="font-bold text-rose-600">{mfgOrders.filter(m => m.status === 'CANCELLED' || m.status === 'cancelled').length} orders</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 text-center text-xs text-slate-500 mt-4 leading-normal">
            BOM components stock levels are updated dynamically upon completing manufacturing runs.
          </div>
        </div>
      </div>

      {/* Shortages recommendations table */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>Active Material Shortages & Recommendations</span>
        </h4>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Product Name</th>
                <th className="px-4 py-2.5">Strategy</th>
                <th className="px-4 py-2.5 text-right">Shortage Qty</th>
                <th className="px-4 py-2.5">Procurement Action</th>
                <th className="px-4 py-2.5">Replenishment Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {recommendations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400 font-medium">No material shortages recorded.</td>
                </tr>
              ) : (
                recommendations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-slate-800">{rec.productName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{rec.productCode}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-slate-500">{rec.refNumber ? 'MTO' : 'MTS'}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-800">{rec.recommendedQty} {rec.uom}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase ${
                        rec.procurementType === 'MANUFACTURING'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {rec.procurementType === 'MANUFACTURING' ? 'Schedule MO' : 'Create PO Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-medium max-w-xs truncate">{rec.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed PO Table */}
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
                      o.status === 'fully_received' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      o.status === 'partially_received' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      o.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
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

export default ProcurementReport;
