// src/components/common/Sidebar.jsx
// 
// WHAT IT DOES:
// Sidebar Navigation Component for FlowERP.
// Reads routing tables and permission matrices to construct role-filtered links.
// Groups navigation elements into commercial sections (Sales, Purchases, Manufacturing)
// and hides categories/links dynamically if the user's role lacks permissions.
// 
// WHY IT IS REQUIRED:
// 1. Provides a clean, hierarchical sidebar index matching ERP standards like Odoo and Zoho.
// 2. Protects user workflow clarity by only displaying modules that the user can actually access.
// 3. Handles mobile viewport sliding transition drawers seamlessly.
// 
// WHEN IT IS USED:
// Rendered persistently on the left side of the screen on desktop displays, and as a toggleable 
// overlay drawer on tablet/mobile views.

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

/**
 * WHAT IT DOES: Renders the ERP navigation sidebar panel.
 * WHY IT IS REQUIRED: Feeds the UI layout with structured links and authorization checks.
 * WHEN IT IS USED: Rendered inside DashboardLayout.jsx.
 */
export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();

  // WHAT IT DOES: Defines structured categories and items.
  // WHY IT IS REQUIRED: Organizes menu nodes in groups for simplified user navigation.
  // WHEN IT IS USED: Parsed on render to perform permission filtering.
  const navigationSections = [
    {
      title: 'Workspace',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
        { label: 'Products', path: '/products', icon: Package, module: 'products' },
      ]
    },
    {
      title: 'Sales & Commercial',
      items: [
        { label: 'Sales Orders', path: '/sales-orders', icon: ShoppingCart, module: 'sales' },
      ]
    },
    {
      title: 'Purchases & Vendors',
      items: [
        { label: 'Purchase Orders', path: '/purchase-orders', icon: FileSpreadsheet, module: 'purchase' },
        { label: 'Vendors', path: '/vendors', icon: Truck, module: 'purchase' },
      ]
    },
    {
      title: 'Manufacturing',
      items: [
        { label: 'Bill of Materials', path: '/boms', icon: Settings, module: 'manufacturing' },
        { label: 'Mfg Orders', path: '/manufacturing-orders', icon: Wrench, module: 'manufacturing' },
      ]
    },
    {
      title: 'Inventory & Operations',
      items: [
        { label: 'Inventory Stock', path: '/inventory', icon: Warehouse, module: 'inventory' },
        { label: 'Procurement', path: '/procurement', icon: AlertCircle, module: 'procurement' },
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'Users & Roles', path: '/users', icon: Users, module: 'users' },
        { label: 'Audit Logs', path: '/audit-logs', icon: History, module: 'audit' },
        { label: 'Reports', path: '/reports', icon: FileText, module: 'reports' },
      ]
    }
  ];

  // WHAT IT DOES: Filters categories and items based on permissions.
  // WHY IT IS REQUIRED: Removes empty groups and links that are unauthorized for the current user.
  // WHEN IT IS USED: Computed instantly during the rendering phase of the sidebar.
  const allowedSections = navigationSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => user && checkPermission(user.role, item.module))
    }))
    .filter(section => section.items.length > 0);

  // WHAT IT DOES: Constructs the inner sidebar JSX.
  // WHY IT IS REQUIRED: Shared between desktop view and mobile drawer nodes.
  // WHEN IT IS USED: Rendered inline by the main sidebar element.
  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand logo header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
          <div className="h-8 w-8 bg-brand-600 rounded flex items-center justify-center text-white font-bold text-lg">
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
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {allowedSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {/* Category Section Header */}
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </h3>
            
            {/* Category Links */}
            <div className="space-y-1">
              {section.items.map((item) => {
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
            </div>
          </div>
        ))}
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
