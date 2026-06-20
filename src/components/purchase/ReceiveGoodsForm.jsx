// src/components/purchase/ReceiveGoodsForm.jsx
// Form to log material receipts from suppliers.

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const ReceiveGoodsForm = ({ onSubmit, onCancel, orderNumber }) => {
  const { showToast } = useToast();
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [warehouseLocation, setWarehouseLocation] = useState('MAIN-WH');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ receiveDate, warehouseLocation, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded text-xs leading-normal">
        Receiving materials for Purchase Order <span className="font-bold">{orderNumber}</span>. This will complete the PO workflow and add item quantities to stock automatically.
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Receipt Date</label>
        <input
          type="date"
          required
          value={receiveDate}
          onChange={(e) => setReceiveDate(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Destination Location</label>
        <select
          value={warehouseLocation}
          onChange={(e) => setWarehouseLocation(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="MAIN-WH">Main Storage Warehouse (MAIN-WH)</option>
          <option value="SHOP-FLOOR">Operational Shop Floor (SHOP-FLOOR)</option>
          <option value="SCRAP-LOC">Inspection & Scrap bin (SCRAP-LOC)</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Receipt Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Received in good condition, no visual defects."
          rows="3"
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
          Process Goods Receipt
        </button>
      </div>
    </form>
  );
};

export default ReceiveGoodsForm;
