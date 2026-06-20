// src/components/dashboard/SalesChart.jsx
// 
// WHAT IT DOES:
// Renders a monthly sales bar chart using the Recharts library. It provides
// tooltips, custom grids, and responsive viewport sizing.
// 
// WHY IT IS REQUIRED:
// 1. Presents sales trend information visually, allowing business operators to understand monthly revenue instantly.
// 2. Simplifies scaling: the chart inputs are structured as standard JSON arrays, matching subsequent Spring Boot reporting APIs.
// 3. Implements standard accessibility features (like hover tooltips and clear high-contrast grids).
// 
// WHEN IT IS USED:
// Rendered on the Dashboard page in the primary analytics panel.

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

/**
 * WHAT IT DOES: Renders a monthly bar chart detailing sales data.
 * WHY IT IS REQUIRED: Feeds the UI dashboard with high-fidelity analytics.
 * WHEN IT IS USED: Loaded in DashboardPage.jsx.
 * 
 * @param {Array} data - Array of monthly sales data objects containing 'month' and 'amount'.
 * @param {string} title - Label displaying chart header description.
 */
export const SalesChart = ({ data = [], title = 'Monthly Sales Overview' }) => {
  
  // WHAT IT DOES: Custom tooltip formatting callback to parse numeric values into standard Currency strings.
  // WHY IT IS REQUIRED: Renders clean formatted currency inside hover tooltips.
  // WHEN IT IS USED: Triggered whenever the user hovers over a bar indicator.
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-md shadow-lg border border-slate-700 text-xs font-semibold">
          <p className="text-slate-400">{payload[0].payload.month}</p>
          <p className="text-brand-400 mt-1">
            Revenue: <span className="text-white">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">
        {title}
      </h3>
      
      {/* 
        ResponsiveContainer automatically checks parent container dimensions and fits 
        chart elements dynamically.
      */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            {/* 
              CartesianGrid adds background reference grid lines.
              strokeDasharray="3 3" makes the lines dotted for sleek dashboard layout.
            */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            
            {/* XAxis binds month fields on bottom line */}
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            
            {/* YAxis shows revenue scaling, formatted with simple numbers */}
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            
            {/* Tooltip displays exact amount values on hover */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            
            {/* 
              Bar displays actual metrics. 
              Using Slate-900 (#1e293b) or brand primary (#2563eb) color for professional Odoo style.
              radius={[4, 4, 0, 0]} curves the top corners of each bar.
            */}
            <Bar 
              dataKey="amount" 
              fill="#2563eb" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
