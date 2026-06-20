/**
 * PURPOSE:
 * Manages the raw HTTP network layer calls for product catalog data.
 *
 * BUSINESS USE:
 * Decouples REST path mappings for product CRUD operations from pages and components,
 * ensuring modularity when migrating to active backend servers.
 *
 * API USAGE:
 * - GET /api/v1/products
 * - GET /api/v1/products/{id}
 * - POST /api/v1/products
 * - PUT /api/v1/products/{id}
 * - DELETE /api/v1/products/{id}
 *
 * LOGIC EXPLANATION:
 * Leverages the shared authenticated axiosInstance. Each function maps directly to standard REST methods
 * (get, post, put, delete) matching Spring Boot endpoints paths.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const productApi = {
  /**
   * PURPOSE: Retrieves all products.
   * BUSINESS USE: Populates lists and search filters on the catalog management board.
   * API USAGE: GET /api/v1/products
   * LOGIC EXPLANATION: Executes an Axios GET request towards the base products endpoint.
   */
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params }),
  
  /**
   * PURPOSE: Retrieves a specific product by ID.
   * BUSINESS USE: Populates detail inspection popup cards for a single product.
   * API USAGE: GET /api/v1/products/{id}
   * LOGIC EXPLANATION: Interpolates the target product ID string to construct the GET request path.
   */
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${id}`),
  
  /**
   * PURPOSE: Registers a new product.
   * BUSINESS USE: Commits a newly entered product payload to the system.
   * API USAGE: POST /api/v1/products
   * LOGIC EXPLANATION: Sends a POST request containing the validated form state data object.
   */
  create: (data) => axiosInstance.post(API_ENDPOINTS.PRODUCTS, data),
  
  /**
   * PURPOSE: Updates an existing product by ID.
   * BUSINESS USE: Commits modifications to pricing, quantities, or sourcing details.
   * API USAGE: PUT /api/v1/products/{id}
   * LOGIC EXPLANATION: Executes a PUT request with target ID and modified attributes object.
   */
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, data),
  
  /**
   * PURPOSE: Deletes a product.
   * BUSINESS USE: Removes obsolete or invalid products from active listings.
   * API USAGE: DELETE /api/v1/products/{id}
   * LOGIC EXPLANATION: Dispatches a DELETE request towards the target product ID path.
   */
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`),
};

export default productApi;
