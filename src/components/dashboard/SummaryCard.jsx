/**
 * PURPOSE:
 * Renders a reusable key performance indicator (KPI) metric card block.
 *
 * WHY:
 * Allows multiple different business metrics (such as sales orders counts, purchase order counts,
 * and low stock item alerts) to be displayed in a consistent Odoo/Zoho layout.
 *
 * API:
 * Used to present fields returned from GET /api/v1/dashboard.
 *
 * LOGIC USED:
 * Takes title, value, icon, and description props and renders them inside a flex container.
 * Supports status indicator highlights via conditional className bindings.
 */

import React from 'react';

export const SummaryCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex items-start justify-between gap-4 transition-all duration-200 hover:shadow-md ${className}`}>
      {/* KPI numeric values and labels */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          {title}
        </span>
        <div className="text-2xl font-bold text-slate-800 tracking-tight">
          {value}
        </div>
        
        {/* Trend percentage and auxiliary descriptions */}
        {(trend || description) && (
          <p className="text-xs text-slate-500 font-semibold flex items-center flex-wrap gap-1 mt-1">
            {trend && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                trend.startsWith('+') 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : trend.startsWith('-')
                    ? 'text-rose-700 bg-rose-50'
                    : 'text-blue-700 bg-blue-50'
              }`}>
                {trend}
              </span>
            )}
            {description && <span className="text-slate-400 font-medium">{description}</span>}
          </p>
        )}
      </div>

      {/* Metric Visual Icon */}
      {Icon && (
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-blue-600 flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
