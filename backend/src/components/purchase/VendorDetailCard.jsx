/**
 * PURPOSE:
 * Renders the detail overlay profile panel for a single supplier vendor.
 *
 * BUSINESS USE:
 * Gives procurement operators a 360-degree dashboard of a supplier: their contact card,
 * registration details (GST code), aggregate transaction metrics (orders count, total spend),
 * and lists recent Purchase Orders.
 *
 * API USAGE:
 * None directly. Receives `vendor` and associated `orders` arrays as React props.
 *
 * LOGIC FLOW:
 * - Aggregates stats from orders matching `vendorId`.
 * - Computes total count of orders and sum of PO grand totals.
 * - Renders a profile card and a sub-table list of recent purchase invoices.
 */

import React from 'react';
import PurchaseStatusBadge from './PurchaseStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { User, Phone, Mail, FileText, DollarSign, MapPin } from 'lucide-react';

export const VendorDetailCard = ({ vendor, orders = [], onViewOrder, onClose }) => {
  if (!vendor) return null;

  // Filter orders related to this vendor supplier
  const vendorOrders = orders.filter((o) => o.vendorId === vendor.id);

  // Compute metrics
  const totalOrdersCount = vendorOrders.length;
  const totalSpend = vendorOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.grandTotal || o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Supplier header block */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{vendor.code || 'VND-XXX'}</span>
              <span className={`inline-block w-2 h-2 rounded-full ${vendor.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} title={vendor.status}></span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{vendor.name}</h4>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-semibold ${vendor.status === 'ACTIVE' ? 'bg-emerald-55 text-emerald-700 border border-emerald-200' : 'bg-slate-55 text-slate-700 border border-slate-200'}`}>
          {vendor.status || 'ACTIVE'}
        </span>
      </div>

      {/* Aggregate Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-slate-850 mt-1">{totalOrdersCount}</p>
          </div>
          <FileText className="w-8 h-8 text-slate-300" />
        </div>
        
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Spend</p>
            <p className="text-xl font-black text-blue-700 mt-1">{formatCurrency(totalSpend)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-200" />
        </div>
      </div>

      {/* Contact card info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-lg border border-slate-150 text-xs">
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Contact Representative</p>
            <p className="font-semibold text-slate-700 mt-0.5">{vendor.contactName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
            <p className="font-semibold text-slate-750 mt-0.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{vendor.phone || 'N/A'}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
            <p className="font-semibold text-slate-750 mt-0.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="break-all">{vendor.email || 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">GST Tax ID</p>
            <p className="font-mono font-semibold text-slate-700 mt-0.5 uppercase tracking-wide">{vendor.gstNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Billing / Shipping Address</p>
            <p className="font-semibold text-slate-750 mt-0.5 flex gap-1 items-start">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {vendor.address || 'N/A'}
                {vendor.city && `, ${vendor.city}`}
                {vendor.state && `, ${vendor.state}`}
                {vendor.country && `, ${vendor.country}`}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Recent Purchases List */}
      <div>
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Purchase Orders History</h5>
        {vendorOrders.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded text-slate-400 text-xs">
            No purchase transactions logged for this vendor.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-48 overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-650 font-bold sticky top-0">
                <tr>
                  <th className="px-3 py-2">PO Number</th>
                  <th className="px-3 py-2">Order Date</th>
                  <th className="px-3 py-2 text-right">Grand Total</th>
                  <th className="px-3 py-2 text-center">Status</th>
                  {onViewOrder && <th className="px-3 py-2 text-right">View</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vendorOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-semibold text-slate-800">{o.orderNumber}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDate(o.orderDate)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-850">
                      {formatCurrency(o.grandTotal || o.totalAmount || 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <PurchaseStatusBadge status={o.status} />
                    </td>
                    {onViewOrder && (
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => onViewOrder(o)}
                          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail actions */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};

export default VendorDetailCard;
