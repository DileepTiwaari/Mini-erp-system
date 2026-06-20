// src/components/products/ProductDetail.jsx
// View detail sheet displaying product stock metrics.

import React from 'react';
import { formatCurrency, formatQuantity } from '../../utils/formatters';
import StockBadge from './StockBadge';
import { Package, ShieldAlert, BadgeDollarSign, Archive } from 'lucide-react';

export const ProductDetail = ({ product, categoryName }) => {
  if (!product) return null;

  return (
    <div className="space-y-6">
      {/* Code and Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{product.code}</span>
          <h4 className="text-xl font-bold text-slate-800 leading-tight mt-0.5">{product.name}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category & Uom */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100 space-y-3">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Archive className="w-3.5 h-3.5" />
            <span>Categorization</span>
          </h5>
          <div>
            <p className="text-xs text-slate-500">Category Name</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{categoryName || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Unit of Measure (UoM)</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{product.uom}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100 space-y-3">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Pricing Metrics</span>
          </h5>
          <div>
            <p className="text-xs text-slate-500">Sales Price</p>
            <p className="text-sm font-bold text-indigo-700 mt-0.5">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Internal Unit Cost</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatCurrency(product.cost)}</p>
          </div>
        </div>

        {/* Stock status */}
        <div className="p-4 bg-slate-50 rounded border border-slate-100 space-y-3 sm:col-span-2">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Inventory Stock Status</span>
          </h5>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Stock on Hand</p>
              <p className="text-lg font-bold text-slate-800 mt-0.5">{formatQuantity(product.stock, product.uom)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Safety Threshold</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatQuantity(product.minStock, product.uom)}</p>
            </div>
            <div className="self-end">
              <StockBadge stock={product.stock} minStock={product.minStock} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
