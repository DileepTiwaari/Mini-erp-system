// src/components/bom/BomList.jsx
// Lists active Bills of Materials (BOM) for manufacturing.

import React from 'react';
import DataTable from '../common/DataTable';
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
    { header: 'BOM Identifier Name', key: 'name', cellClassName: 'font-semibold text-slate-800' },
    { 
      header: 'Finished Assembly Product', 
      key: 'productId',
      cellClassName: 'font-semibold text-brand-600',
      render: (row) => getProductName(row.productId) 
    },
    { 
      header: 'Component Count', 
      key: 'items',
      render: (row) => `${(row.items || []).length} materials`
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
            title="View Raw Materials Detail"
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
