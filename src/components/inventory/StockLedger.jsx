// src/components/inventory/StockLedger.jsx
// Displays chronological stock ledger movements (inflows, outflows).
// Purpose: Renders historical warehouse material movements.
// Business Use: Audits stock entries, adjustments, reservations, releases, consumptions, and productions.
// API Usage: Reads localized ledger entries list.

import React from 'react';
import DataTable from '../common/DataTable';
import { formatDateTime } from '../../utils/dateUtils';
import { formatQuantity } from '../../utils/formatters';

export const StockLedger = ({ ledger = [], products = [], loading = false }) => {
  const getProductDetails = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Product';
  };

  const columns = [
    { 
      header: 'Date', 
      key: 'timestamp',
      cellClassName: 'text-slate-500 font-medium',
      render: (row) => formatDateTime(row.timestamp)
    },
    { 
      header: 'Product', 
      key: 'productId',
      cellClassName: 'font-semibold text-slate-800',
      render: (row) => getProductDetails(row.productId)
    },
    { 
      header: 'Movement Type', 
      key: 'movementType',
      render: (row) => {
        const type = row.movementType || (row.type === 'in' ? 'Purchase Receipt' : 'Sales Delivery');
        let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
        
        if (type === 'Purchase Receipt') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        else if (type === 'Sales Delivery') badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
        else if (type === 'Manufacturing Consumption') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
        else if (type === 'Manufacturing Production') badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        else if (type === 'Adjustment') badgeColor = 'bg-slate-50 text-slate-800 border-slate-300';
        else if (type === 'Reservation') badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
        else if (type === 'Release') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${badgeColor}`}>
            {type}
          </span>
        );
      }
    },
    { 
      header: 'Quantity', 
      key: 'quantity',
      cellClassName: 'font-semibold text-slate-900 text-right',
      render: (row) => {
        const prod = products.find(p => p.id === row.productId);
        const unit = prod ? prod.uom : 'pcs';
        const sign = (row.type === 'out' || row.movementType === 'Manufacturing Consumption' || row.movementType === 'Reservation' || row.movementType === 'Sales Delivery') ? '-' : '+';
        return (
          <span className={sign === '+' ? 'text-emerald-600' : 'text-rose-600'}>
            {sign}{formatQuantity(row.quantity, unit)}
          </span>
        );
      }
    },
    { header: 'Reference Number', key: 'reference', cellClassName: 'font-semibold text-slate-700' },
    { 
      header: 'Balance After Movement', 
      key: 'balanceAfterMovement',
      cellClassName: 'font-bold text-slate-800 text-right',
      render: (row) => {
        const prod = products.find(p => p.id === row.productId);
        const unit = prod ? prod.uom : 'pcs';
        return row.balanceAfterMovement !== undefined ? formatQuantity(row.balanceAfterMovement, unit) : 'N/A';
      }
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={ledger}
      loading={loading}
      emptyMessage="No stock movements logged in the system."
    />
  );
};

export default StockLedger;
