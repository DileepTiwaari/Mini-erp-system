/**
 * PURPOSE:
 * Renders the products master list data table.
 *
 * BUSINESS USE:
 * Displays corporate inventory lists including SKU, Category, Price, Stock status,
 * procurement type, and actions (View, Edit, Delete), wrapping them in a standard data grid.
 *
 * API USAGE:
 * Receives filtered data values loaded by products APIs.
 *
 * LOGIC EXPLANATION:
 * Feeds a customized columns array to the common DataTable component.
 * Maps category IDs to category name labels, formats price numbers as currency,
 * triggers the StockBadge color checks, and restricts Edit and Delete buttons
 * to authorized roles. Displays "Free to use" details on hover.
 */

import React from 'react';
import DataTable from '../common/DataTable';
import StockBadge from './StockBadge';
import { formatCurrency } from '../../utils/formatters';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { checkPermission, ACTIONS, MODULES } from '../../permissions/permissions';

export const ProductList = ({
  products = [],
  categories = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
  user,
}) => {
  
  // Maps category ID to category name label
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'Unassigned';
  };

  // RBAC permission capability flags
  const canEdit = user && checkPermission(user.role, MODULES.PRODUCTS, ACTIONS.EDIT);
  const canDelete = user && checkPermission(user.role, MODULES.PRODUCTS, ACTIONS.DELETE);

  // Columns layout definitions list
  const columns = [
    { 
      header: 'SKU', 
      key: 'code', 
      cellClassName: 'font-mono text-xs font-semibold text-slate-800 uppercase' 
    },
    { 
      header: 'Name', 
      key: 'name', 
      cellClassName: 'font-semibold text-slate-850' 
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
            title={`Reserved: ${reservedQty} | Free to Use: ${freeToUse} ${row.uom || 'pcs'}`}
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
          <button
            onClick={() => onView(row)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {canEdit && (
            <button
              onClick={() => onEdit(row)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
              title="Edit Product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

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
