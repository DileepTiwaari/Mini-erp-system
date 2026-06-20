// src/context/ToastContext.jsx
// Toast Notification Context for FlowERP.
// Provides a clean, non-obtrusive, accessible way to show operation results (success, error, warning).
// Integrates nicely with standard Tailwind styling.

import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Adds a toast notification. Auto-removes after 4 seconds.
  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Listen to decoupled api-error events from axiosInstance
  React.useEffect(() => {
    const handleApiError = (e) => {
      showToast(e.detail?.message || 'Error occurred', 'error');
    };
    window.addEventListener('api-error', handleApiError);
    return () => {
      window.removeEventListener('api-error', handleApiError);
    };
  }, [showToast]);

  const toastIcons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
  };

  const toastBgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container floating on screen */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-sm transition-all duration-300 ${
              toastBgColors[toast.type] || toastBgColors.info
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toastIcons[toast.type] || toastIcons.info}
            </div>
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
