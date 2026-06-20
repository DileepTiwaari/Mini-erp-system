// src/components/sales/SalesOrderDetail.jsx
// View detail sheet displaying sales order line items and status tracking.

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import { ShoppingBag, Calendar, User, DollarSign } from 'lucide-react';

export const SalesOrderDetail = ({ order, customer, products = [] }) => {
  if (!order) return null;

  const getProductName = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{order.orderNumber}</span>
            <h4 className="text-xl font-bold text-slate-800 leading-tight mt-0.5">Sales Quotation</h4>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Meta blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Detail */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <User className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Details</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">{customer?.name || 'Unknown customer'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Email: {customer?.email || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Phone: {customer?.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Order Dates */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Timeline</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">Date: {formatDate(order.orderDate)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Terms: Net 30 days</p>
          </div>
        </div>
      </div>

      {/* Lines Table */}
      <div>
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Order Items</h5>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Item Name</th>
                <th className="px-4 py-2.5 text-right">Quantity</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {(order.items || []).map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{getProductName(item.productId)}</td>
                  <td className="px-4 py-2.5 text-right">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Foot total */}
      <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-slate-500" />
          <span>Total Sales Order Value:</span>
        </span>
        <span className="text-lg font-bold text-indigo-700">{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>
  );
};

export default SalesOrderDetail;
