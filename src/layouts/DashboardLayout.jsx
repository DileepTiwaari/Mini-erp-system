// src/layouts/DashboardLayout.jsx
// Primary workspace container for authenticated FlowERP sessions.
// Builds a responsive multi-column layout with toggleable Sidebar and fixed Top Navbar.
// Integrates smooth viewport handling for mobile users (simple slide-out drawer).

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
