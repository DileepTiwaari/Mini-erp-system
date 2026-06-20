// src/components/common/Loader.jsx
// Standardised loading animation for FlowERP.
// Follows strict minimalist styling to keep performance light.

import React from 'react';

export const Loader = ({ size = 'md', label = '', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 ${sizeClasses[size] || sizeClasses.md}`}
        role="status"
        aria-label="loading"
      />
      {label && (
        <span className="text-sm font-semibold text-slate-500 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;
