// src/App.jsx
// Core Entry Component for FlowERP Frontend.
// Coordinates global Context Providers (Auth, Notification Toasts) and binds the BrowserRouter.

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  return (
    <BrowserRouter>
      {/* Toast Provider for Global Floating Notifications */}
      <ToastProvider>
        {/* Auth Provider for JWT Sessions and RBAC Guarding */}
        <AuthProvider>
          {/* Main Routing Gateway */}
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
