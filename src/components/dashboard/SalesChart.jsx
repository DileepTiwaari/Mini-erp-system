// src/components/dashboard/SalesChart.jsx
// Lightweight, responsive custom SVG Bar Chart.
// Avoids heavy charting packages to maintain React 19 compatibility.

import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export const SalesChart = ({ data = [], title = 'Weekly Sales Revenue' }) => {
  const maxVal = Math.max(...data.map(d => d.amount), 1000);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-semibold text-slate-700 mb-6 uppercase tracking-wider">{title}</h3>
      
      {/* Chart workspace */}
      <div className="flex-1 flex items-end gap-3 h-48 sm:gap-6 pt-4 border-b border-slate-200 px-2">
        {data.map((item, index) => {
          // Calculate percentage height
          const barHeightPercent = Math.max((item.amount / maxVal) * 100, 4);

          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip on hover */}
              <div className="absolute -top-6 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow font-semibold">
                {formatCurrency(item.amount)}
              </div>

              {/* Bar */}
              <div
                style={{ height: `${barHeightPercent}%` }}
                className="w-full bg-brand-500 hover:bg-brand-600 rounded-t-sm transition-all duration-300"
              />

              {/* X Axis Label */}
              <span className="text-xs text-slate-500 font-semibold mt-2 pt-1">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesChart;
