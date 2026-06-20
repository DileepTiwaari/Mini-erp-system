// src/components/dashboard/RecentActivities.jsx
// Audit logs list display for dashboard summary.

import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { FileText, PlusCircle, LogIn, KeyRound } from 'lucide-react';

export const RecentActivities = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    const act = action.toLowerCase();
    if (act.includes('login')) return <LogIn className="w-4 h-4 text-emerald-600" />;
    if (act.includes('create') || act.includes('add')) return <PlusCircle className="w-4 h-4 text-brand-600" />;
    if (act.includes('role') || act.includes('permission')) return <KeyRound className="w-4 h-4 text-amber-600" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Recent System Activity</h3>
      
      {activities.length === 0 ? (
        <p className="text-slate-500 text-sm italic p-4 text-center">No recent activities logged.</p>
      ) : (
        <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-64 pr-2">
          {activities.map((act) => (
            <div key={act.id} className="py-3 flex items-start gap-3">
              <div className="p-1.5 bg-slate-50 rounded border border-slate-100 mt-0.5">
                {getActionIcon(act.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 flex justify-between gap-2">
                  <span>{act.user}</span>
                  <span className="text-slate-400 font-normal">{formatRelativeTime(act.timestamp)}</span>
                </p>
                <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
