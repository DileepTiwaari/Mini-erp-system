// src/routes/AppRoutes.jsx
// AppRoutes defines the global routing table for FlowERP.
// Binds page views, layout structures, authentication screens, and permissions gates.

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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes (Dashboard Workspace) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Default Route redirecting to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
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

          <Route path="/bom" element={
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

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
