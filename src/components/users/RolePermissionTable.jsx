// src/components/users/RolePermissionTable.jsx
// Displays a clear matrix explaining what roles can perform what operations.
// Helps non-technical administrators understand enterprise permission logic easily.

import React from 'react';
import { Check, X } from 'lucide-react';

export const RolePermissionTable = () => {
  // Description matrix of system permissions
  const matrix = [
    { module: 'Dashboard Metrics', admin: true, manager: true, staff: true, note: 'General overview for all roles' },
    { module: 'User Configuration', admin: true, manager: false, staff: false, note: 'Creating and editing roles (Admin only)' },
    { module: 'Products Catalog', admin: true, manager: true, staff: 'view', note: 'Staff can view, Manager/Admin edit' },
    { module: 'Sales Ordering', admin: true, manager: true, staff: true, note: 'All roles can draft and submit orders' },
    { module: 'Purchase Ordering', admin: true, manager: true, staff: 'view', note: 'Staff can view, Manager/Admin edit' },
    { module: 'Shop Floor Mfg Orders', admin: true, manager: true, staff: true, note: 'Staff can register operational runs' },
    { module: 'Inventory Controls', admin: true, manager: true, staff: 'view', note: 'Adjustments require manager authorization' },
    { module: 'Replenishment Suggestions', admin: true, manager: true, staff: 'view', note: 'Manager/Admin can execute orders' },
    { module: 'Audit Log Archival', admin: true, manager: false, staff: false, note: 'Traceability and security tracking' },
  ];

  const renderStatus = (val) => {
    if (val === true) return <Check className="w-5 h-5 text-emerald-600 mx-auto" />;
    if (val === 'view') return <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">View Only</span>;
    return <X className="w-5 h-5 text-rose-500 mx-auto" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mt-6">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h4 className="font-semibold text-slate-800 text-base">Role Permissions matrix</h4>
        <p className="text-slate-500 text-xs mt-0.5">Reference map detailing module access by role.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-100 font-semibold text-slate-700">
            <tr>
              <th className="px-6 py-3">Module Name</th>
              <th className="px-6 py-3 text-center">Admin</th>
              <th className="px-6 py-3 text-center">Manager</th>
              <th className="px-6 py-3 text-center">Staff</th>
              <th className="px-6 py-3">Operational Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {matrix.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-semibold text-slate-800">{row.module}</td>
                <td className="px-6 py-3 text-center">{renderStatus(row.admin)}</td>
                <td className="px-6 py-3 text-center">{renderStatus(row.manager)}</td>
                <td className="px-6 py-3 text-center">{renderStatus(row.staff)}</td>
                <td className="px-6 py-3 text-xs text-slate-500 font-medium">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePermissionTable;
