// src/routes/RoleGuard.jsx
// Role-Based Authorization Guard Component.
// Enforces granular module permissions using the permissions mapping matrix.
// Displays a user-friendly Access Denied card rather than abruptly crashing or redirecting.

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { checkPermission, ACTIONS } from '../permissions/permissions';
import { ShieldAlert } from 'lucide-react';

export const RoleGuard = ({ module, action = ACTIONS.VIEW, children }) => {
  const { user } = useAuth();
  
  const hasAccess = user && checkPermission(user.role, module, action);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-lg shadow-sm max-w-lg mx-auto mt-12 text-center">
        <div className="p-3 bg-rose-50 rounded-full text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-600 text-sm mb-6">
          Your account role ({user?.role ? user.role.toUpperCase() : 'N/A'}) does not have permission to view or manage the <span className="font-semibold">{module}</span> module.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors duration-150"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
