// src/components/common/Pagination.jsx
// Core pagination controller.
// Shows current indexing positions and binds page transitions.

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white border border-slate-200 border-t-0 rounded-b-lg px-6 py-4 flex items-center justify-between shadow-sm text-sm text-slate-600 no-print">
      {/* Paging summary */}
      <div>
        Showing <span className="font-semibold text-slate-800">{startRange}</span> to{' '}
        <span className="font-semibold text-slate-800">{endRange}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> records
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors duration-150"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors duration-150"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
