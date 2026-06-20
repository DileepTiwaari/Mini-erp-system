// src/pages/LoginPage.jsx
// Primary login container screen. Renders LoginForm inside AuthLayout context.

import React from 'react';
import LoginForm from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="w-full">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
