// src/layouts/AuthLayout.jsx
// Simple authentication layout centered for non-authenticated pages (e.g. LoginPage).
// Focused on responsive, clean design to support easy onboarding.

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

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
