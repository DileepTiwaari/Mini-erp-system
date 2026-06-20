// src/components/reports/InventoryReport.jsx
// Inventory health, valuation ledger, and safety stock charts dashboard.
//
// PURPOSE:
// Aggregates stock levels and valuation metrics to generate visual logs.
//
// BUSINESS USE:
// Helps warehouse managers audit asset capital distribution and maintain reorder levels.
//
// API:
// Receives pre-fetched products, categories, and sales order history.
//
// LOGIC:
// Groups valuations by category code, maps safety reorder points against physical quantities,
// and extracts ordered volume data to rank fast-moving products.

import React from 'react';
import { formatCurrency, formatQuantity } from '../../utils/formatters';
import { Warehouse, Printer, Calendar, AlertOctagon, BarChart2, PackageOpen } from 'lucide-react';
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

export const InventoryReport = ({ products = [], categories = [], orders = [] }) => {
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unassigned';

  // 1. Calculations & Aggregations
  const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const lowStock = products.filter(p => p.stock <= p.minStock);
  const outOfStock = products.filter(p => p.stock === 0);

  // Group Valuation by Category for Chart
  const valuationByCategory = {};
  products.forEach(p => {
    const catName = getCategoryName(p.categoryId);
    valuationByCategory[catName] = (valuationByCategory[catName] || 0) + (p.stock * p.cost);
  });
  const categoryChartData = Object.keys(valuationByCategory).map(name => ({
    name: name.length > 12 ? name.substring(0, 12) + '...' : name,
    valuation: Number(valuationByCategory[name].toFixed(2))
  }));

  // Compare Current Stock vs Reorder margins (Top 8 products)
  const stockMarginsData = products.slice(0, 8).map(p => ({
    name: p.code,
    'Current Stock': p.stock,
    'Reorder Margin': p.minStock
  }));

  // Extract ordered volumes to rank Fast Moving Products
  const itemSalesVolumes = {};
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    (o.items || []).forEach(item => {
      itemSalesVolumes[item.productId] = (itemSalesVolumes[item.productId] || 0) + item.quantity;
    });
  });
  const fastMovingData = products
    .map(p => ({
      code: p.code,
      name: p.name,
      salesQty: itemSalesVolumes[p.id] || 0,
      stock: p.stock,
      uom: p.uom
    }))
    .filter(p => p.salesQty > 0)
    .sort((a, b) => b.salesQty - a.salesQty)
    .slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-blue-600" />
            <span>Inventory Valuation & Health Report</span>
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
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Asset Valuation</p>
          <p className="text-xl font-bold text-indigo-700 mt-1">{formatCurrency(totalValuation)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Asset capital held in store</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Active Stock Lines</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{products.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Unique SKUs monitored</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Safety margin breaches</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{lowStock.length} items</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Reorder points breached</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Out Of Stock</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{outOfStock.length} items</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Exhausted materials</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Value by Category */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            <span>Valuation by Product Category</span>
          </h4>
          <div className="h-64">
            {categoryChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No category valuations.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => [`$${value}`, 'Valuation']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="valuation" fill="#6366f1" name="Asset Value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Safety Stock levels comparison */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <span>Stock Levels vs. Reorder Margins</span>
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMarginsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Current Stock" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Reorder Margin" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fast-Moving Items & Low Stock Alerts */}
        <div className="p-4 border border-slate-200 rounded-lg lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fast Moving */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <PackageOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Fast-Moving Products Rank</span>
            </h4>
            <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">SKU</th>
                    <th className="px-3 py-2 text-left">Product Name</th>
                    <th className="px-3 py-2 text-right">Units Sold</th>
                    <th className="px-3 py-2 text-right">Current Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {fastMovingData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-center text-slate-400">No fast-moving items detected.</td>
                    </tr>
                  ) : (
                    fastMovingData.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono font-semibold text-slate-800">{item.code}</td>
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-3 py-2 text-right font-bold text-blue-600">{item.salesQty} {item.uom}</td>
                        <td className="px-3 py-2 text-right font-medium">{item.stock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Shortages */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
              <span>Safety Reorder Point Breaches</span>
            </h4>
            <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">SKU</th>
                    <th className="px-3 py-2 text-left">Product</th>
                    <th className="px-3 py-2 text-right">Stock</th>
                    <th className="px-3 py-2 text-right">Reorder Pt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {lowStock.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-center text-emerald-600 font-medium">All stock lines are healthy.</td>
                    </tr>
                  ) : (
                    lowStock.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono font-semibold text-slate-800">{item.code}</td>
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-3 py-2 text-right font-bold text-rose-600">{item.stock} {item.uom}</td>
                        <td className="px-3 py-2 text-right font-medium">{item.minStock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Grid Table */}
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
                  <td className="px-4 py-2.5 font-mono font-semibold text-slate-800">{p.code}</td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-slate-500">{getCategoryName(p.categoryId)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-850">{formatQuantity(p.stock, p.uom)}</td>
                  <td className="px-4 py-2.5 text-right">{formatCurrency(p.cost)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-indigo-650">{formatCurrency(p.stock * p.cost)}</td>
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
