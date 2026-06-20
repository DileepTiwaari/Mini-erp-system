// src/context/AuthContext.jsx
// JWT Authentication Context Provider for FlowERP.
// Stores credentials, JWT token, and handles automatic token application to axios.
// Synchronized with localStorage to keep user session alive.

import React, { createContext, useState, useEffect, useContext } from 'react';
import storage from '../utils/storage';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage
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

    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    
    // Save to persistence storage
    storage.set('auth_token', jwtToken);
    storage.set('auth_user', userData);

    // Apply header to default axios instance
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.remove('auth_token');
    storage.remove('auth_user');
    
    // Remove header
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
