// src/context/ToastContext.jsx
// 
// WHAT IT DOES:
// Toast Notification Context for FlowERP.
// Provides a clean, non-obtrusive, accessible way to dispatch and display operation results 
// (success, error, warning, info) across any UI component or service hook.
// 
// WHY IT IS REQUIRED:
// 1. Gives the user instant feedback on their actions (e.g. "Product Saved", "Access Denied").
// 2. Avoids using generic browser alerts which disrupt the user experience.
// 3. Centralizes layout styles for notifications (colors, icons, durations) so styling changes propagate instantly.
// 
// WHEN IT IS USED:
// Rendered as the root provider block around the app layout, and invoked whenever components or services
// call `showToast()`.

import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

// WHAT IT DOES: React Context object holding toast dispatch methods.
// WHY IT IS REQUIRED: Allows child widgets to call showToast without passing callback properties manually.
// WHEN IT IS USED: Accessed via the useToast consumer hook.
const ToastContext = createContext(null);

/**
 * WHAT IT DOES: Provider component that holds toast list states and floats them on screen.
 * WHY IT IS REQUIRED: Manages timeouts for self-destructing toast items and coordinates transition colors.
 * WHEN IT IS USED: Wrapped around the root application tree in `App.jsx`.
 */
export const ToastProvider = ({ children }) => {
  // WHAT IT DOES: State list containing active toast objects (id, message, type).
  // WHY IT IS REQUIRED: Feeds the DOM loop that displays active alerts on the bottom right.
  // WHEN IT IS USED: Modified when calling showToast (adds item) and when timeout completes (removes item).
  const [toasts, setToasts] = useState([]);

  // WHAT IT DOES: Removes an active toast object from state list by ID.
  // WHY IT IS REQUIRED: Clears alerts when users dismiss them or when their timer expires.
  // WHEN IT IS USED: Triggered by user close action or by automatic timeouts.
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // WHAT IT DOES: Appends a toast to list state, schedule auto-destruction.
  // WHY IT IS REQUIRED: Exposes a single method to create info, success, warning, or error alerts.
  // WHEN IT IS USED: Triggered whenever components request a notification.
  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // WHAT IT DOES: Attaches global event listener for API error dispatches.
  // WHY IT IS REQUIRED: Allows Axios interceptors to alert users of backend failures even if components didn't catch the error.
  // WHEN IT IS USED: Active for the lifetime of the ToastProvider component.
  React.useEffect(() => {
    const handleApiError = (e) => {
      showToast(e.detail?.message || 'Error occurred', 'error');
    };
    window.addEventListener('api-error', handleApiError);
    return () => {
      window.removeEventListener('api-error', handleApiError);
    };
  }, [showToast]);

  // WHAT IT DOES: Lookup map of lucide icons per alert severity type.
  // WHY IT IS REQUIRED: Provides visual cues for faster user comprehension.
  // WHEN IT IS USED: Read when rendering individual toast elements.
  const toastIcons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
  };

  // WHAT IT DOES: Lookup map of Tailwind styles per severity level.
  // WHY IT IS REQUIRED: Applies curated Zoho/Odoo soft color aesthetics.
  // WHEN IT IS USED: Read when building css class list strings on render.
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

/**
 * WHAT IT DOES: Custom consumer hook to fetch the toast context methods.
 * WHY IT IS REQUIRED: Simplifies component imports so they don't have to import React, useContext, and ToastContext separately.
 * WHEN IT IS USED: Imported by forms and pages that need to show notifications.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
