// src/pages/RegisterPage.jsx
// 
// WHAT IT DOES:
// Renders the register page containing the RegisterForm component.
// 
// WHY IT IS REQUIRED:
// Serves as the page view element mapped to the `/register` path.

import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="w-full">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
