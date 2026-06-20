// src/components/bom/WorkCenterForm.jsx
// Form to define a new manufacturing Work Center.

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const WorkCenterForm = ({ onSubmit, onCancel }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [costPerHour, setCostPerHour] = useState(0.00);
  const [capacity, setCapacity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !code) {
      showToast('Please fill out Work Center Name and Code.', 'warning');
      return;
    }
    onSubmit({
      name,
      code: code.toUpperCase(),
      costPerHour: Number(costPerHour) || 0,
      capacity: Number(capacity) || 1
    });
    setName('');
    setCode('');
    setCostPerHour(0.00);
    setCapacity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Work Center Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Paint Station"
        />
      </div>

      {/* Code */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Work Center Code</label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. WC-PAINT"
        />
      </div>

      {/* Cost per hour */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Operating Cost per Hour ($)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          required
          value={costPerHour}
          onChange={(e) => setCostPerHour(e.target.value)}
          className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Simultaneous capacity limit (operators)</label>
        <input
          type="number"
          min="1"
          required
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
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
          Add Work Center
        </button>
      </div>
    </form>
  );
};

export default WorkCenterForm;
