/**
 * PURPOSE:
 * Serves as the central business logic coordinator for the product and category models.
 *
 * BUSINESS USE:
 * Decouples the frontend view screens (like ProductsPage) from specific API definitions,
 * providing local mock database storage write-backs when the backend server is unreachable.
 *
 * API USAGE:
 * Calls multiple endpoints inside `productApi` and `categoryApi`.
 *
 * LOGIC EXPLANATION:
 * Implements standard try/catch wrappers. Forwards inputs directly to APIs, but switches
 * dynamically to `mockDb` arrays (persisted in localStorage) if the API call throws an error.
 */

import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const productService = {
  /**
   * PURPOSE: Fetches all catalog products.
   * BUSINESS USE: Populates standard data table views in the product catalog.
   * API USAGE: GET /api/v1/products
   * LOGIC EXPLANATION: Standard async catch-wrapper falling back to DB_KEYS.PRODUCTS mock collections.
   */
  getProducts: async () => {
    try {
      const res = await productApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.PRODUCTS);
    }
  },

  /**
   * PURPOSE: Fetches detailed specifications for a single product by ID.
   * BUSINESS USE: Renders target parameters inside detail panel popups.
   * API USAGE: GET /api/v1/products/{id}
   * LOGIC EXPLANATION: Retrieves a specific record from the backend or queries mockDb by primary key.
   */
  getProductById: async (id) => {
    try {
      const res = await productApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.PRODUCTS, id);
    }
  },

  /**
   * PURPOSE: Creates a new catalog item record.
   * BUSINESS USE: Saves a new product entry into active records.
   * API USAGE: POST /api/v1/products
   * LOGIC EXPLANATION: Submits a payload to the backend, or inserts a new row in mockDb generating a unique random key.
   */
  createProduct: async (data) => {
    try {
      const res = await productApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.PRODUCTS, data);
    }
  },

  /**
   * PURPOSE: Updates an existing catalog product record.
   * BUSINESS USE: Updates prices, stocking thresholds, status flags, or procurement attributes.
   * API USAGE: PUT /api/v1/products/{id}
   * LOGIC EXPLANATION: Sends the updated properties object to the API or updates the local storage table row.
   */
  updateProduct: async (id, data) => {
    try {
      const res = await productApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.PRODUCTS, id, data);
    }
  },

  /**
   * PURPOSE: Deletes a catalog product record by ID.
   * BUSINESS USE: Prunes obsolete item descriptions from active system tables.
   * API USAGE: DELETE /api/v1/products/{id}
   * LOGIC EXPLANATION: Issues a DELETE network request, or removes the row from the mockDb table.
   */
  deleteProduct: async (id) => {
    try {
      await productApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.PRODUCTS, id);
    }
  },

  // Category services

  /**
   * PURPOSE: Fetches all catalog category divisions.
   * BUSINESS USE: Feeds category listing selectors and filters on forms and pages.
   * API USAGE: GET /api/v1/categories
   * LOGIC EXPLANATION: Standard async catch-wrapper falling back to DB_KEYS.CATEGORIES mock collections.
   */
  getCategories: async () => {
    try {
      const res = await categoryApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.CATEGORIES);
    }
  },

  /**
   * PURPOSE: Creates a new category division.
   * BUSINESS USE: Adds a new division (e.g., Raw Materials) to catalog classifications.
   * API USAGE: POST /api/v1/categories
   * LOGIC EXPLANATION: Calls the category API or inserts the row into mockDb.
   */
  createCategory: async (data) => {
    try {
      const res = await categoryApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.CATEGORIES, data);
    }
  },

  /**
   * PURPOSE: Updates an existing category definition by ID.
   * BUSINESS USE: Modifies category names or alphanumeric short codes.
   * API USAGE: PUT /api/v1/categories/{id}
   * LOGIC EXPLANATION: Submits category edits to the backend API or updates the local storage table row.
   */
  updateCategory: async (id, data) => {
    try {
      const res = await categoryApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.CATEGORIES, id, data);
    }
  },

  /**
   * PURPOSE: Deletes a category division by ID.
   * BUSINESS USE: Removes catalog groupings that are no longer needed.
   * API USAGE: DELETE /api/v1/categories/{id}
   * LOGIC EXPLANATION: Issues a DELETE network request, or removes the row from the mockDb table.
   */
  deleteCategory: async (id) => {
    try {
      await categoryApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.CATEGORIES, id);
    }
  }
};

export default productService;
