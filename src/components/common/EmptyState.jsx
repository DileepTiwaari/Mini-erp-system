// src/components/common/EmptyState.jsx
// Professional empty state placeholder component.
// Renders when data lists are empty, API returns null/[], or modules are unavailable.

import React from 'react';
import { ArchiveRestore, Inbox, Package, Clock, Server, FileX } from 'lucide-react';

const iconMap = {
  archive: ArchiveRestore,
  inbox: Inbox,
  package: Package,
  clock: Clock,
  server: Server,
  file: FileX,
};

export const EmptyState = ({
  icon = 'inbox',
  title = 'No Records Available',
  message = 'No data has been created yet. Create your first record to get started.',
  action,
  compact = false,
}) => {
  const IconComponent = typeof icon === 'string' ? (iconMap[icon] || Inbox) : icon;
  
  return (
    <div className={`flex flex-col items-center justify-center text-center bg-white rounded-lg ${compact ? 'p-8' : 'p-12'}`}>
      <div className={`${compact ? 'p-3' : 'p-4'} bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400 rounded-full mb-4 border border-slate-200/60`}>
        <IconComponent className={`${compact ? 'w-8 h-8' : 'w-10 h-10'}`} />
      </div>
      <h3 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-slate-800 mb-1`}>{title}</h3>
      <p className={`text-slate-500 ${compact ? 'text-xs' : 'text-sm'} max-w-sm mb-6 leading-relaxed`}>
        {message}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
