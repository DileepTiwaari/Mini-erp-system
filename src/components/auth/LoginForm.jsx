// src/components/auth/LoginForm.jsx
// 
// WHAT IT DOES:
// Interactive sign-in form for FlowERP.
// Validates email syntax and passwords, triggers login via AuthContext, and displays
// responsive user prompts, loading states, and direct demo login buttons.
// 
// WHY IT IS REQUIRED:
// 1. Authenticates users by connecting input data to mock database structures or backend APIs.
// 2. Simplifies client evaluation by including immediate demo access buttons.
// 3. Prevents invalid payloads from reaching API endpoints through early validation.
// 
// WHEN IT IS USED:
// Rendered on the LoginPage view when an unauthenticated session is active.

import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import { Lock, Mail, Loader2, Key } from 'lucide-react';
import { formatRole } from '../../utils/formatters';

/**
 * WHAT IT DOES: Renders the credentials inputs, submit actions, and help panel for logging in.
 * WHY IT IS REQUIRED: Handles state, input validations, error rendering, and event handlers for auth.
 * WHEN IT IS USED: Loaded by LoginPage.jsx.
 */
export const LoginForm = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  
  // WHAT IT DOES: State references for email inputs, password inputs, validation errors, and loading state.
  // WHY IT IS REQUIRED: Feeds form controls and triggers UI states (like disabling buttons).
  // WHEN IT IS USED: Checked and modified during input edits and submission events.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  // WHAT IT DOES: Helper to validate if an email fits standard email syntax.
  // WHY IT IS REQUIRED: Prevents typing mistakes before sending queries.
  // WHEN IT IS USED: Run on form submission or when the user leaves the email input field.
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

  // WHAT IT DOES: Handles form submission events, validations, and dispatches login actions.
  // WHY IT IS REQUIRED: Coordinates the request lifecycle for logging in a user.
  // WHEN IT IS USED: Fired when clicking 'Sign In' or pressing Enter inside inputs.
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform email syntax check
    const syntaxErr = validateEmailSyntax(email);
    if (syntaxErr) {
      setEmailError(syntaxErr);
      showToast(syntaxErr, 'warning');
      return;
    }
    setEmailError('');

    if (!password) {
      showToast('Please enter your password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // WHAT IT DOES: Service API request.
      // WHY IT IS REQUIRED: Communicates with mock endpoint to retrieve mock JWT and profile payload.
      // WHEN IT IS USED: Inside submit login sequence.
      const data = await authService.login(email, password);
      login(data.user, data.token);
      showToast(`Welcome back, ${data.user.name}! (${formatRole(data.user.role)})`, 'success');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // WHAT IT DOES: Fast-tracks login testing by autofilling email, password, and resetting errors.
  // WHY IT IS REQUIRED: Provides quick demo account actions for review.
  // WHEN IT IS USED: Triggered by user clicking on demo helper buttons.
  const handleFillDemoUser = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setEmailError('');
  };

  // WHAT IT DOES: Array containing demo credentials mapping standard enterprise roles.
  // WHY IT IS REQUIRED: Centralizes demo login information for rendering in the help panel.
  // WHEN IT IS USED: Read when rendering the demo credentials panel.
  const demoUsers = [
    { name: 'Admin', email: 'admin@flowerp.com', desc: 'Full System Control', role: 'ADMIN' },
    { name: 'Owner', email: 'owner@flowerp.com', desc: 'Corporate Owner Actions', role: 'OWNER' },
    { name: 'Sales User', email: 'sales@flowerp.com', desc: 'Sales, Customers & Products', role: 'SALES_USER' },
    { name: 'Purchase User', email: 'purchase@flowerp.com', desc: 'Purchases & Vendors', role: 'PURCHASE_USER' },
    { name: 'Mfg User', email: 'mfg@flowerp.com', desc: 'Work Orders & BOMs', role: 'MANUFACTURING_USER' },
    { name: 'Inventory Manager', email: 'inventory@flowerp.com', desc: 'Stocks & Procurements', role: 'INVENTORY_MANAGER' },
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
              placeholder="e.g. admin@flowerp.com"
            />
          </div>
          {emailError && (
            <p className="text-xs text-rose-600 mt-1" id="email-error">
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

      {/* Demo Credentials Help box */}
      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2 font-semibold text-slate-700 text-xs mb-3">
          <Key className="w-4 h-4 text-brand-600" />
          <span>Quick Demo Logins (Password: password123)</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {demoUsers.map((item) => (
            <button
              key={item.email}
              type="button"
              onClick={() => handleFillDemoUser(item.email)}
              className="flex items-center justify-between p-2 hover:bg-slate-100 border border-slate-200 rounded transition-colors text-left text-xs bg-white text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.email}</span>
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
