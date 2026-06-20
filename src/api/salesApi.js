/**
 * PURPOSE:
 * Declares client-side HTTP request mappings for sales orders.
 *
 * BUSINESS USE:
 * Decouples the REST network layer from pages and business service logic,
 * allowing standard integrations with Spring Boot backend order controllers.
 *
 * API USAGE:
 * - GET /api/v1/sales-orders
 * - POST /api/v1/sales-orders
 * - GET /api/v1/sales-orders/{id}
 * - POST /api/v1/sales-orders/{id}/confirm
 * - POST /api/v1/sales-orders/{id}/cancel
 *
 * LOGIC EXPLANATION:
 * Maps function calls directly to endpoints utilizing the shared Axios axiosInstance.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const salesApi = {
  /**
   * PURPOSE: Fetches all sales orders.
   * BUSINESS USE: Populates lists and search filters on the Sales Order dashboard.
   * API USAGE: GET /api/v1/sales-orders
   * LOGIC EXPLANATION: Executes GET request towards base sales orders endpoint.
   */
  getOrders: (params) => axiosInstance.get(API_ENDPOINTS.SALES, { params }),

  /**
   * PURPOSE: Fetches details for a specific order.
   * BUSINESS USE: Inspects line items, delivery logs, and totals for a single quotation.
   * API USAGE: GET /api/v1/sales-orders/{id}
   * LOGIC EXPLANATION: Sends GET request using target ID string path interpolation.
   */
  getOrderById: (id) => axiosInstance.get(`${API_ENDPOINTS.SALES}/${id}`),

  /**
   * PURPOSE: Creates a new sales order quotation.
   * BUSINESS USE: Saves newly entered order details into system database.
   * API USAGE: POST /api/v1/sales-orders
   * LOGIC EXPLANATION: Transmits POST request carrying validated sales lines data payload.
   */
  createOrder: (data) => axiosInstance.post(API_ENDPOINTS.SALES, data),

  /**
   * PURPOSE: Updates a sales order quotation.
   * BUSINESS USE: Modifies ordered products, quantities, or statuses.
   * API USAGE: PUT /api/v1/sales-orders/{id}
   * LOGIC EXPLANATION: Sends PUT request targeting the order ID with modified lines state.
   */
  updateOrder: (id, data) => axiosInstance.put(`${API_ENDPOINTS.SALES}/${id}`, data),

  /**
   * PURPOSE: Cancels a sales order.
   * BUSINESS USE: Halts delivery/routing of orders and tags status as cancelled.
   * API USAGE: POST /api/v1/sales-orders/{id}/cancel
   * LOGIC EXPLANATION: Dispatches a POST action to cancel the order by target ID.
   */
  cancelOrder: (id) => axiosInstance.post(`${API_ENDPOINTS.SALES}/${id}/cancel`),

  /**
   * PURPOSE: Confirms a draft sales order.
   * BUSINESS USE: Locks quotation details and moves it into shipping pipeline.
   * API USAGE: POST /api/v1/sales-orders/{id}/confirm
   * LOGIC EXPLANATION: Dispatches a POST action to confirm the order by target ID.
   */
  confirmOrder: (id) => axiosInstance.post(`${API_ENDPOINTS.SALES}/${id}/confirm`),
};

export default salesApi;
