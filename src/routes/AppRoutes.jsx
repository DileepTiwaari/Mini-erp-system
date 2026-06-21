// src/routes/AppRoutes.jsx
// 
// WHAT IT DOES:
// AppRoutes defines the global routing table for FlowERP, mapping path routes 
// (like `/login`, `/dashboard`, or `/boms`) to specific page views and layouts.
// It wraps protected routes with security layers (`ProtectedRoute` and `RoleGuard`)
// to ensure only authenticated users with correct permissions can view them.
// 
// WHY IT IS REQUIRED:
// 1. Manages page-level navigation and URL states in the single-page application.
// 2. Implements role-based access gates at the routing layer so that unauthorized users cannot navigate to restricted modules.
// 3. Organizes public vs. protected screen templates (Layouts) in a clean, declarative structure.
// 
// WHEN IT IS USED:
// Triggered on application boot (inside `main.jsx` and `App.jsx`) and whenever the URL changes or
// a user clicks on a navigation link.

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import { MODULES } from '../permissions/permissions';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import ProductsPage from '../pages/ProductsPage';
import SalesOrdersPage from '../pages/SalesOrdersPage';
import PurchaseOrdersPage from '../pages/PurchaseOrdersPage';
import VendorsPage from '../pages/VendorsPage';
import BomPage from '../pages/BomPage';
import ManufacturingOrdersPage from '../pages/ManufacturingOrdersPage';
import InventoryPage from '../pages/InventoryPage';
import ProcurementPage from '../pages/ProcurementPage';
import AuditLogsPage from '../pages/AuditLogsPage';
import ReportsPage from '../pages/ReportsPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * WHAT IT DOES:
 * AppRoutes is the primary functional component that defines all application endpoints using react-router-dom.
 * 
 * WHY IT IS REQUIRED:
 * Coordinates route parsing, layout nesting, and security guards in one central location.
 * 
 * WHEN IT IS USED:
 * Rendered by the main App shell to render components depending on the current browser URL.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* 
        WHAT IT DOES: Public route block nested inside the AuthLayout frame.
        WHY IT IS REQUIRED: Renders the credentials form inside the sign-in visual frame.
        WHEN IT IS USED: When accessing '/login' or when an unauthenticated user is redirected.
      */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 
        WHAT IT DOES: Protected route block guarded by ProtectedRoute and wrapped in DashboardLayout.
        WHY IT IS REQUIRED: Ensures only logged-in users access internal workspaces, surrounded by Navbar and Sidebar.
        WHEN IT IS USED: Active for all internal dashboard activities when a valid session token is found.
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Default Route redirecting to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 
            WHAT IT DOES: Individual module routes, each wrapped in a RoleGuard matching its business module.
            WHY IT IS REQUIRED: Checks if the logged-in user's role has permission to access that specific sub-system.
            WHEN IT IS USED: Evaluated when the user clicks the corresponding nav link or enters the URL directly.
          */}
          <Route path="/dashboard" element={
            <RoleGuard module={MODULES.DASHBOARD}>
              <DashboardPage />
            </RoleGuard>
          } />
          
          <Route path="/users" element={
            <RoleGuard module={MODULES.USERS}>
              <UsersPage />
            </RoleGuard>
          } />

          <Route path="/products" element={
            <RoleGuard module={MODULES.PRODUCTS}>
              <ProductsPage />
            </RoleGuard>
          } />

          <Route path="/sales-orders" element={
            <RoleGuard module={MODULES.SALES}>
              <SalesOrdersPage />
            </RoleGuard>
          } />

          <Route path="/purchase-orders" element={
            <RoleGuard module={MODULES.PURCHASE}>
              <PurchaseOrdersPage />
            </RoleGuard>
          } />

          <Route path="/vendors" element={
            <RoleGuard module={MODULES.PURCHASE}>
              <VendorsPage />
            </RoleGuard>
          } />

          {/* Updated from /bom to /boms for consistent pluralization */}
          <Route path="/boms" element={
            <RoleGuard module={MODULES.MANUFACTURING}>
              <BomPage />
            </RoleGuard>
          } />

          <Route path="/manufacturing-orders" element={
            <RoleGuard module={MODULES.MANUFACTURING}>
              <ManufacturingOrdersPage />
            </RoleGuard>
          } />

          <Route path="/inventory" element={
            <RoleGuard module={MODULES.INVENTORY}>
              <InventoryPage />
            </RoleGuard>
          } />

          <Route path="/procurement" element={
            <RoleGuard module={MODULES.PROCUREMENT}>
              <ProcurementPage />
            </RoleGuard>
          } />

          <Route path="/audit-logs" element={
            <RoleGuard module={MODULES.AUDIT}>
              <AuditLogsPage />
            </RoleGuard>
          } />

          <Route path="/reports" element={
            <RoleGuard module={MODULES.REPORTS}>
              <ReportsPage />
            </RoleGuard>
          } />
        </Route>
      </Route>

      {/* 
        WHAT IT DOES: Catch-all route to capture non-existent paths and render a clean NotFound page.
        WHY IT IS REQUIRED: Prevents browser errors or blank pages on typing mistakes.
        WHEN IT IS USED: When the user navigates to an undefined path.
      */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
