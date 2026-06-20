// src/components/common/PageHeader.jsx
// Standard title block layout for dashboard sub-views.
// Keeps dashboard titles, subtext labels, and core button controls aligned.

import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-200 pb-5">
      {/* Title info */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
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
