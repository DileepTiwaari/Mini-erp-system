// src/components/common/StatusBadge.jsx
// Visual pill component for resource state presentation in FlowERP.
// Binds technical statuses to their respective colors dynamically using the defined constants.

import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';
import { formatStatus } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  const colorClass = STATUS_COLORS[normalizedStatus] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
