// src/components/procurement/ShortageAlert.jsx
// Displays a top-level alert explaining shortage count and safety safety stocking rules.

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ShortageAlert = ({ count = 0 }) => {
  if (count === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg flex items-start gap-3 mb-6 no-print">
      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="text-sm font-semibold">Automated Replenishment Alert</h4>
        <p className="text-xs text-amber-700 mt-0.5 leading-normal">
          We detected <span className="font-bold">{count} items</span> that have dropped below safety thresholds. You can generate draft Purchase Orders to reorder them immediately from suggested suppliers in standalone mode.
        </p>
      </div>
    </div>
  );
};

export default ShortageAlert;
