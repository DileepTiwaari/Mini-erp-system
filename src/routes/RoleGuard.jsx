// src/routes/RoleGuard.jsx
// 
// WHAT IT DOES:
// Evaluates the current user's security role against a target module's permission definitions.
// If the user has permission to perform the requested action (e.g. view, create), it renders 
// the protected page component contents. Otherwise, it displays a friendly "Access Denied" error panel.
// 
// WHY IT IS REQUIRED:
// 1. Prevents unauthorized roles from reading or interacting with restricted views (e.g., stopping 
//    a Sales representative from viewing manufacturing operations or admin audit logs).
// 2. Improves security compliance by blocking access at the router gateway rather than solely in components.
// 3. Offers a clean, non-intimidating way for non-technical users to understand their account scope limitations.
// 
// WHEN IT IS USED:
// Invoked on every page navigation transition targeting a protected route module defined in roleRoutes.

import React from 'react';
import useAuth from '../hooks/useAuth';
import { checkPermission, ACTIONS } from '../permissions/permissions';
import { ShieldAlert } from 'lucide-react';

/**
 * WHAT IT DOES: RoleGuard component enforcing module access permissions.
 * WHY IT IS REQUIRED: Renders unauthorized layouts or valid child nodes based on permissions checks.
 * WHEN IT IS USED: In AppRoutes.jsx to wrap each path entry.
 * 
 * @param {string} module - The module identifier (from MODULES constant)
 * @param {string} action - The permission action (default: ACTIONS.VIEW)
 * @param {JSX.Element} children - Renderable component if authorized
 * @returns {JSX.Element} Unauthorized view or the child elements
 */
export const RoleGuard = ({ module, action = ACTIONS.VIEW, children }) => {
  // Retrieve the logged-in user profile from context
  const { user } = useAuth();
  
  // Evaluate permission flags based on matrix
  const hasAccess = user && checkPermission(user.role, module, action);

  // Block unauthorized role transitions
  // WHAT: Renders a clean "Access Denied" notification container with a "Go Back" button.
  // WHY: Explains the access block clearly to users without crashing the dashboard environment.
  // WHEN: The permissions check fails (hasAccess === false)
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-lg shadow-sm max-w-lg mx-auto mt-12 text-center">
        {/* Shield Icon warning indicator */}
        <div className="p-3 bg-rose-50 rounded-full text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        {/* Error message */}
        <h2 className="text-xl font-bold text-slate-800 mb-2 font-sans">Access Denied</h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Your account role (<span className="font-bold text-slate-700">{user?.role ? user.role.toUpperCase().replace('_', ' ') : 'GUEST'}</span>) 
          does not have permission to view or manage the <span className="font-semibold text-brand-700">{module}</span> module.
        </p>
        
        {/* Navigation fallback action */}
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Grant access
  // WHAT: Returns child component tree
  // WHY: Renders page workspace details for authorized roles
  // WHEN: Permissions check passes (hasAccess === true)
  return children;
};

export default RoleGuard;
