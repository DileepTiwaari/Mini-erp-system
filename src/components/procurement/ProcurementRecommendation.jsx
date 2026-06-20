// src/components/procurement/ProcurementRecommendation.jsx
// Displays safety stock replenishment recommendations and enables automated reordering.
// Purpose: Renders procurement recommendations grid.
// Business Use: Informs planners of shortages and provides one-click action to schedule MO or PO.
// API Usage: Executes replenishment requests via parent callbacks.

import React from 'react';
import DataTable from '../common/DataTable';
import { ShoppingCart, Hammer } from 'lucide-react';
import { formatQuantity } from '../../utils/formatters';

export const ProcurementRecommendation = ({
  recommendations = [],
  onExecute,
  executingId = null,
  loading = false
}) => {
  const columns = [
    { header: 'Product Item', key: 'productName', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Item SKU', key: 'productCode', cellClassName: 'text-xs text-slate-500 font-mono font-semibold' },
    { 
      header: 'Free To Use Qty', 
      key: 'freeToUseQty',
      cellClassName: 'text-right font-medium text-slate-700',
      render: (row) => formatQuantity(row.freeToUseQty, row.uom)
    },
    { 
      header: 'Shortage Qty', 
      key: 'recommendedQty',
      cellClassName: 'font-semibold text-slate-900 text-right',
      render: (row) => formatQuantity(row.recommendedQty, row.uom)
    },
    {
      header: 'Recommended Action',
      key: 'procurementType',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
          row.procurementType === 'MANUFACTURING' 
            ? 'bg-purple-50 text-purple-700 border-purple-200' 
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {row.procurementType === 'MANUFACTURING' ? 'Recommend MO' : 'Recommend PO'}
        </span>
      )
    },
    {
      header: 'Supplier / Source',
      key: 'source',
      cellClassName: 'font-semibold text-slate-700',
      render: (row) => row.procurementType === 'MANUFACTURING' ? 'Internal Assembly (BoM)' : (row.suggestedVendorName || 'Apex Metal Corp')
    },
    { 
      header: 'Reason', 
      key: 'reason',
      cellClassName: 'text-xs text-slate-500 font-medium',
      render: (row) => row.reason
    },
    {
      header: 'Replenishment Action',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => {
        const isExecuting = executingId === row.id;
        const isMfg = row.procurementType === 'MANUFACTURING';

        return (
          <div className="no-print">
            <button
              onClick={() => onExecute(row)}
              disabled={isExecuting}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 border border-transparent rounded shadow-sm focus:outline-none transition-colors duration-150 ${
                isMfg 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              {isMfg ? (
                <>
                  <Hammer className="w-3.5 h-3.5" />
                  <span>{isExecuting ? 'Triggering...' : 'Schedule Mfg Order'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{isExecuting ? 'Triggering...' : 'Create Draft PO'}</span>
                </>
              )}
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
