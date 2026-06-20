/**
 * PURPOSE:
 * Displays actionable procurement replenishment suggestions for items below safety stock.
 *
 * WHY:
 * Suggests standard actions (e.g. creating Purchase Orders for purchased materials or
 * Manufacturing Orders for sub-assemblies) based on active shortages to automate material planning.
 *
 * API:
 * GET /api/v1/dashboard/stock-alerts
 *
 * LOGIC USED:
 * Iterates through items below safety margins (`stock < minStock`), computes the shortage amount,
 * and checks the item's `procurementType` ('PURCHASE' vs 'MANUFACTURING') to suggest the
 * appropriate document action.
 */

import React from 'react';

export const ProcurementWidget = ({ items = [] }) => {
  // Identify items that need procurement replenishment
  const suggestions = items
    .filter((p) => p.stock < p.minStock)
    .map((p) => {
      const shortage = p.minStock - p.stock;
      const recommendation = p.procurementType === 'MANUFACTURING' 
        ? 'Create Manufacturing Order' 
        : 'Create Purchase Order';
      
      return {
        id: p.id,
        name: p.name,
        code: p.code,
        shortage,
        uom: p.uom || 'pcs',
        recommendation,
        type: p.procurementType,
      };
    })
    .slice(0, 4);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Procurement Recommendations
      </h3>

      {suggestions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-slate-400 text-xs italic text-center">No pending replenishment recommendations.</p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">
          {suggestions.map((s, idx) => (
            <div 
              key={s.id} 
              className={`pt-3 text-xs flex flex-col gap-1 ${idx === 0 ? 'pt-0 border-t-0' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-slate-800">{s.name}</span>
                <span className="font-mono text-[10px] text-slate-400">{s.code}</span>
              </div>
              
              <div className="flex justify-between items-center text-slate-500 mt-0.5">
                <span>Shortage: <strong className="text-rose-600 font-bold">{s.shortage} {s.uom}</strong></span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                  s.type === 'MANUFACTURING'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {s.recommendation}
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
