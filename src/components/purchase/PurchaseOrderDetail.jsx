// src/components/purchase/PurchaseOrderDetail.jsx
// View detail sheet displaying purchase order details.

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import { FileText, Calendar, Truck, DollarSign } from 'lucide-react';

export const PurchaseOrderDetail = ({ order, vendor, products = [] }) => {
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
          <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{order.orderNumber}</span>
            <h4 className="text-xl font-bold text-slate-800 leading-tight mt-0.5">Purchase Order</h4>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Meta blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vendor Supplier Info */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <Truck className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor Supplier</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">{vendor?.name || 'Unknown supplier'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Contact: {vendor?.contactName || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Email: {vendor?.email || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Address: {vendor?.address || 'N/A'}</p>
          </div>
        </div>

        {/* Order Dates */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline details</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">Date: {formatDate(order.orderDate)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Procurement mode: Safety stock replenishment</p>
          </div>
        </div>
      </div>

      {/* Lines Table */}
      <div>
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Line items ordered</h5>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Item Name</th>
                <th className="px-4 py-2.5 text-right">Quantity</th>
                <th className="px-4 py-2.5 text-right">Unit Cost</th>
                <th className="px-4 py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {(order.items || []).map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{getProductName(item.productId)}</td>
                  <td className="px-4 py-2.5 text-right">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right">{formatCurrency(item.unitCost)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800">
                    {formatCurrency(item.quantity * item.unitCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total spend */}
      <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-slate-500" />
          <span>Total Purchase Spend:</span>
        </span>
        <span className="text-lg font-bold text-indigo-700">{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
