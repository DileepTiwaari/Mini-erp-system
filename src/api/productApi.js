// src/api/productApi.js
// 
// WHAT IT DOES:
// Serves as the API interface for products data requests, defining REST client wrappers 
// (get, post, put, delete) using the custom Axios axiosInstance.
// 
// WHY IT IS REQUIRED:
// 1. Keeps HTTP communications isolated from view and business logic components.
// 2. Prepares exact path layouts for direct Spring Boot backend compatibility (`/api/v1/products`).
// 
// WHEN IT IS USED:
// Invoked by the productService layer when querying or updating product lists and records.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * WHAT IT DOES: Object mapping REST request wrappers for products resource endpoints.
 * WHY IT IS REQUIRED: Standardizes CRUD queries towards unified base paths.
 * WHEN IT IS USED: Executed inside service handlers during products management.
 */
export const productApi = {
  // WHAT IT DOES: Queries standard list of products with active search filters.
  // WHY IT IS REQUIRED: populates product list grids.
  // WHEN IT IS USED: Triggered on products page mount.
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params }),
  
  // WHAT IT DOES: Queries a single product details.
  // WHY IT IS REQUIRED: Feeds the product details display overlay.
  // WHEN IT IS USED: Fired on clicking details button.
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${id}`),
  
  // WHAT IT DOES: Posts a new product record payload.
  // WHY IT IS REQUIRED: Saves newly created product specifications.
  // WHEN IT IS USED: Fired on submit additions form.
  create: (data) => axiosInstance.post(API_ENDPOINTS.PRODUCTS, data),
  
  // WHAT IT DOES: Updates fields of a specific product by ID.
  // WHY IT IS REQUIRED: Commits edited product modifications to database.
  // WHEN IT IS USED: Fired on submit edit form.
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, data),
  
  // WHAT IT DOES: Dispatches delete instructions for an item.
  // WHY IT IS REQUIRED: Removes catalog products.
  // WHEN IT IS USED: Fired upon confirm delete check alerts.
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`),
};

export default productApi;
