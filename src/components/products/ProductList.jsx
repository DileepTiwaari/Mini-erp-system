// src/components/products/ProductList.jsx
// Displays a list of products with safety stock indicators.

import React from 'react';
import DataTable from '../common/DataTable';
import StockBadge from './StockBadge';
import { formatCurrency, formatQuantity } from '../../utils/formatters';
import { Edit2, Trash2, Eye } from 'lucide-react';

export const ProductList = ({
  products = [],
  categories = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
  userRole,
}) => {
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? `${cat.name} (${cat.code})` : 'Unassigned';
  };

  // Determine permissions
  const canEdit = userRole === 'admin' || userRole === 'manager';

  const columns = [
    { header: 'Item Code', key: 'code', cellClassName: 'font-semibold text-slate-800' },
    { header: 'Product Name', key: 'name', cellClassName: 'font-semibold' },
    { 
      header: 'Category', 
      key: 'categoryId',
      render: (row) => getCategoryName(row.categoryId)
    },
    { 
      header: 'Sales Price', 
      key: 'price',
      render: (row) => formatCurrency(row.price)
    },
    { 
      header: 'Unit Cost', 
      key: 'cost',
      render: (row) => formatCurrency(row.cost)
    },
    { 
      header: 'Stock Status', 
      key: 'stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{formatQuantity(row.stock, row.uom)}</span>
          <StockBadge stock={row.stock} minStock={row.minStock} />
        </div>
      )
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
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(row)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                title="Edit Product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(row)}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
                title="Delete Product"
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
      data={products}
      loading={loading}
      emptyMessage="No products found in the catalog."
    />
  );
};

export default ProductList;
