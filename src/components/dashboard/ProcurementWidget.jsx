// src/components/dashboard/ProcurementWidget.jsx
// Sidebar widget displaying high-priority reorder suggestions.

import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProcurementWidget = ({ suggestions = [] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Replenishment Hints</h3>
        <Link to="/procurement" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
          <span>Manage</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-slate-500 text-xs italic text-center p-4">All stocks are above safety buffers.</p>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-2">
          {suggestions.slice(0, 3).map((s) => (
            <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded text-xs flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-800">{s.productName}</p>
                <p className="text-slate-500 mt-0.5">Vendor: {s.suggestedVendorName}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Reorder {s.recommendedQty} {s.uom}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcurementWidget;
