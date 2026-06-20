// src/components/dashboard/RecentActivities.jsx
// 
// WHAT IT DOES:
// Renders an activity timeline feed highlighting recent audit log entries, user logins,
// and record actions (e.g. Sales creation, manufacturing run starts).
// 
// WHY IT IS REQUIRED:
// 1. Provides system transparency, enabling managers to review operational edits quickly.
// 2. Isolates audit listing structures in a reusable dashboard module.
// 
// WHEN IT IS USED:
// Rendered on the Dashboard panel page as a supporting visual layout widget.

import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { FileText, PlusCircle, LogIn, KeyRound } from 'lucide-react';

/**
 * WHAT IT DOES: Timeline visual display component for recent audit events.
 * WHY IT IS REQUIRED: Renders custom icon badges depending on action parameters.
 * WHEN IT IS USED: Loaded by DashboardPage.jsx.
 * 
 * @param {Array} activities - List of recent log items (user, action, description, timestamp).
 */
export const RecentActivities = ({ activities = [] }) => {
  // WHAT IT DOES: Maps technical action labels to lucide icon markers.
  // WHY IT IS REQUIRED: Enhances comprehension by prefixing actions with themed badges.
  // WHEN IT IS USED: Called on item render lists.
  const getActionIcon = (action) => {
    const act = action.toLowerCase();
    if (act.includes('login')) return <LogIn className="w-4 h-4 text-emerald-600" />;
    if (act.includes('create') || act.includes('add')) return <PlusCircle className="w-4 h-4 text-brand-600" />;
    if (act.includes('role') || act.includes('permission')) return <KeyRound className="w-4 h-4 text-amber-600" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Recent System Activity</h3>
      
      {activities.length === 0 ? (
        <p className="text-slate-400 text-sm italic p-4 text-center">No recent activities logged.</p>
      ) : (
        <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[300px] pr-2">
          {activities.map((act) => (
            <div key={act.id} className="py-3 flex items-start gap-3">
              {/* Event Icon Badge */}
              <div className="p-1.5 bg-slate-50 rounded border border-slate-100 mt-0.5">
                {getActionIcon(act.action)}
              </div>
              
              {/* Timeline Context Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 flex justify-between gap-2">
                  <span>{act.user}</span>
                  <span className="text-slate-400 font-normal">{formatRelativeTime(act.timestamp)}</span>
                </p>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5" title={act.description}>
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
