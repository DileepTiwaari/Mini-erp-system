// src/components/users/UserForm.jsx
// Form to add or edit user credentials and system access roles.

import React, { useState, useEffect } from 'react';
import { ROLES } from '../../utils/constants';

export const UserForm = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES.STAFF);
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setRole(initialData.role || ROLES.STAFF);
      setPhone(initialData.phone || '');
      setActive(initialData.active !== false);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      role,
      phone,
      active
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          placeholder="e.g. Harsha Vardhan"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          placeholder="e.g. harsha@flowerp.com"
        />
      </div>

      {/* Role selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">System Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
        >
          <option value={ROLES.ADMIN}>Admin (Full Control)</option>
          <option value={ROLES.MANAGER}>Manager (Operations & Stock)</option>
          <option value={ROLES.STAFF}>Staff (Operations & Sales)</option>
        </select>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          placeholder="555-0100"
        />
      </div>

      {/* Active State */}
      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          id="active"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
        />
        <label htmlFor="active" className="text-sm font-semibold text-slate-700">
          Account Active
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors duration-150"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors duration-150"
        >
          {initialData ? 'Save Changes' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
