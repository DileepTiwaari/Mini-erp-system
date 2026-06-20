// src/components/sales/CustomerForm.jsx
// Form to register new clients/customers.

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const CustomerForm = ({ onSubmit, onCancel }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill out Customer Name and Email.', 'warning');
      return;
    }
    onSubmit({ name, contactName, email, phone, address });
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Company / Customer Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Acme Corp"
        />
      </div>

      {/* Contact Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Representative Name</label>
        <input
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. John Doe"
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
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. contact@acme.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. 555-0199"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Billing / Shipping Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Street details..."
          rows="2"
        />
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
          Add Customer
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
