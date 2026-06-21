// src/context/ToastContext.jsx
// 
// Toast Notification Context for FlowERP.
// Provides a clean, non-obtrusive, accessible way to dispatch and display operation results 
// (success, error, warning, info) across any UI component or service hook.

import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // Track recent error messages to prevent duplicates within a short window
  const recentErrors = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    // Deduplicate error toasts — suppress if the same error message was shown within 3 seconds
    if (type === 'error') {
      const now = Date.now();
      const lastShown = recentErrors.current.get(message);
      if (lastShown && now - lastShown < 3000) {
        return; // Suppress duplicate
      }
      recentErrors.current.set(message, now);
      // Clean up old entries
      if (recentErrors.current.size > 20) {
        const cutoff = now - 5000;
        for (const [key, ts] of recentErrors.current.entries()) {
          if (ts < cutoff) recentErrors.current.delete(key);
        }
      }
    }

    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Toast icon and color lookup maps
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
