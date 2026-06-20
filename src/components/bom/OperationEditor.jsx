// src/components/bom/OperationEditor.jsx
// Displays a sequence of operational routes for manufacturing production, read from the BoM routing.
// Purpose: Displays routing steps dynamically.
// Business Use: Provides a process plan showing what work centers are visited and step durations.
// API Usage: Reads localized work centers.

import React from 'react';
import { Hammer, Shuffle, Clock } from 'lucide-react';

export const OperationEditor = ({ bom, workCenters = [] }) => {
  if (!bom) return null;

  // Use routing operations from BoM, sort by sequence order
  const routingSteps = bom.operations && bom.operations.length > 0 
    ? [...bom.operations].sort((a, b) => a.sequence - b.sequence)
    : [];

  const getWcName = (wcId) => {
    const wc = workCenters.find(w => w.id === wcId || w.code === wcId);
    return wc ? `${wc.name} (${wc.code})` : 'Assembly Floor';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
        <Shuffle className="w-4 h-4 text-slate-500" />
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manufacturing Operations Routing (Steps)</h5>
      </div>

      {routingSteps.length === 0 ? (
        <p className="text-slate-400 text-xs italic p-4 bg-slate-50 rounded border border-slate-200 text-center">
          No routing operation steps configured for this Bill of Materials.
        </p>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
          {routingSteps.map((op, idx) => (
            <div key={idx} className="relative">
              {/* Sequence step number badge */}
              <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-brand-50 border-2 border-brand-500 flex items-center justify-center text-xs font-bold text-brand-600">
                {op.sequence}
              </div>

              {/* Step info block */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <p className="font-semibold text-slate-800 text-sm">{op.name}</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <span>{op.durationMinutes} minutes</span>
                  </span>
                </div>
                <p className="text-slate-500 font-semibold flex items-center gap-1">
                  <Hammer className="w-3.5 h-3.5" />
                  <span>Work Center: {getWcName(op.workCenterId)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperationEditor;
