// src/pages/AuditLogsPage.jsx
// Security and traceability audits trail screen (Admin & Owner access).
//
// PURPOSE:
// Displays all database insertions, updates, deletes, and authentication logs.
//
// BUSINESS USE:
// Serves as the compliance and trace audit log to review user operations.
//
// LOGIC:
// Fetches records from localStorage or API, computes multi-criteria filtering client-side
// (module, dates, username, text query), and renders them in a responsive table.

import React, { useState, useEffect } from 'react';
import { auditService } from '../services/dashboardService';
import { useToast } from '../context/ToastContext';
import { ShieldAlert, Search, RefreshCw, X } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import AuditLogTable from '../components/audit/AuditLogTable';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';

export const AuditLogsPage = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  
  // Filters & query states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // UI state managers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await auditService.getLogs();
      setLogs(data || []);
    } catch (err) {
      setError(true);
      showToast('Failed to load system audit logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Compute dynamic lists of unique users and modules in loaded logs for filters
  const uniqueUsers = Array.from(new Set(logs.map((l) => l.userName).filter(Boolean)));
  const modules = ['Sales', 'Purchase', 'Manufacturing', 'Inventory', 'Procurement', 'Authentication'];

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterModule('');
    setFilterUser('');
    setStartDate('');
    setEndDate('');
  };

  // Perform multi-criteria filter computation
  const filteredLogs = logs.filter((log) => {
    // 1. Text Search query matching user, action, details, ref
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      log.userName?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.description?.toLowerCase().includes(q) ||
      log.referenceNumber?.toLowerCase().includes(q);

    // 2. Module categorization matching
    const matchesModule = filterModule ? log.module === filterModule : true;

    // 3. User name matching
    const matchesUser = filterUser ? log.userName === filterUser : true;

    // 4. Date Range boundaries checks
    let matchesDate = true;
    if (log.timestamp) {
      const logTime = new Date(log.timestamp).getTime();
      if (startDate) {
        const start = new Date(startDate + 'T00:00:00').getTime();
        if (logTime < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59').getTime();
        if (logTime > end) matchesDate = false;
      }
    }

    return matchesQuery && matchesModule && matchesUser && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Audit Logs Trail"
        subtitle="Chronological trail of user authentication, operations, and modifications."
        actions={
          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Refresh Logs</span>
          </button>
        }
      />

      {/* Interactive Filters Dashboard Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Text Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by action, user, detail..."
            />
          </div>

          {/* Module Select */}
          <div>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Modules</option>
              {modules.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>

          {/* User Select */}
          <div>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {uniqueUsers.map((usr) => (
                <option key={usr} value={usr}>{usr}</option>
              ))}
            </select>
          </div>

          {/* Date range inputs */}
          <div className="flex items-center gap-2 lg:col-span-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Start Date"
              title="Start Date"
            />
            <span className="text-slate-400 text-xs font-medium">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="End Date"
              title="End Date"
            />
            {(filterModule || filterUser || startDate || endDate || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                title="Reset Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div>
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 flex justify-center items-center shadow-sm">
            <Loader size="lg" label="Loading Activities..." />
          </div>
        ) : error ? (
          <ErrorState onRetry={fetchLogs} />
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No Activities Found</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-4">
              No audit logs matched your specified filter criteria. Please try resetting or relaxing filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-slate-50 border border-slate-200 rounded transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <AuditLogTable logs={filteredLogs} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
