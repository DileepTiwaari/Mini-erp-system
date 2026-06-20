// src/components/inventory/StockTable.jsx
// Displays safety stock quantities, reserved allocations, free-to-use counts, and valuation costs.
// Purpose: Renders standard inventory levels.
// Business Use: Informs inventory managers of stock levels, reservations, reorder alerts, and capital valuation.
// API Usage: Reads localized products data.

import React from 'react';
import DataTable from '../common/DataTable';
import StockBadge from '../products/StockBadge';
import { formatCurrency, formatQuantity } from '../../utils/formatters';

export const StockTable = ({
  products = [],
  categories = [],
  loading = false,
}) => {
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'N/A';
  };

  const columns = [
    { header: 'SKU Code', key: 'code', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Product Item', key: 'name', cellClassName: 'font-semibold text-slate-700' },
    { 
      header: 'Category', 
      key: 'categoryId',
      render: (row) => getCategoryName(row.categoryId)
    },
    { 
      header: 'On Hand Qty', 
      key: 'stock',
      cellClassName: 'text-right font-semibold',
      render: (row) => formatQuantity(row.stock, row.uom)
    },
    { 
      header: 'Reserved Qty', 
      key: 'reservedQty',
      cellClassName: 'text-right text-slate-500 font-medium',
      render: (row) => formatQuantity(row.reservedQty || 0, row.uom)
    },
    { 
      header: 'Free To Use Qty', 
      key: 'freeToUseQty',
      cellClassName: 'text-right font-semibold text-indigo-600',
      render: (row) => {
        const freeToUse = row.freeToUseQty !== undefined ? row.freeToUseQty : (row.stock - (row.reservedQty || 0));
        return formatQuantity(freeToUse, row.uom);
      }
    },
    { 
      header: 'Reorder Point', 
      key: 'minStock',
      cellClassName: 'text-right text-slate-500',
      render: (row) => formatQuantity(row.minStock, row.uom)
    },
    { 
      header: 'Unit Cost', 
      key: 'cost',
      cellClassName: 'text-right',
      render: (row) => formatCurrency(row.cost)
    },
    { 
      header: 'Inventory Value', 
      key: 'totalValue',
      cellClassName: 'text-right font-bold text-slate-800',
      render: (row) => formatCurrency(row.stock * row.cost)
    },
    { 
      header: 'Alert Status', 
      key: 'alert',
      cellClassName: 'text-center',
      render: (row) => {
        const freeToUse = row.freeToUseQty !== undefined ? row.freeToUseQty : (row.stock - (row.reservedQty || 0));
        return <StockBadge stock={freeToUse} minStock={row.minStock} />;
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      emptyMessage="No inventory stock logs."
    />
  );
};

export default StockTable;
