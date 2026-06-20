/**
 * PURPOSE:
 * Provides the REST API client interface for Vendor suppliers catalog operations.
 *
 * BUSINESS USE:
 * Allows the ERP to retrieve lists of suppliers, register new vendors, and modify existing
 * supplier configurations (such as address and GST codes) with a future backend database.
 *
 * API USAGE:
 * - GET /api/v1/vendors (fetch all active/inactive vendor profiles)
 * - GET /api/v1/vendors/{id} (fetch a single vendor profile)
 * - POST /api/v1/vendors (register a new supplier account)
 * - PUT /api/v1/vendors/{id} (modify contact details or status of a supplier)
 * - DELETE /api/v1/vendors/{id} (permanently remove a vendor supplier)
 *
 * LOGIC FLOW:
 * Wraps individual Axios calls targeting backend REST endpoints. Services utilize these methods
 * and automatically catch connection failures, falling back to client-side localStorage.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const vendorApi = {
  /**
   * PURPOSE: Fetches all vendor profiles.
   */
  getVendors: (params) => axiosInstance.get(API_ENDPOINTS.VENDORS, { params }),

  /**
   * PURPOSE: Fetches details for a single vendor.
   */
  getVendorById: (id) => axiosInstance.get(`${API_ENDPOINTS.VENDORS}/${id}`),

  /**
   * PURPOSE: Registers a new vendor account.
   */
  createVendor: (data) => axiosInstance.post(API_ENDPOINTS.VENDORS, data),

  /**
   * PURPOSE: Updates an existing vendor's attributes.
   */
  updateVendor: (id, data) => axiosInstance.put(`${API_ENDPOINTS.VENDORS}/${id}`, data),

  /**
   * PURPOSE: Deletes a vendor account from the supplier catalog.
   */
  deleteVendor: (id) => axiosInstance.delete(`${API_ENDPOINTS.VENDORS}/${id}`),
};

export default vendorApi;
