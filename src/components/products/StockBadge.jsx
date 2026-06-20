// src/components/products/StockBadge.jsx
// Pill indicator reflecting safety stock boundaries.

import React from 'react';

export const StockBadge = ({ stock, minStock }) => {
  const stockNum = Number(stock) || 0;
  const minNum = Number(minStock) || 0;

  if (stockNum === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        Out of Stock
      </span>
    );
  }

  if (stockNum <= minNum) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      In Stock
    </span>
  );
};

export default StockBadge;
