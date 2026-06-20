// src/components/audit/AuditLogTable.jsx
// Renders the list of user actions, modifications, logins, and logouts.

import React from 'react';
import DataTable from '../common/DataTable';
import { formatDateTime } from '../../utils/dateUtils';
import { ShieldCheck } from 'lucide-react';

export const AuditLogTable = ({ logs = [], loading = false }) => {
  const columns = [
    { 
      header: 'Operation Timestamp', 
      key: 'timestamp', 
      cellClassName: 'text-slate-500 text-xs font-semibold',
      render: (row) => formatDateTime(row.timestamp)
    },
    { header: 'Username / Author', key: 'userName', cellClassName: 'font-semibold text-slate-800' },
    { 
      header: 'Action category', 
      key: 'action',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{row.action}</span>
        </span>
      )
    },
    { header: 'Action details', key: 'description', cellClassName: 'text-slate-600 font-medium' },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      loading={loading}
      emptyMessage="No system audit logs recorded."
    />
  );
};

export default AuditLogTable;
// Also mock in this file
