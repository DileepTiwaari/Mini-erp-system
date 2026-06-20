// src/pages/ProcurementPage.jsx
// Procurement planning workspace. Handles material recommendations and auto-PO triggers.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import procurementService from '../services/procurementService';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

// Components
import PageHeader from '../components/common/PageHeader';
import ShortageAlert from '../components/procurement/ShortageAlert';
import ProcurementRecommendation from '../components/procurement/ProcurementRecommendation';
import ProcurementCard from '../components/procurement/ProcurementCard';

export const ProcurementPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState(null);

  // Layout mode: 'list' | 'grid'
  const [layoutMode, setLayoutMode] = useState('list');

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await procurementService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      showToast('Failed to load replenishment suggestions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleExecuteProcurement = async (rec) => {
    try {
      setExecutingId(rec.id);
      const res = await procurementService.executeProcurement(rec);
      showToast(`Draft Purchase Order ${res.purchaseOrderNumber} generated for ${rec.suggestedVendorName}!`, 'success');
      // Refresh list (since the PO is generated, stock may be incoming, or recommendations updated)
      fetchRecommendations();
    } catch (err) {
      showToast('Failed to generate purchase order.', 'error');
    } finally {
      setExecutingId(null);
    }
  };

  const canExecute = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Shortage warnings */}
      <ShortageAlert count={recommendations.length} />

      {/* Header */}
      <PageHeader
        title="Replenishment & Procurement"
        subtitle="Automated reorder suggestions triggered by safety safety buffer thresholds."
        actions={
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setLayoutMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                layoutMode === 'list'
                  ? 'bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
            >
              Card Grid View
            </button>
          </div>
        }
      />

      {/* Recommendations content */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 flex justify-center items-center shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-brand-600" />
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm">
          <p className="text-slate-500 font-semibold text-sm">Perfect! No shortages detected in the catalog.</p>
          <Link to="/inventory" className="text-xs text-brand-600 hover:underline mt-2 inline-block font-semibold">
            Go to warehouse stock
          </Link>
        </div>
      ) : layoutMode === 'list' ? (
        <ProcurementRecommendation
          recommendations={recommendations}
          onExecute={handleExecuteProcurement}
          executingId={executingId}
          loading={loading}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <ProcurementCard
              key={rec.id}
              rec={rec}
              onExecute={handleExecuteProcurement}
              isExecuting={executingId === rec.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcurementPage;
