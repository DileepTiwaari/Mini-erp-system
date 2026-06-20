// src/context/AuthContext.jsx
// 
// WHAT IT DOES:
// Manages the global state of the logged-in user and their active JWT token.
// Exposes methods for logging in, logging out, and checking if a user has a valid session.
// 
// WHY IT IS REQUIRED:
// 1. Prevents having to pass user credentials and role profiles down to components manually via props.
// 2. Holds user auth state in a single centralized React context.
// 3. Synchronizes auth state with Axios default headers and local storage so that sessions persist across page reloads.
// 
// WHEN IT IS USED:
// Rendered at the root of the app in App.jsx. Accessed by any component or hook checking auth state,
// login page form actions, logout buttons in the header, and route guards protecting pages.

import React, { createContext, useState, useEffect, useContext } from 'react';
import storage from '../utils/storage';
import axiosInstance from '../api/axiosInstance';

/**
 * WHAT IT DOES: Initializes the React Context for authentication.
 * WHY IT IS REQUIRED: Provides the actual context channel to pass down state values.
 * WHEN IT IS USED: Created once on bundle load, referenced by AuthProvider and useAuth hook.
 */
const AuthContext = createContext(null);

/**
 * WHAT IT DOES: React Component that wraps the children and serves auth state variables.
 * WHY IT IS REQUIRED: Feeds the dynamic context values to all child nodes in the React tree.
 * WHEN IT IS USED: Main component wrapper inside App.jsx.
 */
export const AuthProvider = ({ children }) => {
  // State storing the active user profile (name, email, role, phone, etc.)
  const [user, setUser] = useState(null);
  
  // State storing the active JWT token string
  const [token, setToken] = useState(null);
  
  // State indicating if initial localStorage parse is in progress
  const [loading, setLoading] = useState(true);

  /**
   * WHAT IT DOES: Checks local storage on application mount to restore active user sessions.
   * WHY IT IS REQUIRED: Prevents logged-in users from having to re-authenticate on browser reload.
   * WHEN IT IS USED: Executes exactly once when the AuthProvider component is mounted.
   */
  useEffect(() => {
    const storedToken = storage.get('auth_token');
    const storedUser = storage.get('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      // Pre-configure axios default header for subsequent requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);

    // Decoupled event listener to handle logouts triggered by external network failures (like 401s in Axios)
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  /**
   * WHAT IT DOES: Saves the user session details and JWT token in React state and localStorage.
   * WHY IT IS REQUIRED: Triggers UI updates to transition from guest screen to dashboard view.
   * WHEN IT IS USED: Called by the login form upon successful validation of credentials.
   * 
   * @param {object} userData - Profile information of the logged-in user
   * @param {string} jwtToken - Authentication token returned from server
   */
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    
    // Save to persistence storage
    storage.set('auth_token', jwtToken);
    storage.set('auth_user', userData);

    // Apply header to default axios instance
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  };

  /**
   * WHAT IT DOES: Clears user session details from React state, local storage, and Axios headers.
   * WHY IT IS REQUIRED: Restricts system access immediately and resets the app state.
   * WHEN IT IS USED: Triggered on user clicking the logout button or automatic sessions expirations.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    storage.remove('auth_token');
    storage.remove('auth_user');
    
    // Remove header
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  // Bundle state variables and handlers to provide
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * WHAT IT DOES: Internal React hook to fetch context parameters directly.
 * WHY IT IS REQUIRED: Provides quick lookup logic inside the context directory.
 * WHEN IT IS USED: Loaded by the useAuth.js hook to expose context parameters.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
