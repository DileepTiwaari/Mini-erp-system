// src/components/products/ProductList.jsx
// 
// WHAT IT DOES:
// Renders the catalog list table using a custom DataTable component.
// Organizes columns for SKU, Name, Category, Sales Price, safety Stock buffers,
// procurement sourcing models (purchase/manufacturing), status, and action buttons.
// 
// WHY IT IS REQUIRED:
// 1. Gives users a structured view of all inventory resources in a professional Zoho/Odoo design.
// 2. Integrates the StockBadge directly so controllers spot safety deficits instantly.
// 3. Evaluates role capability matrices dynamically to toggle Edit and Delete triggers.
// 
// WHEN IT IS USED:
// Loaded inside ProductsPage.jsx catalog viewport.

import React from 'react';
import DataTable from '../common/DataTable';
import StockBadge from './StockBadge';
import { formatCurrency, formatQuantity, formatStatus } from '../../utils/formatters';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { checkPermission, ACTIONS, MODULES } from '../../permissions/permissions';

/**
 * WHAT IT DOES: Component presenting products rows.
 * WHY IT IS REQUIRED: Feeds the DataTable layout with custom cell formatting and permission filters.
 * WHEN IT IS USED: Loaded by ProductsPage.jsx.
 */
export const ProductList = ({
  products = [],
  categories = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
  user,
}) => {
  
  // WHAT IT DOES: Resolves category ID to printable label.
  // WHY IT IS REQUIRED: Renders readable category text instead of raw database IDs.
  // WHEN IT IS USED: Evaluated on every category cell render.
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'Unassigned';
  };

  // WHAT IT DOES: Boolean capability check.
  // WHY IT IS REQUIRED: Renders actions dynamically based on permissions.
  // WHEN IT IS USED: Evaluated on list loading.
  const canEdit = user && checkPermission(user.role, MODULES.PRODUCTS, ACTIONS.EDIT);
  const canDelete = user && checkPermission(user.role, MODULES.PRODUCTS, ACTIONS.DELETE);

  // Columns definition list
  const columns = [
    { 
      header: 'SKU', 
      key: 'code', 
      cellClassName: 'font-mono text-xs font-semibold text-slate-800 uppercase' 
    },
    { 
      header: 'Name', 
      key: 'name', 
      cellClassName: 'font-semibold text-slate-800' 
    },
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
      header: 'Stock', 
      key: 'stock',
      render: (row) => {
        const reservedQty = Number(row.reservedQty) || 0;
        const freeToUse = row.stock - reservedQty;
        return (
          <div 
            className="flex items-center gap-2"
            title={`Reserved: ${reservedQty} | Free: ${freeToUse}`}
          >
            <StockBadge stock={row.stock} minStock={row.minStock} />
          </div>
        );
      }
    },
    {
      header: 'Procurement Type',
      key: 'procurementType',
      render: (row) => (
        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase ${
          row.procurementType === 'MANUFACTURING'
            ? 'bg-purple-50 text-purple-700 border-purple-200'
            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
        }`}>
          {row.procurementType || 'PURCHASE'}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase ${
          row.status === 'active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-50 text-slate-500 border-slate-200'
        }`}>
          {row.status || 'active'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end no-print">
          {/* View details */}
          <button
            onClick={() => onView(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {/* Edit product */}
          {canEdit && (
            <button
              onClick={() => onEdit(row)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
              title="Edit Product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* Delete product */}
          {canDelete && (
            <button
              onClick={() => onDelete(row)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
