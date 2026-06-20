// src/utils/dateUtils.js
// Date and time utilities for displaying activity timestamps and transactional dates in FlowERP.

/**
 * Standard date formatter
 * @param {string|Date} dateVal 
 * @returns {string} e.g. Jun 20, 2026
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Detailed date and time formatter
 * @param {string|Date} dateVal 
 * @returns {string} e.g. Jun 20, 2026, 2:53 PM
 */
export const formatDateTime = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Relative time formatter (e.g. '5 minutes ago', '2 hours ago')
 * Useful for Audit logs and recent activities.
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export const formatRelativeTime = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'yesterday';
  return formatDate(date);
};
