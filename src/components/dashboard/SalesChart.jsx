/**
 * PURPOSE:
 * Displays a monthly sales bar chart using the Recharts library.
 *
 * WHY:
 * Provides a clear, non-cluttered visualization of sales revenue trends over time,
 * assisting business owners in reviewing operational growth.
 *
 * API:
 * GET /api/v1/dashboard/sales-summary
 *
 * LOGIC USED:
 * Maps an array of `{ month: string, sales: number }` items using Recharts components.
 * Employs a custom tooltip to format values as currency, and a responsive container to adjust sizing.
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const SalesChart = ({ data = [], title = 'Monthly Sales Revenue' }) => {
  
  // Custom Tooltip component for Recharts rendering
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-850 text-white p-2.5 rounded border border-slate-700 text-xs font-semibold">
          <p className="text-slate-400">{payload[0].payload.month}</p>
          <p className="text-blue-400 mt-0.5">
            Sales: <span className="text-white">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">
        {title}
      </h3>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar 
              dataKey="sales" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
