// src/layouts/AuthLayout.jsx
// 
// WHAT IT DOES:
// Renders the layout frame for non-authenticated pages (e.g. LoginPage).
// Centered layout block designed to hold onboarding forms.
// 
// WHY IT IS REQUIRED:
// 1. Groups public auth workflows in a consistent, styled layout viewport wrapper.
// 2. Automates bypass checks: if the user is already authenticated, they are automatically forwarded to `/dashboard` directly.
// 
// WHEN IT IS USED:
// Triggered when entering `/login` route, checking session token first.

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * WHAT IT DOES: Layout component wrapper for auth endpoints.
 * WHY IT IS REQUIRED: Implements automatic redirect and structural wrapper style logic.
 * WHEN IT IS USED: Rendered for the `/login` route endpoints.
 */
export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // If already logged in, skip the auth layout and redirect straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
