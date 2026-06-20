// src/components/dashboard/SummaryCard.jsx
// Visual KPI block for metrics (Valuations, Revenue, active runs).

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
    <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex items-start justify-between gap-4 ${className}`}>
      {/* Metrics details */}
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-slate-500 font-medium">
            {trend && (
              <span className={`mr-1 font-semibold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend}
              </span>
            )}
            {description}
          </p>
        )}
      </div>

      {/* Styled icon badge */}
      {Icon && (
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-brand-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
