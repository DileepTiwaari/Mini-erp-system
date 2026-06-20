// src/components/sales/DeliveryForm.jsx
// Form to register shipment tracking details for completed orders.

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const DeliveryForm = ({ onSubmit, onCancel, orderNumber }) => {
  const { showToast } = useToast();
  const [carrier, setCarrier] = useState('UPS');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipDate, setShipDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber) {
      showToast('Please enter a tracking number.', 'warning');
      return;
    }
    onSubmit({ carrier, trackingNumber, shipDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded text-xs leading-normal">
        Shipping items for Sales Order <span className="font-bold">{orderNumber}</span>. This will complete the order workflow and adjust product quantities automatically.
      </div>

      {/* Carrier */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Carrier Service</label>
        <select
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="UPS">United Parcel Service (UPS)</option>
          <option value="FedEx">Federal Express (FedEx)</option>
          <option value="DHL">DHL Express</option>
          <option value="USPS">United States Postal Service (USPS)</option>
        </select>
      </div>

      {/* Tracking Number */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Tracking Number</label>
        <input
          type="text"
          required
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. 1Z999AA10123456784"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Shipment Date</label>
        <input
          type="date"
          required
          value={shipDate}
          onChange={(e) => setShipDate(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
          Confirm Dispatch
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;
