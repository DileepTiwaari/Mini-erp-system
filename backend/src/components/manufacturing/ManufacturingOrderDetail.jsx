// src/components/manufacturing/ManufacturingOrderDetail.jsx
// View detail sheet displaying MO configurations, materials required, and subtasks work orders.
// Purpose: Displays MO parameters, assignee, components, waste factor, and routing statuses.
// Business Use: Provides a complete audit panel of a production run for floor managers.
// API Usage: Reads user database dynamically via mockDb.

import React from 'react';
import { formatDate, formatQuantity } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import { Hammer, Calendar, Wrench, Package, User } from 'lucide-react';
import { mockDb, DB_KEYS } from '../../utils/mockDb';

export const ManufacturingOrderDetail = ({ order, product, bom, components = [], workOrders = [], workCenters = [] }) => {
  if (!order) return null;

  const getComponentName = (prodId) => {
    const p = components.find(item => item.id === prodId);
    return p ? `${p.name} (${p.code})` : 'Unknown Component';
  };

  const getWcName = (wcId) => {
    const wc = workCenters.find(w => w.id === wcId || w.code === wcId);
    return wc ? `${wc.name} (${wc.code})` : 'Assembly Line';
  };

  const getAssigneeName = (userId) => {
    try {
      const users = mockDb.getAll(DB_KEYS.USERS);
      const u = users.find(usr => usr.id === userId);
      return u ? u.name : userId || 'Unassigned';
    } catch (e) {
      return userId || 'Unassigned';
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Production Timelines</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">Planned Start: {formatDate(order.plannedStartDate)}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Completed Date: {order.actualEndDate ? formatDate(order.actualEndDate) : 'In Progress'}
            </p>
          </div>
        </div>

        {/* Assignee */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded flex gap-3">
          <User className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignee / Operator</h5>
            <p className="text-sm font-semibold text-slate-800 mt-1">{getAssigneeName(order.assignee)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Shop Floor Specialist</p>
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
                  <th className="px-4 py-2.5">Component Name</th>
                  <th className="px-4 py-2.5 text-right">Net Qty per unit</th>
                  <th className="px-4 py-2.5 text-right">Waste %</th>
                  <th className="px-4 py-2.5 text-right">Gross Qty Required</th>
                  <th className="px-4 py-2.5 text-right">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {(bom.items || []).map((item, index) => {
                  const comp = components.find(p => p.id === item.productId);
                  const wasteFactor = 1 + (Number(item.wastePercent) || 0) / 100;
                  const totalNeeded = item.quantity * order.quantity * wasteFactor;
                  const isShortage = comp ? comp.stock < totalNeeded : false;

                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{getComponentName(item.productId)}</td>
                      <td className="px-4 py-2.5 text-right">{item.quantity} {comp?.uom || 'pcs'}</td>
                      <td className="px-4 py-2.5 text-right text-slate-500 font-medium">{item.wastePercent || 0}%</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-800">
                        {totalNeeded.toFixed(2)} {comp?.uom || 'pcs'}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${isShortage ? 'text-rose-600' : 'text-slate-800'}`}>
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
            {[...workOrders].sort((a,b) => a.operationOrder - b.operationOrder).map((wo) => (
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
