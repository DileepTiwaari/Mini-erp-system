/**
 * PURPOSE:
 * Renders the table grid for listing registered supplier vendors.
 *
 * BUSINESS USE:
 * Displays a clean directory of company vendors, codes, tax IDs (GST), status values,
 * and contact persons, with action options for commercial team members.
 *
 * API USAGE:
 * None directly. Wraps the generic `DataTable` component.
 *
 * LOGIC FLOW:
 * Configures the columns array mapping each record attribute to grid cells,
 * including a custom renderer for vendor actions (View Details, Edit, Delete).
 */

import React from 'react';
import DataTable from '../common/DataTable';
import { Edit2, Trash2, Eye } from 'lucide-react';

export const VendorList = ({
  vendors = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const columns = [
    { header: 'Vendor Code', key: 'code', cellClassName: 'font-mono text-xs font-semibold text-slate-500' },
    { header: 'Supplier Name', key: 'name', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Contact Representative', key: 'contactName' },
    { header: 'Email Address', key: 'email' },
    { header: 'Phone Number', key: 'phone' },
    { header: 'GST Tax ID', key: 'gstNumber', cellClassName: 'font-mono text-xs uppercase text-slate-500' },
    { 
      header: 'Location', 
      key: 'location',
      render: (row) => {
        const parts = [row.city, row.state, row.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
      }
    },
    { 
      header: 'Status', 
      key: 'status', 
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
          row.status === 'ACTIVE' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
            : 'bg-slate-55 text-slate-700 border border-slate-200'
        }`}>
          {row.status || 'ACTIVE'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end no-print">
          {onView && (
            <button
              onClick={() => onView(row)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
              title="View Profile Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
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
