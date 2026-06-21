// src/components/common/PageHeader.jsx
// Standard title block layout for dashboard sub-views.
// Keeps dashboard titles, subtext labels, and core button controls aligned.
// Adds support for a glowing "Demo Data" badge for non-live microservice modules.

import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  isDemo = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-200 pb-5">
      {/* Title info */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
          {isDemo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Demo Data</span>
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>

      {/* Primary page action elements */}
      {actions && (
        <div className="flex items-center gap-3 flex-wrap no-print">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
