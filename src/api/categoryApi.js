/**
 * PURPOSE:
 * Manages the raw HTTP network layer calls for product categories.
 *
 * BUSINESS USE:
 * Decouples REST path mappings for product category operations from pages and forms,
 * facilitating easier routing swaps on eventual backend integration.
 *
 * API USAGE:
 * - GET /api/v1/categories
 * - POST /api/v1/categories
 * - PUT /api/v1/categories/{id}
 * - DELETE /api/v1/categories/{id}
 *
 * LOGIC EXPLANATION:
 * Leverages the shared authenticated axiosInstance. Each function maps standard CRUD actions
 * towards categories database paths.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const categoryApi = {
  /**
   * PURPOSE: Retrieves all categories.
   * BUSINESS USE: Populates category filters and product selection forms.
   * API USAGE: GET /api/v1/categories
   * LOGIC EXPLANATION: Executes an Axios GET request towards the category base path.
   */
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.CATEGORIES, { params }),
  
  /**
   * PURPOSE: Registers a new product category.
   * BUSINESS USE: Creates a new organizational category divider for catalog items.
   * API USAGE: POST /api/v1/categories
   * LOGIC EXPLANATION: Sends a POST request containing the new category name and code.
   */
  create: (data) => axiosInstance.post(API_ENDPOINTS.CATEGORIES, data),
  
  /**
   * PURPOSE: Modifies an existing category's properties.
   * BUSINESS USE: Updates a category's name or code.
   * API USAGE: PUT /api/v1/categories/{id}
   * LOGIC EXPLANATION: Executes a PUT request targeting the category ID with modified data.
   */
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, data),
  
  /**
   * PURPOSE: Deletes a category division by ID.
   * BUSINESS USE: Removes catalog groupings that are no longer active.
   * API USAGE: DELETE /api/v1/categories/{id}
   * LOGIC EXPLANATION: Sends a DELETE request towards the target category ID.
   */
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`),
};

export default categoryApi;
