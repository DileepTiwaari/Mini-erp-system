/**
 * PURPOSE:
 * Renders the detailed inspection page for a Sales Order.
 *
 * BUSINESS USE:
 * Gives managers a comprehensive overview of client information, GST, address parameters,
 * order line details, shipping logs, inventory stock balances, and procurement suggestions.
 *
 * API USAGE:
 * Consumes properties populated from sales APIs.
 *
 * LOGIC EXPLANATION:
 * Divides order specifications into professional cards:
 * 1. Customer Details (GST, Address details)
 * 2. Order Summary (Order Date, Status, Total)
 * 3. Products Ordered Table (subtotal math)
 * 4. Stock Availability & Procurement Recommendation Grid (Available, Reserved, Free to Use stock, shortages, PO/MO hints)
 * 5. Delivery History Tracker (past ship dates, items, remarks)
 */

import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import { ShoppingBag, Calendar, User, DollarSign, Layers, Truck } from 'lucide-react';

export const SalesOrderDetail = ({ order, customer, products = [] }) => {
  if (!order) return null;

  // Resolves product name and SKU
  const getProductInfo = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? { name: prod.name, code: prod.code, uom: prod.uom || 'pcs' } : { name: 'Unknown Product', code: 'N/A', uom: 'pcs' };
  };

  return (
    <div className="space-y-6">
      {/* Quotation Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{order.orderNumber}</span>
            <h4 className="text-xl font-bold text-slate-800 leading-tight mt-0.5">Sales Order Details</h4>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Meta Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Details Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-3 shadow-sm">
          <User className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Details</h5>
            <p className="text-sm font-bold text-slate-800">{customer?.name || 'Unknown Customer'}</p>
            {customer?.gstNumber && <p className="text-xs text-slate-500 font-mono">GST Number: {customer.gstNumber}</p>}
            <p className="text-xs text-slate-500 font-medium">Email: {customer?.email || 'N/A'}</p>
            <p className="text-xs text-slate-500 font-medium">Phone: {customer?.phone || 'N/A'}</p>
            {customer?.address && (
              <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-200/50 mt-1">
                Address: {customer.address}, {customer.city}, {customer.state}, {customer.country}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-3 shadow-sm">
          <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Summary</h5>
            <p className="text-sm font-semibold text-slate-850">Order Date: {formatDate(order.orderDate)}</p>
            <p className="text-xs text-slate-500 font-semibold">Payment Terms: Net 30 Days</p>
            <p className="text-xs text-slate-500 font-semibold">Status: <span className="uppercase text-slate-700">{order.status}</span></p>
          </div>
        </div>
      </div>

      {/* Products Ordered Table */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Products Ordered</h5>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-2.5">Item Name</th>
                <th className="px-4 py-2.5">SKU</th>
                <th className="px-4 py-2.5 text-right">Quantity</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700 font-medium">
              {(order.items || []).map((item, index) => {
                const info = getProductInfo(item.productId);
                return (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-850 font-semibold">{info.name}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{info.code}</td>
                    <td className="px-4 py-3 text-right">{item.quantity} {info.uom}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Availability & Procurement Suggestion Card */}
      {order.status !== 'fully_delivered' && (
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Stock Availability & Procurement Hints</span>
          </h5>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-150 text-left text-[11px] text-slate-650">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase text-[9px] bg-slate-50/50">
                  <th className="px-3 py-1.5">Product</th>
                  <th className="px-3 py-1.5 text-center">Available Stock</th>
                  <th className="px-3 py-1.5 text-center">Reserved</th>
                  <th className="px-3 py-1.5 text-center">Free to Use</th>
                  <th className="px-3 py-1.5 text-center">Order Qty</th>
                  <th className="px-3 py-1.5 text-right">Procurement Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(order.items || []).map((item, idx) => {
                  const prod = products.find(p => p.id === item.productId);
                  const stock = prod ? Number(prod.stock) || 0 : 0;
                  const reserved = prod ? Number(prod.reservedQty) || 0 : 0;
                  const free = stock - reserved;
                  const shortage = item.quantity > stock;
                  const shortageQty = item.quantity - stock;
                  const info = getProductInfo(item.productId);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="px-3 py-2 font-semibold text-slate-800">{info.name}</td>
                      <td className="px-3 py-2 text-center">{stock}</td>
                      <td className="px-3 py-2 text-center text-slate-400">{reserved}</td>
                      <td className="px-3 py-2 text-center text-emerald-700">{free}</td>
                      <td className="px-3 py-2 text-center text-slate-800 font-bold">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">
                        {shortage ? (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Shortage of {shortageQty} units. Recommending{' '}
                            {prod?.procurementType === 'MANUFACTURING' ? 'MO' : 'PO'}.
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold">Stock Available</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delivery History Tracker */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>Delivery History Tracking</span>
        </h5>
        
        {!order.deliveries || order.deliveries.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-2">No shipments dispatched yet for this order.</p>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {order.deliveries.map((del, idx) => (
              <div key={idx} className="pt-2.5 first:pt-0 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 uppercase mb-1">
                  <span>Shipment #{idx + 1}</span>
                  <span>Date: {formatDate(del.date)}</span>
                </div>
                
                <div className="bg-slate-50/50 p-2 border border-slate-100 rounded space-y-1">
                  <p className="text-slate-500"><strong className="text-slate-700">Remarks:</strong> {del.remarks || 'N/A'}</p>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Shipped Quantities:{' '}
                    {(del.items || []).map((shipped, sIdx) => {
                      const pInfo = getProductInfo(shipped.productId);
                      return (
                        <span key={sIdx} className="mr-3">
                          {pInfo.name}: <strong className="text-slate-800">{shipped.quantity} {pInfo.uom}</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total value summary */}
      <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-650 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-slate-405" />
          <span>Grand Sales Order Total:</span>
        </span>
        <span className="text-lg font-bold text-blue-700">{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>
  );
};

export default SalesOrderDetail;
