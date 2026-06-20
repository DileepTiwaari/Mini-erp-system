// src/components/reports/SalesReport.jsx
// Sales Report component showing orders distribution, revenue charts, and customer trends.
//
// PURPOSE:
// Computes and visualizes sales performance metrics.
//
// BUSINESS USE:
// Enables management to analyze revenue growth, check top products, and identify high-value clients.
//
// API:
// Receives pre-fetched sales, customer, and product arrays.
//
// LOGIC:
// Calculates aggregates (revenue, averages) and structures them into arrays for Recharts line and bar graphs.

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileText, Printer, Calendar, TrendingUp, Package, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const SalesReport = ({ orders = [], customers = [], products = [] }) => {
  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown Customer';

  // 1. Calculations & Aggregations
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'fully_delivered');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;
  const cancellationRate = orders.length > 0 ? (orders.filter(o => o.status === 'cancelled').length / orders.length) * 100 : 0;

  // Group revenue by date for Trend chart
  const revenueByDate = {};
  activeOrders.forEach(o => {
    const date = o.orderDate;
    revenueByDate[date] = (revenueByDate[date] || 0) + o.totalAmount;
  });
  const revenueTrendData = Object.keys(revenueByDate)
    .sort()
    .map(date => ({
      date: formatDate(date),
      revenue: Number(revenueByDate[date].toFixed(2))
    }));

  // Group quantities by product for Top Products chart
  const productSales = {};
  activeOrders.forEach(o => {
    (o.items || []).forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const name = prod ? prod.name : `Product ${item.productId}`;
      productSales[name] = (productSales[name] || 0) + item.quantity;
    });
  });
  const topProductsData = Object.keys(productSales)
    .map(name => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      quantity: productSales[name]
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Group spend by customer for Customer Trends
  const customerSpends = {};
  activeOrders.forEach(o => {
    const custName = getCustomerName(o.customerId);
    customerSpends[custName] = (customerSpends[custName] || 0) + o.totalAmount;
  });
  const customerTrendsData = Object.keys(customerSpends)
    .map(name => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      spend: Number(customerSpends[name].toFixed(2))
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      {/* Header Banner */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Sales Performance & Distribution Report</span>
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
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Sales Volume</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{orders.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{activeOrders.length} active orders</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total revenue</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{completedOrders.length} fully delivered</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Avg. Order Value</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(avgOrderValue)}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Average ticket amount</p>
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Cancellation Rate</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{cancellationRate.toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Ratio of rejected runs</p>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Over Time */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Revenue Trend</span>
          </h4>
          <div className="h-64">
            {revenueTrendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No sales data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Daily Revenue" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-purple-500" />
            <span>Top 5 Products (by Quantity)</span>
          </h4>
          <div className="h-64">
            {topProductsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No product sales records.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => [value, 'Qty Sold']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="quantity" fill="#8b5cf6" name="Quantity Sold" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Customer Trends */}
        <div className="p-4 border border-slate-200 rounded-lg lg:col-span-2">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Top Customers (by Revenue contribution)</span>
          </h4>
          <div className="h-64">
            {customerTrendsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No customer spend records.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => [`$${value}`, 'Contribution']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="spend" fill="#10b981" name="Aggregate Spend" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Table Grid */}
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
                <th className="px-4 py-2.5 text-right">Total Amount</th>
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
                      o.status === 'fully_delivered' || o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      o.status === 'partially_delivered' ? 'bg-amber-50 text-amber-700 border-amber-100' :
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

export default SalesReport;
