/**
 * PURPOSE:
 * Displays a color-coded status badge tag for Purchase Orders in FlowERP.
 *
 * BUSINESS USE:
 * Helps procurement staff immediately distinguish between draft RFQs, confirmed orders,
 * partially received materials, fully completed receipts, and cancelled items.
 *
 * API USAGE:
 * None (pure presentational layout element).
 *
 * LOGIC FLOW:
 * Maps status strings (draft, confirmed, partially_received, fully_received, cancelled)
 * to Zoho/Odoo themed Tailwind color classes.
 */

import React from 'react';

// Color classes mapped to each procurement status
const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  partially_received: 'bg-amber-50 text-amber-700 border-amber-200',
  fully_received: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

// User friendly label descriptors
const STATUS_LABELS = {
  draft: 'Draft (RFQ)',
  confirmed: 'Confirmed',
  partially_received: 'Partially Received',
  fully_received: 'Fully Received',
  cancelled: 'Cancelled',
};

export const PurchaseStatusBadge = ({ status }) => {
  const norm = status ? status.toLowerCase() : 'draft';
  const colorClass = STATUS_STYLES[norm] || 'bg-slate-100 text-slate-700 border-slate-200';
  const label = STATUS_LABELS[norm] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      {label}
    </span>
  );
};

export default PurchaseStatusBadge;
