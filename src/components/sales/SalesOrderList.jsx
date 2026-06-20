/**
 * PURPOSE:
 * Renders the Sales Orders master data table list.
 *
 * BUSINESS USE:
 * Displays drafted, confirmed, and shipped customer orders in a Zoho/Odoo grid layout,
 * prompting actions like viewing lines details, editing quotations, and cancelling confirm orders.
 *
 * API USAGE:
 * Consumes list records retrieved by `salesService.getSalesOrders()`.
 *
 * LOGIC EXPLANATION:
 * - Feeds order columns to the common DataTable component.
 * - Resolves customer IDs to customer names.
 * - Formats dates and currency values.
 * - Integrates StatusBadge colors.
 * - Dynamically toggles Edit/Cancel commands depending on order status states.
 */

import React from 'react';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Edit2, Eye, XCircle } from 'lucide-react';

export const SalesOrderList = ({
  orders = [],
  customers = [],
  onEdit,
  onCancelOrder,
  onView,
  loading = false,
}) => {
  // Resolves customer ID to client company name
  const getCustomerName = (custId) => {
    const cust = customers.find(c => c.id === custId);
    return cust ? cust.name : 'Unknown Customer';
  };

  const columns = [
    { 
      header: 'Order Number', 
      key: 'orderNumber', 
      cellClassName: 'font-semibold text-slate-800 font-mono text-xs uppercase' 
    },
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
      header: 'Total Amount', 
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
          {/* View Details */}
          <button
            onClick={() => onView(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {/* Edit Order - allowed if draft or confirmed */}
          {row.status !== 'fully_delivered' && row.status !== 'cancelled' && (
            <button
              onClick={() => onEdit(row)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
              title="Edit Quotation"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* Cancel Order - allowed if draft or confirmed or partial */}
          {row.status !== 'fully_delivered' && row.status !== 'cancelled' && onCancelOrder && (
            <button
              onClick={() => onCancelOrder(row)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600 transition-colors"
              title="Cancel Order"
            >
              <XCircle className="w-4 h-4" />
            </button>
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
      emptyMessage="No sales orders registered in the system."
    />
  );
};

export default SalesOrderList;
