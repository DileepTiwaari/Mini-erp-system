// src/layouts/DashboardLayout.jsx
// 
// WHAT IT DOES:
// Primary workspace container for authenticated FlowERP sessions.
// Builds a responsive multi-column layout with a toggleable Sidebar and fixed Top Navbar.
// Integrates smooth viewport handling for mobile users (simple slide-out drawer).
// 
// WHY IT IS REQUIRED:
// 1. Groups authenticated pages inside a unified shell structure.
// 2. Holds top search, profile, and navigation controls across page transactions.
// 3. Implements responsive viewport drawers so the ERP fits cleanly on tablets and mobile screens.
// 
// WHEN IT IS USED:
// Loaded automatically by the router for any protected path (e.g. `/dashboard`, `/products`, `/boms`).

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

/**
 * WHAT IT DOES: Layout component wrapper for dashboard panel screens.
 * WHY IT IS REQUIRED: Combines sidebar, navbar, and nested routes into a structured grid.
 * WHEN IT IS USED: Renders on accessing any internal page routes.
 */
export const DashboardLayout = () => {
  // WHAT IT DOES: Tracks state of sidebar drawer on mobile viewports.
  // WHY IT IS REQUIRED: Open/close commands toggle display of sidebar dynamically.
  // WHEN IT IS USED: Interacted with when hitting hamburger button or overlay backdrop.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // WHAT IT DOES: Toggles sidebar state variable.
  // WHY IT IS REQUIRED: Lets user toggle layout expansion.
  // WHEN IT IS USED: Triggered by navbar menu triggers.
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // WHAT IT DOES: Closes sidebar state variable.
  // WHY IT IS REQUIRED: Collapses mobile drawer when navigating or clicking backdrop.
  // WHEN IT IS USED: Triggered when overlay backdrop clicked or route changes.
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar for Navigation (Slides out on mobile, persistent on desktop) */}
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {/* Main content layout viewport */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content Workspace Scrollport */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 sm:p-6 md:p-8">
          {/* Outlet resolves the nested route content */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
