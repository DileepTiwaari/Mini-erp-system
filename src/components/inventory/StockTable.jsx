// src/components/inventory/StockTable.jsx
// Displays safety stock quantities, valuation cost, and replenishment alerts.

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
    { header: 'Product Item', key: 'name', cellClassName: 'font-semibold' },
    { 
      header: 'Category', 
      key: 'categoryId',
      render: (row) => getCategoryName(row.categoryId)
    },
    { 
      header: 'Stock Level', 
      key: 'stock',
      render: (row) => (
        <span className="font-semibold text-slate-800">{formatQuantity(row.stock, row.uom)}</span>
      )
    },
    { 
      header: 'Minimum Limit', 
      key: 'minStock',
      render: (row) => formatQuantity(row.minStock, row.uom)
    },
    { 
      header: 'Unit Cost', 
      key: 'cost',
      render: (row) => formatCurrency(row.cost)
    },
    { 
      header: 'Total Value', 
      key: 'id',
      render: (row) => formatCurrency(row.stock * row.cost)
    },
    { 
      header: 'Replenishment Alert', 
      key: 'id',
      render: (row) => <StockBadge stock={row.stock} minStock={row.minStock} /> 
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
