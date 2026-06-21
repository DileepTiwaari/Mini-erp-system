// src/components/users/UserList.jsx
// Interactive Users list showing user profiles.

import React from 'react';
import DataTable from '../common/DataTable';
import { formatRole } from '../../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export const UserList = ({ users = [], onEdit, onDelete, loading = false }) => {
  const columns = [
    { header: 'Name', key: 'name', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Email Address', key: 'email' },
    { 
      header: 'System Role', 
      key: 'role',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
          row.role === 'manager' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
          'bg-indigo-50 text-indigo-700 border border-indigo-200'
        }`}>
          {formatRole(row.role)}
        </span>
      )
    },
    { header: 'Phone', key: 'phone' },
    { 
      header: 'Status', 
      key: 'active',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
        }`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end no-print">
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={loading}
      emptyMessage="No system users created yet."
    />
  );
};

export default UserList;
