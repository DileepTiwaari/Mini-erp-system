// src/components/manufacturing/ManufacturingOrderDetail.jsx
// View detail sheet displaying MO configurations, materials required, and subtasks work orders.

import React from 'react';
import { formatDate, formatQuantity } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import { Hammer, Calendar, Wrench, Package } from 'lucide-react';

export const ManufacturingOrderDetail = ({ order, product, bom, components = [], workOrders = [], workCenters = [] }) => {
  if (!order) return null;

  const getComponentName = (prodId) => {
    const p = components.find(item => item.id === prodId);
    return p ? `${p.name} (${p.code})` : 'Unknown Component';
  };

  const getWcName = (wcId) => {
    const wc = workCenters.find(w => w.id === wcId);
    return wc ? `${wc.name} (${wc.code})` : 'Assembly Line';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{order.moNumber}</span>
            <h4 className="text-xl font-bold text-slate-800 leading-tight mt-0.5">Manufacturing Order</h4>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Meta blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Output Assembly */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <Package className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output Assembly</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">{product?.name || 'Unknown Item'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Target Run Quantity: {order.quantity} pcs</p>
          </div>
        </div>

        {/* Timelines */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Production timelines</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">Planned Start: {formatDate(order.plannedStartDate)}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Completed Date: {order.actualEndDate ? formatDate(order.actualEndDate) : 'In Progress'}
            </p>
          </div>
        </div>
      </div>

      {/* Materials Requirements lists */}
      {bom && (
        <div>
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Bill of Materials - Raw inputs required</h5>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-2">Component Name</th>
                  <th className="px-4 py-2 text-right">Required (Qty per Unit)</th>
                  <th className="px-4 py-2 text-right">Total Run Quantity</th>
                  <th className="px-4 py-2 text-right">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {(bom.items || []).map((item, index) => {
                  const comp = components.find(p => p.id === item.productId);
                  const totalNeeded = item.quantity * order.quantity;
                  const isShortage = comp ? comp.stock < totalNeeded : false;

                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-800">{getComponentName(item.productId)}</td>
                      <td className="px-4 py-2 text-right">{item.quantity} {comp?.uom || ''}</td>
                      <td className="px-4 py-2 text-right font-semibold text-slate-800">
                        {totalNeeded} {comp?.uom || ''}
                      </td>
                      <td className={`px-4 py-2 text-right font-semibold ${isShortage ? 'text-rose-600' : 'text-slate-800'}`}>
                        {comp ? formatQuantity(comp.stock, comp.uom) : 'N/A'}
                        {isShortage && <span className="block text-[10px] text-rose-500 font-bold">Shortage</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Operational Subtasks (Work Orders) */}
      <div>
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-slate-400" />
          <span>Operational Job Steps</span>
        </h5>
        
        {workOrders.length === 0 ? (
          <p className="text-slate-400 text-xs italic">No job steps configured.</p>
        ) : (
          <div className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{wo.name}</p>
                  <p className="text-slate-500 mt-0.5">Station: {getWcName(wo.workCenterId)} | Duration: {wo.durationPlanned} mins</p>
                </div>
                <StatusBadge status={wo.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturingOrderDetail;
