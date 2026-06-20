// src/components/common/Sidebar.jsx
// Sidebar Navigation Component for FlowERP.
// Reads routing tables and permission matrices to construct role-filtered links.
// Highlights active routes, supports simple mobile sidebar toggling (drawers).

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { checkPermission } from '../../permissions/permissions';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  FileSpreadsheet, 
  Truck, 
  Settings, 
  Wrench, 
  Warehouse, 
  AlertCircle, 
  FileText, 
  History,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();

  // Navigation Items with module dependencies
  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { label: 'Users & Roles', path: '/users', icon: Users, module: 'users' },
    { label: 'Products', path: '/products', icon: Package, module: 'products' },
    { label: 'Sales Orders', path: '/sales-orders', icon: ShoppingCart, module: 'sales' },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: FileSpreadsheet, module: 'purchase' },
    { label: 'Vendors', path: '/vendors', icon: Truck, module: 'purchase' },
    { label: 'Bill of Materials', path: '/bom', icon: Settings, module: 'manufacturing' },
    { label: 'Mfg Orders', path: '/manufacturing-orders', icon: Wrench, module: 'manufacturing' },
    { label: 'Inventory Stock', path: '/inventory', icon: Warehouse, module: 'inventory' },
    { label: 'Procurement', path: '/procurement', icon: AlertCircle, module: 'procurement' },
    { label: 'Audit Logs', path: '/audit-logs', icon: History, module: 'audit' },
    { label: 'Reports', path: '/reports', icon: FileText, module: 'reports' },
  ];

  // Filter items based on active user permission matrix
  const allowedItems = navigationItems.filter(item => 
    user && checkPermission(user.role, item.module)
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand logo header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
          <div className="h-8 w-8 bg-brand-500 rounded flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlowERP</span>
        </Link>
        {/* Close Button on Mobile Drawer */}
        <button
          onClick={closeSidebar}
          className="p-1 -mr-1 hover:bg-slate-800 rounded md:hidden text-slate-400 hover:text-slate-200"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer detailing active user role */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center font-medium">
        FlowERP Frontend v1.0.0
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay Backdrop for Mobile Viewport */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Responsive drawer sidebar for Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-full flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
