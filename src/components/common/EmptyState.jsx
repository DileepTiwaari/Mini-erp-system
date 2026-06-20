// src/components/common/EmptyState.jsx
// Visual component to render when data lists are empty.
// Prompts users visually with a clean icon.

import React from 'react';
import { ArchiveRestore } from 'lucide-react';

export const EmptyState = ({
  title = 'No Data Available',
  message = 'There are no active records in this list.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
        <ArchiveRestore className="w-10 h-10" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-normal">
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
