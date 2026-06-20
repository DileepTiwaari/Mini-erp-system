// src/components/common/Navbar.jsx
// 
// WHAT IT DOES:
// Top Navigation Bar component for FlowERP.
// Provides hamburger toggle control for mobile viewports, prints the current route title,
// and shows user session details (username, dynamic colored role badge, and a quick logout action).
// 
// WHY IT IS REQUIRED:
// 1. Gives the user contextual feedback on which ERP module they are currently inside.
// 2. Houses the mobile menu toggle switch so that small-screen users can pull out the sidebar.
// 3. Displays active credentials and roles, verifying that authentication is successfully active.
// 
// WHEN IT IS USED:
// Rendered on every authenticated page layout (DashboardLayout) as a sticky top header.

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Menu, LogOut, User, Compass } from 'lucide-react';
import { formatRole } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';

/**
 * WHAT IT DOES: Functional component for the top header toolbar.
 * WHY IT IS REQUIRED: Acts as the primary anchor for header actions, branding title, and session widgets.
 * WHEN IT IS USED: Loaded by DashboardLayout.jsx.
 */
export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // WHAT IT DOES: Converts location path to a clean page title (e.g. `/sales-orders` to `Sales Orders`).
  // WHY IT IS REQUIRED: Dynamically sets the page header depending on active route.
  // WHEN IT IS USED: Evaluated on every route change/render cycle.
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    
    return path
      .split('-')
      .map((word) => {
        // Special case for BoM abbreviation
        if (word.toLowerCase() === 'boms') return 'Bills of Materials';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  // WHAT IT DOES: Dispatches a sign-out event and routes user back to sign-in screen.
  // WHY IT IS REQUIRED: Ends user sessions securely.
  // WHEN IT IS USED: Triggered when user clicks the logout power icon.
  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'success');
    navigate('/login');
  };

  // WHAT IT DOES: Maps active roles to colored Tailwind CSS classes.
  // WHY IT IS REQUIRED: Renders clean, high-contrast badges for visual feedback of user capabilities.
  // WHEN IT IS USED: Consulted when rendering the active role badge.
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case ROLES.OWNER:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case ROLES.SALES_USER:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case ROLES.PURCHASE_USER:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case ROLES.MANUFACTURING_USER:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case ROLES.INVENTORY_MANAGER:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 z-10">
      {/* Left side: Hamburger (mobile) and title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 md:hidden rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Module Context Name */}
        <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-600 hidden sm:inline" />
          <span>{getPageTitle()}</span>
        </h1>
      </div>

      {/* Right side: User Session Information */}
      {user && (
        <div className="flex items-center gap-4">
          {/* User Name and Dynamic Role Badge */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">{user.name}</span>
            <div className="flex justify-end mt-0.5">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide border uppercase ${getRoleBadgeClass(user.role)}`}>
                {formatRole(user.role)}
              </span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          {/* User Icon Badge */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-full text-slate-600" title={`${user.name} (${user.role})`}>
              <User className="w-4 h-4" />
            </div>
            
            {/* Quick Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
