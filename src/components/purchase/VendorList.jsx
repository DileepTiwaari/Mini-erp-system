// src/components/purchase/VendorList.jsx
// Displays a list of vendor suppliers with action buttons.

import React from 'react';
import DataTable from '../common/DataTable';
import { Edit2, Trash2 } from 'lucide-react';

export const VendorList = ({
  vendors = [],
  onEdit,
  onDelete,
  loading = false,
}) => {
  const columns = [
    { header: 'Supplier Name', key: 'name', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Contact Person', key: 'contactName' },
    { header: 'Email Address', key: 'email' },
    { header: 'Phone Number', key: 'phone' },
    { header: 'Address location', key: 'address', cellClassName: 'truncate max-w-xs' },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end no-print">
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
            title="Edit Vendor"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
            title="Delete Vendor"
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
      data={vendors}
      loading={loading}
      emptyMessage="No vendors registered in the directory."
    />
  );
};

export default VendorList;
