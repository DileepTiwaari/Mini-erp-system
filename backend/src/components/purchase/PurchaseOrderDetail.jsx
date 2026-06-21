/**
 * PURPOSE:
 * Displays the detailed sheet of a selected Purchase Order.
 *
 * BUSINESS USE:
 * Allows procurement managers to view ordered product lines, financial subtotals
 * and grand totals (with 18% GST), and review goods receipts history logs.
 *
 * API USAGE:
 * None directly. Receives PO, vendor, and products catalogs as React props.
 *
 * LOGIC FLOW:
 * - Maps product IDs to names.
 * - Formats dates and currency values.
 * - Renders metadata columns, lines table, receipt shipment logs, and totals.
 */

import React from 'react';
import PurchaseStatusBadge from './PurchaseStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileText, Calendar, Truck, DollarSign, ListOrdered, Receipt } from 'lucide-react';

export const PurchaseOrderDetail = ({ order, vendor, products = [] }) => {
  if (!order) return null;

  const getProductName = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Product';
  };

  // Calculations
  const orderSubtotal = order.orderTotal || 0;
  const taxAmount = order.taxTotal || 0;
  const grandTotal = order.grandTotal || order.totalAmount || 0;

  // Receipts list
  const receipts = order.receipts || [];

  return (
    <div className="space-y-6 text-xs font-medium">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Order Doc</span>
            <h4 className="text-base font-black text-slate-800 leading-tight mt-0.5">{order.orderNumber}</h4>
          </div>
        </div>
        <PurchaseStatusBadge status={order.status} />
      </div>

      {/* Meta Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vendor Supplier Info */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
          <Truck className="w-5 h-5 text-slate-450 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vendor Supplier Details</h5>
            <p className="text-xs font-bold text-slate-850">{vendor?.name || 'Unknown supplier'}</p>
            {vendor?.code && <p className="text-slate-500 font-mono">Code: {vendor.code}</p>}
            {vendor?.gstNumber && <p className="text-slate-500 font-mono">GST ID: {vendor.gstNumber}</p>}
            <p className="text-slate-500">Contact: {vendor?.contactName || 'N/A'} | {vendor?.phone || 'N/A'}</p>
            <p className="text-slate-500">
              Address: {vendor?.address || 'N/A'}
              {vendor?.city && `, ${vendor.city}`}
              {vendor?.state && `, ${vendor.state}`}
              {vendor?.country && ` (${vendor.country})`}
            </p>
          </div>
        </div>

        {/* PO Dates & Timeline */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
          <Calendar className="w-5 h-5 text-slate-450 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeline Details</h5>
            <p className="text-slate-500">Order Date: <span className="font-semibold text-slate-700">{formatDate(order.orderDate)}</span></p>
            <p className="text-slate-500">Expected Date: <span className="font-semibold text-slate-750">{formatDate(order.expectedDate) || 'Not specified'}</span></p>
            <p className="text-slate-500">Procurement Type: Standard Raw Material Purchase</p>
          </div>
        </div>
      </div>

      {/* Ordered Line Items Table */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <ListOrdered className="w-4 h-4 text-slate-450" />
          <h5 className="text-xs font-bold text-slate-650 uppercase tracking-wider">Items Ordered</h5>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-650 font-bold">
              <tr>
                <th className="px-4 py-2.5">Product / Item</th>
                <th className="px-4 py-2.5 text-right">Ordered Qty</th>
                <th className="px-4 py-2.5 text-right">Received Qty</th>
                <th className="px-4 py-2.5 text-right">Unit Cost</th>
                <th className="px-4 py-2.5 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {(order.items || []).map((item, index) => {
                const received = (order.receivedQty || {})[item.productId] || 0;
                return (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">{getProductName(item.productId)}</td>
                    <td className="px-4 py-2.5 text-right">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 font-semibold">{received}</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(item.unitCost)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-850">
                      {formatCurrency(item.quantity * item.unitCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipts History Log */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Receipt className="w-4 h-4 text-slate-450" />
          <h5 className="text-xs font-bold text-slate-650 uppercase tracking-wider">Receipts History Logs</h5>
        </div>
        
        {receipts.length === 0 ? (
          <div className="text-center py-5 border border-dashed border-slate-200 rounded-lg text-slate-400">
            No material shipments received for this order yet.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-36 overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-250 text-left text-xs">
              <thead className="bg-slate-50 text-slate-650 font-bold sticky top-0">
                <tr>
                  <th className="px-3 py-2">Receipt Date</th>
                  <th className="px-3 py-2">Product Item</th>
                  <th className="px-3 py-2 text-right">Received Qty</th>
                  <th className="px-3 py-2">Logged User</th>
                  <th className="px-3 py-2">Notes / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {receipts.flatMap((receipt, rIdx) => 
                  (receipt.items || []).map((rItem, iIdx) => (
                    <tr key={`${rIdx}-${iIdx}`} className="hover:bg-slate-50/30">
                      <td className="px-3 py-2 text-slate-500 font-semibold">{formatDate(receipt.date)}</td>
                      <td className="px-3 py-2 font-medium">{getProductName(rItem.productId)}</td>
                      <td className="px-3 py-2 text-right text-emerald-600 font-bold">+{rItem.quantity}</td>
                      <td className="px-3 py-2 text-slate-500">{receipt.user || 'System'}</td>
                      <td className="px-3 py-2 text-slate-500 truncate max-w-xs">{receipt.remarks || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Financial Summary card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-slate-650">
          <DollarSign className="w-4 h-4 text-slate-400" />
          <span>Financial summary breakdown (18% tax calculation):</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-slate-750">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Purchase Subtotal</span>
            <span>{formatCurrency(orderSubtotal)}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block">GST Tax (18%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 text-sm font-black text-blue-700">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
