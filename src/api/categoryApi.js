// src/api/categoryApi.js
// 
// WHAT IT DOES:
// Handles REST client wrappers for product category operations.
// Maps requests to Axios endpoints (e.g. GET `/categories`, POST `/categories`, PUT `/categories/{id}`).
// 
// WHY IT IS REQUIRED:
// 1. Decouples HTTP protocol layout rules from category management views.
// 2. Fits Spring Boot backend path layout specifications (`/api/v1/categories`).
// 
// WHEN IT IS USED:
// Triggered by the productService layer when managing categories.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * WHAT IT DOES: Object mapping REST request wrappers for category endpoints.
 * WHY IT IS REQUIRED: Standardizes CRUD queries towards categories database tables.
 * WHEN IT IS USED: Accessed by the productService.
 */
export const categoryApi = {
  // WHAT IT DOES: Retrieves all categories.
  // WHY IT IS REQUIRED: Feeds form selectors and category lists.
  // WHEN IT IS USED: On categories list mount.
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.CATEGORIES, { params }),
  
  // WHAT IT DOES: Creates a new category.
  // WHY IT IS REQUIRED: Stores new catalog divisions.
  // WHEN IT IS USED: Fired on submitting the category creation form.
  create: (data) => axiosInstance.post(API_ENDPOINTS.CATEGORIES, data),
  
  // WHAT IT DOES: Updates an existing category by ID.
  // WHY IT IS REQUIRED: Allows changing category information (e.g. description, code).
  // WHEN IT IS USED: Fired on submitting the category edit form.
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, data),
  
  // WHAT IT DOES: Deletes a category.
  // WHY IT IS REQUIRED: Clears empty or obsolete category entries.
  // WHEN IT IS USED: Fired on confirming deletion.
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`),
};

export default categoryApi;
