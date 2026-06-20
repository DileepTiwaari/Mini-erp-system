// src/components/inventory/StockLedger.jsx
// Displays chronological stock ledger movements (inflows, outflows).

import React from 'react';
import DataTable from '../common/DataTable';
import { formatDateTime } from '../../utils/dateUtils';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const StockLedger = ({ ledger = [], products = [], loading = false }) => {
  const getProductDetails = (prodId) => {
    const prod = products.find(p => p.id === prodId);
    return prod ? `${prod.name} (${prod.code})` : 'Unknown Product';
  };

  const columns = [
    { 
      header: 'Movement Time', 
      key: 'timestamp',
      render: (row) => formatDateTime(row.timestamp)
    },
    { 
      header: 'Product Item', 
      key: 'productId',
      cellClassName: 'font-semibold',
      render: (row) => getProductDetails(row.productId)
    },
    { 
      header: 'Direction', 
      key: 'type',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 font-semibold ${
          row.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {row.type === 'in' ? (
            <>
              <ArrowDownLeft className="w-4 h-4" />
              <span>In (Stock Receipt)</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-4 h-4" />
              <span>Out (Deduction)</span>
            </>
          )}
        </span>
      )
    },
    { 
      header: 'Quantity Transacted', 
      key: 'quantity',
      render: (row) => {
        const prod = products.find(p => p.id === row.productId);
        const unit = prod ? prod.uom : 'pcs';
        return `${row.quantity} ${unit}`;
      }
    },
    { header: 'Reference ID / Document', key: 'reference', cellClassName: 'font-semibold' },
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
