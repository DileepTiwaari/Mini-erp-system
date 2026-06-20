// src/components/purchase/VendorForm.jsx
// Form to register new supplier vendors.

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export const VendorForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContactName(initialData.contactName || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill out Vendor Name and Email.', 'warning');
      return;
    }
    onSubmit({ name, contactName, email, phone, address });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Vendor Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Company / Vendor Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Apex Metal Suppliers"
        />
      </div>

      {/* Contact Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Rep Name</label>
        <input
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Samuel Smith"
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
          placeholder="e.g. orders@apexmetal.com"
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
          placeholder="e.g. 555-0300"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Billing / Shipping Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. 120 Industrial Blvd, Suite A"
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
          {initialData ? 'Update Vendor' : 'Create Vendor'}
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
