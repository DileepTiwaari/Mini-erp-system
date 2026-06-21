/**
 * PURPOSE:
 * Provides the REST API client interface for Purchase Order (PO) and Request for Quotation (RFQ) operations.
 *
 * BUSINESS USE:
 * Enables procurement managers to draft, approve, confirm orders, process received raw materials,
 * or cancel pending procurement orders.
 *
 * API USAGE:
 * - GET /api/v1/purchase-orders (fetch all PO records)
 * - GET /api/v1/purchase-orders/{id} (fetch a specific purchase order)
 * - POST /api/v1/purchase-orders (draft a new RFQ)
 * - POST /api/v1/purchase-orders/{id}/confirm (approve/confirm purchase order to suppliers)
 * - POST /api/v1/purchase-orders/{id}/receive (log incoming goods receipt and increase stock)
 * - POST /api/v1/purchase-orders/{id}/cancel (cancel purchase order)
 *
 * LOGIC FLOW:
 * Wraps individual Axios calls targeting backend REST endpoints. Services utilize these methods
 * and automatically catch connection failures, falling back to client-side localStorage.
 */

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const purchaseApi = {
  /**
   * PURPOSE: Fetches all purchase orders.
   */
  getPurchaseOrders: (params) => axiosInstance.get(API_ENDPOINTS.PURCHASES, { params }),

  /**
   * PURPOSE: Fetches details for a specific purchase order.
   */
  getPurchaseOrderById: (id) => axiosInstance.get(`${API_ENDPOINTS.PURCHASES}/${id}`),

  /**
   * PURPOSE: Creates a new purchase order draft (RFQ).
   */
  createPurchaseOrder: (data) => axiosInstance.post(API_ENDPOINTS.PURCHASES, data),

  /**
   * PURPOSE: Modifies an existing purchase order draft.
   */
  updatePurchaseOrder: (id, data) => axiosInstance.put(`${API_ENDPOINTS.PURCHASES}/${id}`, data),

  /**
   * PURPOSE: Confirms a purchase order.
   */
  confirmPurchaseOrder: (id) => axiosInstance.post(`${API_ENDPOINTS.PURCHASES}/${id}/confirm`),

  /**
   * PURPOSE: Logs goods receipt against a purchase order.
   */
  receivePurchaseOrder: (id, receiptData) => axiosInstance.post(`${API_ENDPOINTS.PURCHASES}/${id}/receive`, receiptData),

  /**
   * PURPOSE: Cancels a purchase order.
   */
  cancelPurchaseOrder: (id) => axiosInstance.post(`${API_ENDPOINTS.PURCHASES}/${id}/cancel`),

  /**
   * PURPOSE: Removes a draft quotation.
   */
  deletePurchaseOrder: (id) => axiosInstance.delete(`${API_ENDPOINTS.PURCHASES}/${id}`),
};

export default purchaseApi;
