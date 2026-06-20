// src/utils/formatters.js
// Utility functions for UI formatting in FlowERP.
// Provides clean, localized representation of monetary figures, quantities, and roles.

/**
 * Format raw numbers into currency (USD by default, easily adaptable)
 * @param {number} val 
 * @returns {string} formatted currency
 */
export const formatCurrency = (val) => {
  const number = Number(val) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

/**
 * Format numbers with unit of measure
 * @param {number} qty 
 * @param {string} unit 
 * @returns {string} formatted quantity
 */
export const formatQuantity = (qty, unit = 'pcs') => {
  const quantity = Number(qty) || 0;
  return `${quantity.toLocaleString('en-US')} ${unit}`;
};

/**
 * Transform technical role names to user-friendly titles
 * @param {string} role 
 * @returns {string} capitalized display name
 */
export const formatRole = (role) => {
  if (!role) return '';
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats statuses for human viewing. Example: in_progress -> In Progress
 * @param {string} status 
 * @returns {string}
 */
export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Re-export formatDate from dateUtils to satisfy component imports
export { formatDate } from './dateUtils';
