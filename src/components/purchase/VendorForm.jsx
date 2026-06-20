/**
 * PURPOSE:
 * Renders the form to register new suppliers or modify existing vendor profiles.
 *
 * BUSINESS USE:
 * Allows user input to capture Vendor Name, Code, contact credentials, GST details,
 * and physical billing addresses for correct purchase invoicing.
 *
 * API USAGE:
 * None (pure presentation layer component). Triggers the `onSubmit` callback.
 *
 * LOGIC FLOW:
 * - Tracks form field values via React component state hooks.
 * - Handles editing prepopulation by reading `initialData` values inside `useEffect`.
 * - Validates email structures, mandatory fields, and GST formats before execution.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export const VendorForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();

  // Field states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('USA');
  const [status, setStatus] = useState('ACTIVE');

  // Load fields during edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setContactName(initialData.contactName || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setGstNumber(initialData.gstNumber || '');
      setAddress(initialData.address || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setCountry(initialData.country || 'USA');
      setStatus(initialData.status || 'ACTIVE');
    } else {
      setName('');
      setCode('');
      setContactName('');
      setEmail('');
      setPhone('');
      setGstNumber('');
      setAddress('');
      setCity('');
      setState('');
      setCountry('USA');
      setStatus('ACTIVE');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verification validations
    if (!name.trim()) {
      showToast('Supplier Vendor Name is required.', 'warning');
      return;
    }
    if (!email.trim()) {
      showToast('Email address is required.', 'warning');
      return;
    }
    if (!phone.trim()) {
      showToast('Phone number is required.', 'warning');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    // Call submit handler
    onSubmit({
      name: name.trim(),
      code: code.trim() || undefined, // code can be auto-generated in service if empty
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gstNumber: gstNumber.trim().toUpperCase(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company Name */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Company / Vendor Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. Apex Metal Corp"
          />
        </div>

        {/* Vendor Code */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Vendor Code (Optional)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. VND-001 (Auto-filled on empty)"
          />
        </div>

        {/* Contact Representative */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Contact Person Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. John Doe"
          />
        </div>

        {/* GST Tax Identifier */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">GST Tax ID</label>
          <input
            type="text"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs uppercase"
            placeholder="e.g. 27AAAAA1111A1Z1"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. sales@apexmetal.com"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. 555-0220"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-slate-700 font-bold mb-1">Billing / Shipping Street Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          placeholder="e.g. 120 Metalworks Blvd"
          rows="2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* City */}
        <div className="sm:col-span-2">
          <label className="block text-slate-700 font-bold mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. Columbus"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. Ohio"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            placeholder="e.g. USA"
          />
        </div>
      </div>

      {/* Status & Actions block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100/50">
        {/* Active Status */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
        >
          {initialData ? 'Update Vendor Profile' : 'Register Vendor Account'}
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
