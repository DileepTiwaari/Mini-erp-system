// src/components/common/Loader.jsx
// Standardised loading animation for FlowERP.
// Follows strict minimalist styling to keep performance light.

import React from 'react';

export const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 ${sizeClasses[size] || sizeClasses.md}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Loader;
