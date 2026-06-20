// src/components/products/StockBadge.jsx
// 
// WHAT IT DOES:
// Renders a styled badge indicating the status of inventory stock relative to safety reorder thresholds.
// Output colors: Red (Below Reorder), Yellow (Near Reorder), Green (Healthy Stock).
// 
// WHY IT IS REQUIRED:
// 1. Gives inventory controllers and warehouse users immediate visual warnings about stock levels.
// 2. Encapsulates business logic rules mapping quantities to status colors in a single component.
// 
// WHEN IT IS USED:
// Invoked when rendering product detail screens and inventory data grid tables.

import React from 'react';

/**
 * WHAT IT DOES: Component presenting inventory level badges.
 * WHY IT IS REQUIRED: Dynamically calculates color classes depending on safety margins.
 * WHEN IT IS USED: Loaded inside ProductList.jsx and ProductDetail.jsx.
 * 
 * @param {number} stock - Active stock quantity on hand.
 * @param {number} minStock - Safety safety reorder threshold.
 */
export const StockBadge = ({ stock, minStock }) => {
  const stockNum = Number(stock) || 0;
  const minNum = Number(minStock) || 0;

  // WHAT: Business logic determining stock safety.
  // WHY: Standardizes safety calculations:
  // - Red: below safety margin, urgent replenishment needed.
  // - Yellow: close to safety margin, reorder suggested.
  // - Green: healthy buffer.
  // WHEN: Evaluated during catalog and detail rendering.
  if (stockNum <= minNum) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200" title={`Critical: ${stockNum} is below safety point ${minNum}`}>
        Below Reorder ({stockNum})
      </span>
    );
  }

  if (stockNum <= minNum * 1.5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" title={`Near Safety Point: ${stockNum} (Safety: ${minNum})`}>
        Near Reorder ({stockNum})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" title={`Healthy: ${stockNum} (Safety: ${minNum})`}>
      Healthy ({stockNum})
    </span>
  );
};

export default StockBadge;
