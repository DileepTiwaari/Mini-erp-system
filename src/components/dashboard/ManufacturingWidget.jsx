// src/components/dashboard/ManufacturingWidget.jsx
// Dashboard widget rendering active production floor summaries.

import React from 'react';
import { Hammer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

export const ManufacturingWidget = ({ orders = [] }) => {
  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'planned');

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Active Shop Floor Runs</h3>
        <Link to="/manufacturing-orders" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
          <span>Production</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {activeOrders.length === 0 ? (
        <p className="text-slate-500 text-xs italic text-center p-4">No active manufacturing runs.</p>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-2">
          {activeOrders.slice(0, 3).map((mo) => (
            <div key={mo.id} className="p-3 bg-slate-50 border border-slate-100 rounded text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">{mo.moNumber}</p>
                  <p className="text-slate-500 mt-0.5">Quantity: {mo.quantity} pcs</p>
                </div>
              </div>
              <StatusBadge status={mo.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManufacturingWidget;
