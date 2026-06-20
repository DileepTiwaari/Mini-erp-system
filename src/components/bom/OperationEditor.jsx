// src/components/bom/OperationEditor.jsx
// Displays a sequence of operational routes for manufacturing production.

import React from 'react';
import { Hammer, Shuffle, ArrowRight } from 'lucide-react';

export const OperationEditor = ({ workCenters = [] }) => {
  // Pre-configured routing sequences for Electric Motors or assemblies
  const mockOperations = [
    { step: 1, name: 'Component Pre-staging', wcId: 'wc1', duration: '60 minutes', description: 'Retrieve steel plates and bolts from warehouse inventory, pre-stage component quantities at shearing center.' },
    { step: 2, name: 'Coil Winding & Assembly', wcId: 'wc2', duration: '120 minutes', description: 'Execute copper windings on magnetic coils. Assemble core components into frame.' },
    { step: 3, name: 'Final Inspection & Test', wcId: 'wc3', duration: '45 minutes', description: 'Run electrical continuity checks and motor test loops. Process inspection report and signoff.' },
  ];

  const getWcName = (wcId) => {
    const wc = workCenters.find(w => w.id === wcId);
    return wc ? `${wc.name} (${wc.code})` : 'Assembly floor';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
        <Shuffle className="w-4 h-4 text-slate-500" />
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manufacturing Operations Routing</h5>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
        {mockOperations.map((op) => (
          <div key={op.step} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-brand-50 border-2 border-brand-500 flex items-center justify-center text-xs font-bold text-brand-600">
              {op.step}
            </div>

            {/* Content card */}
            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs">
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className="font-semibold text-slate-800 text-sm">{op.name}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                  {op.duration}
                </span>
              </div>
              <p className="text-slate-500 font-semibold flex items-center gap-1 mb-2">
                <Hammer className="w-3.5 h-3.5" />
                <span>Station: {getWcName(op.wcId)}</span>
              </p>
              <p className="text-slate-600 font-medium leading-relaxed">{op.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationEditor;
