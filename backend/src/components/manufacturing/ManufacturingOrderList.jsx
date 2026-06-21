// src/components/manufacturing/ManufacturingOrderList.jsx
// Lists active and completed manufacturing orders (MOs).

import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Edit2, Trash2, Eye } from 'lucide-react';

export const ManufacturingOrderList = ({
  orders = [],
  products = [],
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  const getProductName = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown assembly';
  };

  const columns = [
    { header: 'MO Code', key: 'moNumber', cellClassName: 'font-semibold text-slate-800' },
    { 
      header: 'Finished Assembly Output', 
      key: 'productId', 
      cellClassName: 'font-semibold',
      render: (row) => getProductName(row.productId) 
    },
    { 
      header: 'Quantity (units)', 
      key: 'quantity',
      render: (row) => `${row.quantity} pcs`
    },
    { 
      header: 'Start Date', 
      key: 'plannedStartDate',
      render: (row) => formatDate(row.plannedStartDate)
    },
    { 
      header: 'Actual End Date', 
      key: 'actualEndDate',
      render: (row) => row.actualEndDate ? formatDate(row.actualEndDate) : <span className="text-slate-400 font-medium italic">In progress</span>
    },
    { 
      header: 'Floor Status', 
      key: 'status', 
      render: (row) => <StatusBadge status={row.status} /> 
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
            title="View MO Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {row.status !== 'done' && row.status !== 'cancelled' && (
            <>
              <button
                onClick={() => onEdit(row)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                title="Update MO Status"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(row)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
                title="Cancel Run"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      emptyMessage="No manufacturing runs scheduled."
    />
  );
};

export default ManufacturingOrderList;
