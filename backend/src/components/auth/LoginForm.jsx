// src/components/auth/LoginForm.jsx
// 
// WHAT IT DOES:
// Interactive sign-in form for FlowERP.
// Validates username, triggers login via AuthContext, and displays
// responsive user prompts, loading states, and direct demo login buttons.
// 
// WHY IT IS REQUIRED:
// 1. Authenticates users by connecting input data to backend APIs.
// 2. Simplifies client evaluation by including immediate demo access buttons.
// 
// WHEN IT IS USED:
// Rendered on the LoginPage view when an unauthenticated session is active.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import { Lock, User, Loader2, Key } from 'lucide-react';
import { formatRole } from '../../utils/formatters';

export const LoginForm = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  
  // State references for username, password, errors, and loading state.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateUsername = (val) => {
    if (!val.trim()) {
      return 'Username is required.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform username validation
    const errorMsg = validateUsername(username);
    if (errorMsg) {
      setUsernameError(errorMsg);
      showToast(errorMsg, 'warning');
      return;
    }
    setUsernameError('');

    if (!password) {
      showToast('Please enter your password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(username, password);
      login(data.user, data.token);
      showToast(`Welcome back, ${data.user.name || data.user.username}! (${formatRole(data.user.role)})`, 'success');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoUser = (demoUsername) => {
    setUsername(demoUsername);
    setPassword('password123');
    setUsernameError('');
  };

  const demoUsers = [
    { name: 'Admin', username: 'admin', desc: 'Full System Control', role: 'ADMIN' },
    { name: 'Business Owner', username: 'owner', desc: 'Dashboard & All Modules', role: 'BUSINESS_OWNER' },
    { name: 'Sales User', username: 'sales', desc: 'Sales, Customers & Products', role: 'SALES_USER' },
    { name: 'Purchase User', username: 'purchase', desc: 'Purchases & Vendors', role: 'PURCHASE_USER' },
    { name: 'Mfg User', username: 'mfg', desc: 'Work Orders & BOMs', role: 'MANUFACTURING_USER' },
    { name: 'Inventory Manager', username: 'inventory', desc: 'Stocks & Procurements', role: 'INVENTORY_MANAGER' },
  ];

  return (
    <div className="w-full">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-2xl mb-4 shadow-sm">
          F
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Sign in to FlowERP</h2>
        <p className="text-sm text-slate-500 mt-1">Enterprise management made simple</p>
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
              name="username"
              type="text"
              autoComplete="username"
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
            <p className="text-xs text-rose-600 mt-1" id="username-error">
              {usernameError}
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
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="••••••••"
            />
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
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Redirect to Register link */}
      <div className="mt-4 text-center">
        <span className="text-xs text-slate-500">Don't have an account? </span>
        <Link to="/register" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Create Account
        </Link>
      </div>

      {/* Demo Credentials Help box */}
      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2 font-semibold text-slate-700 text-xs mb-3">
          <Key className="w-4 h-4 text-brand-600" />
          <span>Quick Demo Logins (Password: password123)</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {demoUsers.map((item) => (
            <button
              key={item.username}
              type="button"
              onClick={() => handleFillDemoUser(item.username)}
              className="flex items-center justify-between p-2 hover:bg-slate-100 border border-slate-200 rounded transition-colors text-left text-xs bg-white text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.username}</span>
              </div>
              <div className="text-right">
                <span className="inline-block px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-500">
                  {formatRole(item.role)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
