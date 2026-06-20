/**
 * PURPOSE:
 * Renders the form for registering or updating customer master profiles.
 *
 * BUSINESS USE:
 * Enforces metadata constraints (customer name, email, phone, GST, address)
 * required for order billing and shipments, guiding users with inline validations.
 *
 * API USAGE:
 * Triggered by submit events inside the customer management tab of SalesOrdersPage.
 *
 * LOGIC EXPLANATION:
 * - Uses React state hooks to track input fields (Name, Email, Phone, GST, Address, City, State, Country).
 * - Utilizes `useEffect` to map existing profile details if `initialData` is passed (Edit mode).
 * - Validates email and required parameters, and triggers `onSubmit` with formatted customer details.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export const CustomerForm = ({ onSubmit, initialData, onCancel }) => {
  const { showToast } = useToast();

  // Input states
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('USA');

  // Load initialData when in Edit mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContactName(initialData.contactName || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setGstNumber(initialData.gstNumber || '');
      setAddress(initialData.address || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setCountry(initialData.country || 'USA');
    }
  }, [initialData]);

  // Form submission validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please fill out Company/Customer Name.', 'warning');
      return;
    }
    if (!email.trim()) {
      showToast('Please fill out Email Address.', 'warning');
      return;
    }

    onSubmit({
      name: name.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gstNumber: gstNumber.trim().toUpperCase(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
    });

    // Reset fields if creating new
    if (!initialData) {
      setName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setGstNumber('');
      setAddress('');
      setCity('');
      setState('');
      setCountry('USA');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Customer Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Acme Manufacturing Inc"
          />
        </div>

        {/* Contact Representative */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Alice Johnson"
          />
        </div>

        {/* GST Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GST / Tax ID Number</label>
          <input
            type="text"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
            placeholder="e.g. 27AAAAA1111A1Z1"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. purchasing@acmemfg.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. 555-0155"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. 500 Industrial Pkwy"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Detroit"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Michigan"
          />
        </div>

        {/* Country */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. USA"
          />
        </div>
      </div>

      {/* Action buttons */}
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
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors duration-150"
        >
          {initialData ? 'Save Changes' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
