// src/pages/ProcurementPage.jsx
// Procurement planning workspace. Handles material recommendations and auto-PO triggers.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import procurementService from '../services/procurementService';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import ShortageAlert from '../components/procurement/ShortageAlert';
import ProcurementRecommendation from '../components/procurement/ProcurementRecommendation';
import ProcurementCard from '../components/procurement/ProcurementCard';

export const ProcurementPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [executingId, setExecutingId] = useState(null);

  // Layout mode: 'list' | 'grid'
  const [layoutMode, setLayoutMode] = useState('list');

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await procurementService.getRecommendations();
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[ProcurementPage] fetch failed:', err.message);
      setRecommendations([]);
      setError(true);
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
      if (rec.procurementType === 'MANUFACTURING') {
        showToast(`Planned Manufacturing Order ${res.manufacturingOrderNumber} scheduled successfully!`, 'success');
      } else {
        showToast(`Draft Purchase Order ${res.purchaseOrderNumber} generated for ${rec.suggestedVendorName}!`, 'success');
      }
      // Refresh list
      fetchRecommendations();
    } catch (err) {
      showToast('Failed to execute replenishment action.', 'error');
    } finally {
      setExecutingId(null);
    }
  };

  const canExecute = user?.role === 'admin' || user?.role === 'manager';

  // Render Check: Service unavailable — show professional placeholder
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Replenishment & Procurement"
          isDemo={true}
          subtitle="Automated reorder suggestions triggered by safety buffer thresholds."
        />
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <EmptyState
            icon="server"
            title="Procurement Module"
            message="Procurement recommendations are currently unavailable. Connect the procurement service to enable automated reorder suggestions."
            action={
              <button
                onClick={fetchRecommendations}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded shadow-sm transition-colors duration-150"
              >
                Retry Connection
              </button>
            }
          />
        </div>
      </div>
    );
  }

  // Render Check: Loading state — uses standardised Loader component
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Analyzing procurement requirements..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shortage warnings */}
      <ShortageAlert count={recommendations.length} />

      {/* Header */}
      <PageHeader
        title="Replenishment & Procurement"
        isDemo={true}
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
      {recommendations.length === 0 ? (
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
