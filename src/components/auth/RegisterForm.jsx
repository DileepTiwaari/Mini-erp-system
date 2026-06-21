// src/components/auth/RegisterForm.jsx
// 
// WHAT IT DOES:
// Interactive registration form for FlowERP.
// Validates username, email syntax, and passwords, triggers registration via authService,
// and redirects to the login view on success.
// 
// WHY IT IS REQUIRED:
// 1. Allows users to self-register new accounts with specific roles.
// 2. Selects appropriate security roles to test access policies.
// 
// WHEN IT IS USED:
// Rendered on the RegisterPage view.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import { Lock, Mail, Loader2, User, Shield } from 'lucide-react';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State references for inputs, validation errors, and loading state.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmailSyntax = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      return 'Email address is required.';
    }
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address (e.g. name@domain.com).';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!username.trim()) {
      setUsernameError('Username is required.');
      hasError = true;
    }

    const emailErr = validateEmailSyntax(email);
    if (emailErr) {
      setEmailError(emailErr);
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await authService.register(username, email, password, role);
      showToast('Registration Successful', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'ADMIN', label: 'Admin (Full Control)' },
    { value: 'BUSINESS_OWNER', label: 'Business Owner' },
    { value: 'SALES_USER', label: 'Sales User' },
    { value: 'PURCHASE_USER', label: 'Purchase User' },
    { value: 'MANUFACTURING_USER', label: 'Manufacturing User' },
    { value: 'INVENTORY_MANAGER', label: 'Inventory Manager' },
  ];

  return (
    <div className="w-full">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-2xl mb-4 shadow-sm">
          F
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Create your account</h2>
        <p className="text-sm text-slate-500 mt-1">Get started with FlowERP</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Input */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1">
            Username
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) setUsernameError('');
              }}
              className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
                usernameError ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
              }`}
              placeholder="Enter username"
            />
          </div>
          {usernameError && (
            <p className="text-xs text-rose-600 mt-1">
              {usernameError}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
                emailError ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
              }`}
              placeholder="e.g. name@domain.com"
            />
          </div>
          {emailError && (
            <p className="text-xs text-rose-600 mt-1">
              {emailError}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
                passwordError ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
              }`}
              placeholder="••••••••"
            />
          </div>
          {passwordError && (
            <p className="text-xs text-rose-600 mt-1">
              {passwordError}
            </p>
          )}
        </div>

        {/* Role Select Dropdown */}
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-1">
            Security Role
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Shield className="w-4 h-4" />
            </div>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>

      {/* Already have an account link */}
      <div className="mt-4 text-center">
        <span className="text-xs text-slate-500">Already have an account? </span>
        <Link to="/login" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
