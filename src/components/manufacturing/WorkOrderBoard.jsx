// src/components/manufacturing/WorkOrderBoard.jsx
// Kanban board displaying subtasks (Work Orders) across state columns.

import React from 'react';
import WorkOrderCard from './WorkOrderCard';
import { ClipboardList, Play, CheckCircle, AlertTriangle } from 'lucide-react';

export const WorkOrderBoard = ({
  workOrders = [],
  manufacturingOrders = [],
  workCenters = [],
  onStatusChange
}) => {
  const getMoNumber = (moId) => {
    const mo = manufacturingOrders.find(m => m.id === moId);
    return mo ? mo.moNumber : 'MO-N/A';
  };

  const getWcName = (wcId) => {
    const wc = workCenters.find(w => w.id === wcId);
    return wc ? wc.name : 'Shop floor';
  };

  // Group work orders by status
  const columns = [
    { id: 'planned', title: 'Planned Work', icon: ClipboardList, color: 'border-t-slate-400 bg-slate-50' },
    { id: 'in_progress', title: 'In Progress', icon: Play, color: 'border-t-blue-500 bg-blue-50/20' },
    { id: 'blocked', title: 'Blocked / Delayed', icon: AlertTriangle, color: 'border-t-amber-500 bg-amber-50/30' },
    { id: 'done', title: 'Done', icon: CheckCircle, color: 'border-t-emerald-500 bg-emerald-50/20' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {columns.map((col) => {
        const colWos = workOrders.filter(w => w.status === col.id);
        const Icon = col.icon;

        return (
          <div key={col.id} className="flex flex-col h-full bg-slate-100 rounded-lg border border-slate-200">
            {/* Column Header */}
            <div className={`p-4 rounded-t-lg border-t-4 border-b border-slate-200 flex items-center justify-between gap-3 ${col.color}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{col.title}</span>
              </h4>
              <span className="bg-white border border-slate-300 text-xs px-2 py-0.5 rounded-full font-bold text-slate-600">
                {colWos.length}
              </span>
            </div>

            {/* Column body */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[30rem] min-h-[15rem]">
              {colWos.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-8">Empty column</p>
              ) : (
                colWos.map((wo) => (
                  <WorkOrderCard
                    key={wo.id}
                    wo={wo}
                    moNumber={getMoNumber(wo.moId)}
                    workCenterName={getWcName(wo.workCenterId)}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkOrderBoard;
