// src/routes/ProtectedRoute.jsx
// Protected Route Component for FlowERP.
// Ensures that only authenticated users with valid sessions can load dashboard views.
// Redirects guests to the LoginPage.

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If AuthContext is still parsing token from localStorage, display loader
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect to login, storing the attempted destination in location.state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render nested child routes
  return <Outlet />;
};

export default ProtectedRoute;
