// src/hooks/usePagination.js
// React Hook to manage pagination states.
// Consolidates currentPage, pageSize, and calculation of offset and limits for ERP lists.

import { useState, useCallback } from 'react';

export const usePagination = (initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const setPage = useCallback((page) => {
    if (page < 1) return;
    setCurrentPage(page);
  }, []);

  const changePageSize = useCallback((size) => {
    const newSize = Number(size) || 10;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    setPage,
    changePageSize,
    resetPagination,
  };
};

export default usePagination;
