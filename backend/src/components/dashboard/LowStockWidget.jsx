/**
 * PURPOSE:
 * Displays the top 5 critical inventory items sorted by shortage magnitude.
 *
 * WHY:
 * Enables purchasing departments to prioritize which materials require immediate reordering
 * depending on how far below safety stocks they have fallen.
 *
 * API:
 * GET /api/v1/dashboard/stock-alerts
 *
 * LOGIC USED:
 * Iterates through items, filters for items where `stock < minStock`, calculates the
 * shortage delta (`minStock - stock`), sorts descending by this delta, and limits to the top 5.
 */

import React from 'react';

export const LowStockWidget = ({ items = [] }) => {
  // Filter and calculate shortages, then sort by largest shortage descending
  const criticalShortages = items
    .filter((p) => p.stock < p.minStock)
    .map((p) => ({
      ...p,
      shortageDelta: p.minStock - p.stock,
    }))
    .sort((a, b) => b.shortageDelta - a.shortageDelta)
    .slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Top 5 Critical Shortages
      </h3>
      
      {criticalShortages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-slate-400 text-xs italic text-center">No critical stock shortages registered.</p>
        </div>
      ) : (
        <div className="space-y-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72">
          {criticalShortages.map((item, idx) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between text-xs pt-3 ${idx === 0 ? 'pt-0 border-t-0' : ''}`}
            >
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.code}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="inline-block px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded text-[10px]">
                  -{item.shortageDelta} {item.uom || 'pcs'}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Stock: {item.stock} / Min: {item.minStock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockWidget;
