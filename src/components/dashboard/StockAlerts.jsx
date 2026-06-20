// src/components/dashboard/StockAlerts.jsx
// Displays warnings for items running out of inventory stock.

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StockAlerts = ({ items = [] }) => {
  const shortages = items.filter(i => i.stock <= i.minStock);

  if (shortages.length === 0) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6 flex items-start gap-3 no-print">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-rose-800">Critical Stock Alerts</h4>
        <p className="text-xs text-rose-700 mt-0.5 leading-normal">
          {shortages.length} {shortages.length === 1 ? 'product is' : 'products are'} below the minimum safety threshold or completely out of stock.
        </p>
      </div>
      <Link
        to="/procurement"
        className="text-xs font-bold text-rose-800 hover:text-rose-950 underline flex-shrink-0 self-center"
      >
        Reorder Now
      </Link>
    </div>
  );
};

export default StockAlerts;
