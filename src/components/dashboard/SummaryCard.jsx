// src/components/dashboard/SummaryCard.jsx
// 
// WHAT IT DOES:
// Renders a reusable KPI summary block displaying key business figures,
// trend indicators (+/- percentages), semantic labels, and matching icons.
// 
// WHY IT IS REQUIRED:
// 1. Avoids repeating card structural layouts across metrics screens.
// 2. Standardizes visual styling (spacing, hover shadows, text colors) for dashboard items.
// 3. Supports arbitrary layout expansions (e.g. status details or extra text labels) for future metrics.
// 
// WHEN IT IS USED:
// Rendered at the top of the main Dashboard workspace and other listing headers.

import React from 'react';

/**
 * WHAT IT DOES: Component displaying summary details of a single KPI metrics item.
 * WHY IT IS REQUIRED: Renders clean spacing and indicators per prop values.
 * WHEN IT IS USED: Loaded inside DashboardPage.jsx.
 * 
 * Props definitions:
 * @param {string} title - The uppercase label describing the metric (e.g. 'TOTAL PRODUCTS').
 * @param {string|number} value - The formatted text value (e.g. '$1,200.00' or '10').
 * @param {React.Component} icon - Lucide-react component reference for visual reinforcement.
 * @param {string} trend - Optional trend indicator, highlights red if starting with '-' or green if '+'.
 * @param {string} description - Optional help text underneath the card.
 * @param {string} className - Additional CSS styles override hooks.
 */
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
              <span className={`px-1 rounded font-bold ${
                trend.startsWith('+') 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : trend.startsWith('-')
                    ? 'text-rose-750 bg-rose-50'
                    : 'text-indigo-750 bg-indigo-50'
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
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-brand-600 flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
