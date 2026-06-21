/**
 * PURPOSE:
 * Renders the detailed master specifications of a catalog product.
 *
 * BUSINESS USE:
 * Provides an operational dashboard for inventory controllers to inspect pricing details,
 * safety stock levels, sourcing vendor linkages, and Bill of Materials references.
 *
 * API USAGE:
 * Consumes properties populated from product APIs.
 *
 * LOGIC EXPLANATION:
 * Renders structured info divided into card layouts:
 * - Product Information (SKU, Name, Category, Price, Cost)
 * - Stock Counts (On Hand, Safety Point, Reserved, Free to Use)
 * - Procurement Rules (Type: PURCHASE/MANUFACTURING, Strategy: MTS/MTO, BOM Link)
 * - Sourcing Information (Preferred Vendor Link)
 * Calculates "Free to Use" quantity dynamically as: `Stock - Reserved`.
 */

import React from 'react';
import { formatCurrency, formatQuantity } from '../../utils/formatters';
import StockBadge from './StockBadge';
import { 
  Package, 
  Archive, 
  Layers, 
  Truck, 
  ClipboardList 
} from 'lucide-react';

export const ProductDetail = ({ product, categoryName }) => {
  if (!product) return null;

  // Calculate free-to-use quantity
  const reservedVal = Number(product.reservedQty) || 0;
  const stockVal = Number(product.stock) || 0;
  const freeToUseVal = stockVal - reservedVal;

  return (
    <div className="space-y-6">
      {/* Product Code Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
              {product.code}
            </span>
            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
              product.status === 'active' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              {product.status || 'Active'}
            </span>
          </div>
          <h4 className="text-lg font-bold text-slate-800 leading-tight mt-0.5">
            {product.name}
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Product Information */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3 shadow-sm">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Archive className="w-3.5 h-3.5 text-slate-400" />
            <span>Product Information</span>
          </h5>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Category</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{categoryName || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Description</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5 leading-normal">
              {product.description || 'No description provided.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Sales Price</p>
              <p className="text-sm font-bold text-indigo-700 mt-0.5">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Cost Price</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{formatCurrency(product.cost)}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Stock Information */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3 shadow-sm">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Inventory Information</span>
          </h5>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">On Hand</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{formatQuantity(product.stock, product.uom)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Reorder Point</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{formatQuantity(product.minStock, product.uom)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Reserved</p>
              <p className="text-xs font-semibold text-rose-600 mt-0.5">{formatQuantity(reservedVal, product.uom)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Free To Use</p>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">{formatQuantity(freeToUseVal, product.uom)}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Stock Status</span>
            <StockBadge stock={product.stock} minStock={product.minStock} />
          </div>
        </div>

        {/* Card 3: Procurement Rules */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3 shadow-sm">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
            <span>Procurement Information</span>
          </h5>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Procurement Type</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              {product.procurementType === 'MANUFACTURING' ? 'MANUFACTURING (MO Sourced)' : 'PURCHASE (PO Sourced)'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Strategy</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              {product.procurementStrategy === 'MTO' ? 'Make to Order (MTO)' : 'Make to Stock (MTS)'}
            </p>
          </div>
        </div>

        {/* Card 4: Sourcing / Vendor & BOM details */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3 shadow-sm">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span>Sourcing & BOM Links</span>
          </h5>
          {product.procurementType === 'PURCHASE' ? (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Vendor Information</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {product.vendorId === 'v1' 
                  ? 'Apex Metal Corp (v1)' 
                  : product.vendorId === 'v2'
                    ? 'ElectroParts Distributors (v2)'
                    : product.vendorId === 'v3'
                      ? 'Fastener Direct (v3)'
                      : product.vendorId || 'No Preferred Vendor'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">BoM Information</p>
              <p className="text-xs font-semibold text-blue-600 font-mono mt-0.5">
                {product.bomId || 'Standard BOM Defined'}
              </p>
            </div>
          )}
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Unit UoM</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{product.uom || 'pcs'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
