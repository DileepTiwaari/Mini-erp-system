/**
 * PURPOSE:
 * Declares client-side HTTP request mappings for customer profiles.
 *
 * BUSINESS USE:
 * Decouples customer master data CRUD path structures from pages,
 * allowing simple backend transitions.
 *
 * API USAGE:
 * - GET /api/v1/customers
 * - POST /api/v1/customers
 * - PUT /api/v1/customers/{id}
 * - DELETE /api/v1/customers/{id}
 *
 * LOGIC EXPLANATION:
 * Leverages the authenticated axiosInstance to query and save customer metadata records.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const customerApi = {
  /**
   * PURPOSE: Fetches all customer profiles.
   * BUSINESS USE: Populates customer selectors and address grids in the sales module.
   * API USAGE: GET /api/v1/customers
   * LOGIC EXPLANATION: Sends GET request towards base customers endpoint.
   */
  getCustomers: (params) => axiosInstance.get(API_ENDPOINTS.CUSTOMERS, { params }),

  /**
   * PURPOSE: Creates a new customer profile.
   * BUSINESS USE: Registers a new business client, storing address and GST details.
   * API USAGE: POST /api/v1/customers
   * LOGIC EXPLANATION: Dispatches a POST request with newly formatted customer profile data.
   */
  createCustomer: (data) => axiosInstance.post(API_ENDPOINTS.CUSTOMERS, data),

  /**
   * PURPOSE: Modifies details of an existing customer profile.
   * BUSINESS USE: Updates a customer's address, contact details, or tax numbers.
   * API USAGE: PUT /api/v1/customers/{id}
   * LOGIC EXPLANATION: Sends a PUT request with modified customer details by target ID.
   */
  updateCustomer: (id, data) => axiosInstance.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data),

  /**
   * PURPOSE: Deletes a customer profile.
   * BUSINESS USE: Prunes inactive or redundant clients from master system tables.
   * API USAGE: DELETE /api/v1/customers/{id}
   * LOGIC EXPLANATION: Issues a DELETE request targeting the customer ID.
   */
  deleteCustomer: (id) => axiosInstance.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`),
};

export default customerApi;
