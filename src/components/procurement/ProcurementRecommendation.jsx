// src/components/procurement/ProcurementRecommendation.jsx
// Displays safety stock replenishment recommendations and enables automated reordering.

import React from 'react';
import DataTable from '../common/DataTable';
import { ShoppingCart } from 'lucide-react';
import { formatQuantity } from '../../utils/formatters';

export const ProcurementRecommendation = ({
  recommendations = [],
  onExecute,
  executingId = null,
  loading = false
}) => {
  const columns = [
    { header: 'Product Item', key: 'productName', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Item SKU', key: 'productCode' },
    { 
      header: 'Available Stock', 
      key: 'currentStock',
      render: (row) => (
        <span className="text-rose-600 font-semibold">{formatQuantity(row.currentStock, row.uom)}</span>
      )
    },
    { 
      header: 'Safety limit', 
      key: 'minStock',
      render: (row) => formatQuantity(row.minStock, row.uom)
    },
    { 
      header: 'Recommended Purchase Order Qty', 
      key: 'recommendedQty',
      cellClassName: 'font-semibold text-slate-800',
      render: (row) => formatQuantity(row.recommendedQty, row.uom)
    },
    { header: 'Suggested Supplier', key: 'suggestedVendorName', cellClassName: 'font-semibold text-brand-600' },
    {
      header: 'Replenishment Action',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => {
        const isExecuting = executingId === row.id;

        return (
          <div className="no-print">
            <button
              onClick={() => onExecute(row)}
              disabled={isExecuting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 border border-transparent rounded shadow-sm focus:outline-none transition-colors duration-150"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Triggering PO...' : 'Create Draft PO'}</span>
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={recommendations}
      loading={loading}
      emptyMessage="Excellent! All inventory stock levels are above the safety thresholds. No replenishment needed."
    />
  );
};

export default ProcurementRecommendation;
