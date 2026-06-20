// src/components/procurement/ProcurementCard.jsx
// Visual block summary card representing a specific shortage and Suggested order action.
// Purpose: Renders procurement suggestion summary block.
// Business Use: Informs operators of specific items in low stock or ordered, with quick create triggers.
// API Usage: Executes replenishment requests via parent callbacks.

import React from 'react';
import { ShoppingCart, Hammer, AlertTriangle } from 'lucide-react';
import { formatQuantity, formatCurrency } from '../../utils/formatters';

export const ProcurementCard = ({ rec, onExecute, isExecuting }) => {
  const isMfg = rec.procurementType === 'MANUFACTURING';

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rec.productCode}</span>
            <h5 className="text-sm font-semibold text-slate-800 leading-snug mt-0.5">{rec.productName}</h5>
          </div>
          <span className={`p-1.5 border rounded ${
            isMfg 
              ? 'bg-purple-50 border-purple-100 text-purple-600' 
              : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            {isMfg ? <Hammer className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </span>
        </div>

        {/* Quantities */}
        <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5 font-medium text-slate-500">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Available Stock</p>
            <p className="text-sm font-semibold text-rose-600 mt-0.5">{formatQuantity(rec.currentStock, rec.uom)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Reorder limit</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatQuantity(rec.minStock, rec.uom)}</p>
          </div>
        </div>

        {/* Suggested details */}
        <div className="text-xs space-y-1.5 font-medium">
          <p className="text-slate-600">
            <span className="text-slate-400">Source:</span>{' '}
            <span className={`font-semibold ${isMfg ? 'text-purple-600' : 'text-brand-600'}`}>
              {isMfg ? 'Internal Assembly (BoM)' : (rec.suggestedVendorName || 'Apex Metal Corp')}
            </span>
          </p>
          <p className="text-slate-600">
            <span className="text-slate-400">Order Quantity:</span>{' '}
            <span className="font-semibold text-slate-800">{formatQuantity(rec.recommendedQty, rec.uom)}</span>
          </p>
          {rec.estimatedCost !== undefined && (
            <p className="text-slate-600">
              <span className="text-slate-400">Est. Cost:</span>{' '}
              <span className="font-semibold text-slate-800">{formatCurrency(rec.estimatedCost)}</span>
            </p>
          )}
          <p className="text-slate-500 italic mt-2 text-[11px]">
            {rec.reason}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="pt-4 border-t border-slate-100 mt-4 no-print">
        <button
          onClick={() => onExecute(rec)}
          disabled={isExecuting}
          className={`w-full inline-flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 border border-transparent rounded shadow-sm transition-colors duration-150 ${
            isMfg 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {isMfg ? (
            <>
              <Hammer className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Scheduling...' : 'Schedule Mfg Order'}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Triggering...' : 'Create Draft PO'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProcurementCard;
