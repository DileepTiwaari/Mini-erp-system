// src/components/bom/BomList.jsx
// Lists active Bills of Materials (BOM) for manufacturing.
// Purpose: Renders BOM recipes list with versioning and configuration triggers.
// Business Use: Provides engineers and operators a catalog to view, edit, or check recipe specs.

import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { Edit2, Trash2, Eye } from 'lucide-react';

export const BomList = ({
  boms = [],
  products = [],
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  const getProductName = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Assembly';
  };

  const columns = [
    { header: 'BOM Name', key: 'name', cellClassName: 'font-semibold text-slate-800' },
    { 
      header: 'Finished Product', 
      key: 'productId',
      cellClassName: 'font-semibold text-brand-600',
      render: (row) => getProductName(row.productId) 
    },
    { header: 'Version', key: 'version', cellClassName: 'text-slate-500 font-medium' },
    { 
      header: 'Status', 
      key: 'status', 
      render: (row) => <StatusBadge status={row.status || 'ACTIVE'} /> 
    },
    { 
      header: 'Components Count', 
      key: 'items',
      render: (row) => `${(row.items || []).length} items`
    },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end no-print">
          <button
            onClick={() => onView(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
            title="View Specifications"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
            title="Edit BOM"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
            title="Delete BOM"
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
      data={boms}
      loading={loading}
      emptyMessage="No Bill of Materials configured yet."
    />
  );
};

export default BomList;
