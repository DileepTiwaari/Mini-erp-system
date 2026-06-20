// src/components/common/Navbar.jsx
// Top Navigation Bar component for FlowERP.
// Provides hamburger control on mobile viewport, prints current route contextual metadata,
// and shows user profile options with a simple layout design.

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Menu, LogOut, User, Compass } from 'lucide-react';
import { formatRole } from '../../utils/formatters';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Convert pathname "/sales-orders" to "Sales Orders" for breadcrumb
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">{user.name}</span>
            <span className="text-xs text-slate-500 font-medium">{formatRole(user.role)}</span>
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
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
