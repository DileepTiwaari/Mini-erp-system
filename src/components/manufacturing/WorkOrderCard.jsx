// src/components/manufacturing/WorkOrderCard.jsx
// Render card for subtasks in the Kanban board.
// Purpose: Displays work order details and controls.
// Business Use: Informs operators of specific routing steps and allows updating task states.
// API Usage: Fires status update callbacks to parent container.

import React from 'react';
import { Hammer, Clock, Play, Check, AlertTriangle, RefreshCw } from 'lucide-react';

export const WorkOrderCard = ({ wo, moNumber, workCenterName, onStatusChange }) => {
  const status = (wo.status || 'pending').toLowerCase();

  return (
    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm space-y-3 hover:border-slate-300 transition-colors">
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{moNumber}</span>
        <h5 className="text-sm font-semibold text-slate-800 leading-tight mt-0.5">{wo.name}</h5>
      </div>

      {/* Details */}
      <div className="text-xs text-slate-500 space-y-1.5 font-medium">
        <p className="flex items-center gap-1.5">
          <Hammer className="w-3.5 h-3.5 text-slate-400" />
          <span>Station: {workCenterName}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Duration: {wo.durationPlanned} mins</span>
        </p>
      </div>

      {/* Simple Control Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 justify-end no-print">
        {(status === 'planned' || status === 'pending') && (
          <>
            <button
              onClick={() => onStatusChange(wo.id, 'BLOCKED')}
              className="px-2 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Block</span>
            </button>
            <button
              onClick={() => onStatusChange(wo.id, 'IN_PROGRESS')}
              className="px-2.5 py-1 text-[10px] font-bold text-white bg-brand-600 hover:bg-brand-700 rounded flex items-center gap-1 shadow-sm"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Start</span>
            </button>
          </>
        )}

        {status === 'in_progress' && (
          <>
            <button
              onClick={() => onStatusChange(wo.id, 'BLOCKED')}
              className="px-2 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Block</span>
            </button>
            <button
              onClick={() => onStatusChange(wo.id, 'DONE')}
              className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3 h-3" />
              <span>Complete</span>
            </button>
          </>
        )}

        {status === 'blocked' && (
          <button
            onClick={() => onStatusChange(wo.id, 'PENDING')}
            className="px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Unlock</span>
          </button>
        )}

        {(status === 'done' || status === 'completed') && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
            <Check className="w-3 h-3" />
            <span>Completed</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkOrderCard;
// Also mock WorkOrderBoard in this file or compile-safe link
