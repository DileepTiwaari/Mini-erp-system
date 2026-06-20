// src/components/sales/SalesOrderList.jsx
// Displays a list of sales orders with statuses and actions.

import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Edit2, Trash2, Eye } from 'lucide-react';

export const SalesOrderList = ({
  orders = [],
  customers = [],
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  const getCustomerName = (custId) => {
    const cust = customers.find(c => c.id === custId);
    return cust ? cust.name : 'Unknown Customer';
  };

  const columns = [
    { header: 'Order ID', key: 'orderNumber', cellClassName: 'font-semibold text-slate-800' },
    { 
      header: 'Customer', 
      key: 'customerId', 
      cellClassName: 'font-semibold',
      render: (row) => getCustomerName(row.customerId) 
    },
    { 
      header: 'Order Date', 
      key: 'orderDate',
      render: (row) => formatDate(row.orderDate)
    },
    { 
      header: 'Total Value', 
      key: 'totalAmount', 
      render: (row) => formatCurrency(row.totalAmount) 
    },
    { 
      header: 'Status', 
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
            title="View Order Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {row.status !== 'completed' && row.status !== 'cancelled' && (
            <>
              <button
                onClick={() => onEdit(row)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                title="Edit Order"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(row)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
                title="Delete Order"
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
      emptyMessage="No sales orders drafted yet."
    />
  );
};

export default SalesOrderList;
