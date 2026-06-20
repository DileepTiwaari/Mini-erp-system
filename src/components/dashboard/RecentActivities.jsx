/**
 * PURPOSE:
 * Displays a vertical chronological activity feed of operations audit events.
 *
 * WHY:
 * Enhances security and cross-department transparency, allowing business owners to monitor
 * log updates (Sales created, Purchases approved, Stock changes) as they happen.
 *
 * API:
 * GET /api/v1/dashboard/recent-activities
 *
 * LOGIC USED:
 * Iterates through a logs array to display description/action, user profile, and timestamp.
 * Uses utility helpers to format ISO timestamps relative to current time.
 */

import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { ShoppingCart, CheckSquare, Settings, AlertCircle, Wrench } from 'lucide-react';

export const RecentActivities = ({ activities = [] }) => {
  // Utility maps categories to colored icons
  const getActivityMeta = (action) => {
    const act = (action || '').toLowerCase();
    if (act.includes('sales') || act.includes('so')) {
      return { icon: ShoppingCart, colorClass: 'bg-blue-50 text-blue-600 border-blue-100' };
    }
    if (act.includes('purchase') || act.includes('po') || act.includes('approve')) {
      return { icon: CheckSquare, colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    }
    if (act.includes('mfg') || act.includes('mo') || act.includes('manufacturing')) {
      return { icon: Wrench, colorClass: 'bg-purple-50 text-purple-600 border-purple-100' };
    }
    if (act.includes('stock') || act.includes('inventory')) {
      return { icon: AlertTriangleIcon, colorClass: 'bg-amber-50 text-amber-600 border-amber-100' };
    }
    return { icon: Settings, colorClass: 'bg-slate-50 text-slate-650 border-slate-100' };
  };

  const AlertTriangleIcon = AlertCircle;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Recent Activity Timeline
      </h3>

      {activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-slate-400 text-xs italic text-center">No recent activities logged.</p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-slate-150 flex-1 overflow-y-auto max-h-[300px] pr-1">
          {activities.map((act, idx) => {
            const meta = getActivityMeta(act.action);
            const Icon = meta.icon;
            
            return (
              <div 
                key={act.id || idx} 
                className={`pt-3 flex items-start gap-3 text-xs ${idx === 0 ? 'pt-0 border-t-0' : ''}`}
              >
                {/* Event Type Icon Badge */}
                <div className={`p-1.5 rounded-lg border flex-shrink-0 ${meta.colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                
                {/* Event Context Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 leading-normal" title={act.description}>
                    {act.description || act.action}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span className="font-medium text-slate-500">By: {act.user}</span>
                    <span>{formatRelativeTime(act.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
