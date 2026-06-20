// src/components/dashboard/LowStockWidget.jsx
// Dashboard widget showing critical low stock items list.

import React from 'react';
import { PackageX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LowStockWidget = ({ items = [] }) => {
  const lowStock = items.filter(i => i.stock <= i.minStock);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Low Stock Inventory</h3>
        <Link to="/inventory" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
          <span>Inventory</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {lowStock.length === 0 ? (
        <p className="text-slate-500 text-xs italic text-center p-4">All items fully stocked.</p>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-2">
          {lowStock.slice(0, 3).map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PackageX className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-slate-500 mt-0.5">Code: {item.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-rose-600">{item.stock} {item.uom}</p>
                <p className="text-slate-400 mt-0.5">Min: {item.minStock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockWidget;
