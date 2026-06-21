/**
 * PURPOSE:
 * Renders a visual status badge detailing stock safety levels.
 *
 * BUSINESS USE:
 * Alerts operations and purchasing managers if item counts drop below safety limits,
 * triggering visual cues (Red, Yellow, Green) to prompt replenishment actions.
 *
 * API USAGE:
 * Consumes properties populated from product APIs.
 *
 * LOGIC EXPLANATION:
 * Compares current stock vs. reorder point (safety threshold) and outputs colored tags:
 * - Red (Below Reorder): Stock <= ReorderPoint
 * - Yellow (Near Reorder): ReorderPoint < Stock <= ReorderPoint * 1.5
 * - Green (Healthy): Stock > ReorderPoint * 1.5
 */

import React from 'react';

export const StockBadge = ({ stock, minStock }) => {
  const stockNum = Number(stock) || 0;
  const minNum = Number(minStock) || 0;

  if (stockNum <= minNum) {
    return (
      <span 
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200" 
        title={`Critical: ${stockNum} is below or equal to safety point ${minNum}`}
      >
        Below Reorder ({stockNum})
      </span>
    );
  }

  if (stockNum <= minNum * 1.5) {
    return (
      <span 
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" 
        title={`Near Safety Point: ${stockNum} (Safety Buffer: ${minNum})`}
      >
        Near Reorder ({stockNum})
      </span>
    );
  }

  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" 
      title={`Healthy Stock: ${stockNum} (Safety Buffer: ${minNum})`}
    >
      Healthy ({stockNum})
    </span>
  );
};

export default StockBadge;
