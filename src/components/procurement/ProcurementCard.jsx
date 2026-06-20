// src/components/procurement/ProcurementCard.jsx
// Visual block summary card representing a specific shortage andSuggested order action.

import React from 'react';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatQuantity } from '../../utils/formatters';

export const ProcurementCard = ({ rec, onExecute, isExecuting }) => {
  return (
    <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rec.productCode}</span>
            <h5 className="text-sm font-semibold text-slate-800 leading-snug mt-0.5">{rec.productName}</h5>
          </div>
          <span className="p-1.5 bg-rose-50 border border-rose-100 rounded text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>

        {/* Quantities */}
        <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5 font-medium text-slate-500">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Available Stock</p>
            <p className="text-sm font-semibold text-rose-600 mt-0.5">{formatQuantity(rec.currentStock, rec.uom)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Safety Buffer</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatQuantity(rec.minStock, rec.uom)}</p>
          </div>
        </div>

        {/* Suggested details */}
        <div className="text-xs space-y-1.5 font-medium">
          <p className="text-slate-600">
            <span className="text-slate-400">Suggested Supplier:</span>{' '}
            <span className="font-semibold text-brand-600">{rec.suggestedVendorName}</span>
          </p>
          <p className="text-slate-600">
            <span className="text-slate-400">Order Quantity:</span>{' '}
            <span className="font-semibold text-slate-800">{formatQuantity(rec.recommendedQty, rec.uom)}</span>
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="pt-4 border-t border-slate-100 mt-4 no-print">
        <button
          onClick={() => onExecute(rec)}
          disabled={isExecuting}
          className="w-full inline-flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 border border-transparent rounded shadow-sm transition-colors duration-150"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isExecuting ? 'Triggering...' : 'Create Draft PO'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProcurementCard;
