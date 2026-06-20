/**
 * PURPOSE:
 * Renders the table grid listing Purchase Orders and RFQs.
 *
 * BUSINESS USE:
 * Displays drafted, confirmed, and received purchase orders. Provides quick operational action buttons
 * (View, Edit, Confirm, Receive, Cancel) directly inline.
 *
 * API USAGE:
 * None directly. Wraps the generic `DataTable` component.
 *
 * LOGIC FLOW:
 * Configures PO data columns. Inspects the status of each order row to render permitted actions
 * (e.g. Receive Goods is only allowed on confirmed/partial orders).
 */

import React from 'react';
import DataTable from '../common/DataTable';
import PurchaseStatusBadge from './PurchaseStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Edit2, Trash2, Eye, CheckCircle, Package, XCircle } from 'lucide-react';

export const PurchaseOrderList = ({
  orders = [],
  vendors = [],
  onView,
  onEdit,
  onConfirm,
  onReceive,
  onCancel,
  onDelete,
  loading = false
}) => {
  const getVendorName = (vendorId) => {
    const vend = vendors.find(v => v.id === vendorId);
    return vend ? vend.name : 'Unknown Vendor';
  };

  const columns = [
    { header: 'PO Number', key: 'orderNumber', cellClassName: 'font-mono text-xs font-bold text-slate-800' },
    { 
      header: 'Vendor Supplier', 
      key: 'vendorId', 
      cellClassName: 'font-semibold text-slate-700',
      render: (row) => getVendorName(row.vendorId) 
    },
    { 
      header: 'Order Date', 
      key: 'orderDate',
      render: (row) => formatDate(row.orderDate)
    },
    { 
      header: 'Expected Date', 
      key: 'expectedDate',
      render: (row) => formatDate(row.expectedDate) || <span className="text-slate-400">N/A</span>
    },
    { 
      header: 'Grand Total', 
      key: 'grandTotal', 
      cellClassName: 'font-semibold text-slate-850',
      render: (row) => formatCurrency(row.grandTotal || row.totalAmount || 0) 
    },
    { 
      header: 'Status', 
      key: 'status', 
      render: (row) => <PurchaseStatusBadge status={row.status} /> 
    },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end no-print">
          {/* View Details action */}
          {onView && (
            <button
              onClick={() => onView(row)}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
              title="View PO Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Confirm order action */}
          {row.status === 'draft' && onConfirm && (
            <button
              onClick={() => onConfirm(row)}
              className="p-1 hover:bg-blue-50 rounded text-blue-500 hover:text-blue-700"
              title="Confirm Purchase Order"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Receive material shipments action */}
          {(row.status === 'confirmed' || row.status === 'partially_received') && onReceive && (
            <button
              onClick={() => onReceive(row)}
              className="p-1 hover:bg-emerald-50 rounded text-emerald-500 hover:text-emerald-700"
              title="Receive Shipment Goods"
            >
              <Package className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit action */}
          {row.status === 'draft' && onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
              title="Edit PO"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Cancel PO action */}
          {row.status !== 'cancelled' && row.status !== 'fully_received' && onCancel && (
            <button
              onClick={() => onCancel(row)}
              className="p-1 hover:bg-rose-50 rounded text-rose-450 hover:text-rose-650"
              title="Cancel PO"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Hard delete action (only for drafts or cancelled) */}
          {(row.status === 'draft' || row.status === 'cancelled') && onDelete && (
            <button
              onClick={() => onDelete(row)}
              className="p-1 hover:bg-rose-50 rounded text-rose-450 hover:text-rose-650"
              title="Delete RFQ"
            >
              <Trash2 className="w-3.5 h-3.5" />
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
      emptyMessage="No purchase orders found."
    />
  );
};

export default PurchaseOrderList;
