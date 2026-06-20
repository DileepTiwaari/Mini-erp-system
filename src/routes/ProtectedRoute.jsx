// src/routes/ProtectedRoute.jsx
// 
// WHAT IT DOES:
// Evaluates the current authentication state of the user. If the user is authenticated 
// (token is present), it allows the browser to render the nested child route components.
// Otherwise, it redirects the browser to the `/login` page and caches the attempted path location.
// 
// WHY IT IS REQUIRED:
// 1. Enforces private route boundaries: blocks guest users from reaching private workspace grids.
// 2. Improves user experience by showing a clean loader while restoring credentials from storage.
// 3. Remembers redirect contexts, letting users return to their attempted page automatically post-login.
// 
// WHEN IT IS USED:
// Triggered on every page load or navigation path change targeting dashboard pages.

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

/**
 * WHAT IT DOES: Functional component checking credentials validation status.
 * WHY IT IS REQUIRED: Acts as the primary router outlet protector.
 * WHEN IT IS USED: Wrapped around all workspace routes in AppRoutes.jsx.
 * 
 * @returns {JSX.Element} Either the loading spinner, Navigate redirect, or Outlet viewport
 */
export const ProtectedRoute = () => {
  // Fetch authentication variables from context hook
  const { isAuthenticated, loading } = useAuth();
  
  // Track the current location path context
  const location = useLocation();

  // If AuthContext is still parsing token from localStorage, display loader
  // WHAT: Renders a fullscreen spinner
  // WHY: Avoids flickering guest views while verifying token signatures on fresh loads
  // WHEN: AuthContext is reading local storage variables (loading === true)
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect to login if user session is absent
  // WHAT: Performs a route redirect to "/login"
  // WHY: Blocks guest users from private workspace screens
  // WHEN: user is not authenticated (isAuthenticated === false)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render nested child routes
  // WHAT: Renders child outlet structures
  // WHY: Grants layout viewport accesses to private workspace segments
  // WHEN: user session is valid (isAuthenticated === true)
  return <Outlet />;
};

export default ProtectedRoute;
