// src/components/common/ErrorState.jsx
// Visual component to render when data fetching or system tasks fail.
// Displays a warning icon, error details, and an optional Retry button.
//
// PURPOSE:
// Provides a clean, standardized error container across all ERP modules.
//
// BUSINESS USE:
// Prevents the app from feeling broken on failure; offers the user a clear recovery action (Retry).
//
// LOGIC:
// Simple presentation component wrapping an icon, title, description, and an onRetry callback.

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Unable To Load Data',
  message = 'Something went wrong while trying to retrieve database records. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-rose-100 rounded-lg shadow-sm">
      <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 animate-bounce" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-normal">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded shadow-sm transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
