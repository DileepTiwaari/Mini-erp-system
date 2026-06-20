// src/pages/LoginPage.jsx
// 
// WHAT IT DOES:
// Renders the login entry page, housing the interactive LoginForm components.
// 
// WHY IT IS REQUIRED:
// 1. Serves as the page element mapped to the `/login` route in routing tables.
// 2. Isolates route views from pure component layout designs.
// 
// WHEN IT IS USED:
// Rendered when unauthenticated clients visit `/login` or when redirected from auth gates.

import React from 'react';
import LoginForm from '../components/auth/LoginForm';

/**
 * WHAT IT DOES: Primary page view component for User Authentication.
 * WHY IT IS REQUIRED: Combines page level structural styles with login form logic.
 * WHEN IT IS USED: Rendered for the `/login` route endpoint.
 */
export const LoginPage = () => {
  return (
    <div className="w-full">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
