// src/components/auth/LoginForm.jsx
// Interactive sign-in form for FlowERP.
// Prompts username and password, includes mock help helpers.

import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import { Lock, Mail, Loader2 } from 'lucide-react';

export const LoginForm = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data.user, data.token);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoUser = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="w-full">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-2xl mb-4">
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
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="e.g. admin@flowerp.com"
            />
          </div>
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
      <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
        <p className="font-semibold text-slate-700 mb-2">Demo Credentials (Password: password123):</p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleFillDemoUser('admin@flowerp.com')}
            className="text-left text-brand-600 hover:underline font-semibold"
          >
            • Admin: admin@flowerp.com (Full Control)
          </button>
          <button
            onClick={() => handleFillDemoUser('manager@flowerp.com')}
            className="text-left text-brand-600 hover:underline font-semibold"
          >
            • Manager: manager@flowerp.com (Inventory & Operations)
          </button>
          <button
            onClick={() => handleFillDemoUser('staff@flowerp.com')}
            className="text-left text-brand-600 hover:underline font-semibold"
          >
            • Staff: staff@flowerp.com (Sales & Operational entries)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
