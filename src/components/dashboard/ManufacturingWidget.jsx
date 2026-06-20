/**
 * PURPOSE:
 * Displays active shop floor execution statistics (Open, In Progress, and Completed orders).
 *
 * WHY:
 * Provides a high-level overview of factory capacity load and order completions for the operations manager.
 *
 * API:
 * GET /api/v1/dashboard/manufacturing-summary
 *
 * LOGIC USED:
 * Receives counts for open, running, and done manufacturing runs and displays them inside
 * a balanced three-column grid layout with clean blue and slate borders.
 */

import React from 'react';
import { Hammer, Play, CheckCircle } from 'lucide-react';

export const ManufacturingWidget = ({ summary = { openCount: 0, inProgressCount: 0, completedTodayCount: 0 } }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Shop Floor Status
      </h3>
      
      <div className="grid grid-cols-3 gap-3 flex-1 items-center">
        {/* Open/Planned Orders Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
          <div className="p-1 bg-slate-200 text-slate-600 rounded-full w-fit mx-auto mb-2">
            <Hammer className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{summary.openCount || 0}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Open MOs</p>
        </div>

        {/* In Progress Orders Card */}
        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
          <div className="p-1 bg-blue-100 text-blue-600 rounded-full w-fit mx-auto mb-2">
            <Play className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{summary.inProgressCount || 0}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Running</p>
        </div>

        {/* Completed Today Orders Card */}
        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-center">
          <div className="p-1 bg-emerald-100 text-emerald-600 rounded-full w-fit mx-auto mb-2">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{summary.completedTodayCount || 0}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Completed</p>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingWidget;
