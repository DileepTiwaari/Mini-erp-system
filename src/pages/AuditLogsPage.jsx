// src/pages/AuditLogsPage.jsx
// Security and traceability audits screen (Admin only).

import React, { useState, useEffect } from 'react';
import { auditService } from '../services/dashboardService';
import { useToast } from '../context/ToastContext';

// Components
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import AuditLogTable from '../components/audit/AuditLogTable';

export const AuditLogsPage = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await auditService.getLogs();
      setLogs(data);
    } catch (err) {
      showToast('Failed to load system audit logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Audit Logs Trail"
        subtitle="Chronological trail of user authentication, operations, and modifications."
        actions={
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search audits..." />
        }
      />

      {/* List Table */}
      <AuditLogTable logs={filteredLogs} loading={loading} />
    </div>
  );
};

export default AuditLogsPage;
