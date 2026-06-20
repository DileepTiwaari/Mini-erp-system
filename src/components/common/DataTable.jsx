// src/components/common/DataTable.jsx
// Data Table layout.
// Automatically displays table headers, loading spinners, and empty states.
// Fully responsive on smaller devices by using horizontal scrolling containers.

import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';

export const DataTable = ({
  columns,
  data,
  loading = false,
  loadingLabel = 'Loading...',
  emptyMessage = 'No records found',
  onRowClick,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 flex justify-center items-center shadow-sm">
        <Loader size="md" label={loadingLabel} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 font-semibold text-slate-700">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  scope="col"
                  className={`px-6 py-4 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors duration-150 ${
                  onRowClick ? 'hover:bg-slate-50 cursor-pointer' : ''
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key || colIndex}
                    className={`px-6 py-4 whitespace-nowrap align-middle ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
