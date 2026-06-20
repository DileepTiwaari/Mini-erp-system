// src/services/productService.js
// 
// WHAT IT DOES:
// Acts as the business logic layer between UI components and REST APIs for products and categories.
// Contains operations for listing, creating, updating, and deleting products/categories,
// falling back automatically to local mockDb persistent tables if the backend is unreachable.
// 
// WHY IT IS REQUIRED:
// 1. Keeps pages decoupled from specific API layouts.
// 2. Holds business logic validations and format transformations in a unified place.
// 3. Establishes fallback security, allowing standalone offline demo execution.
// 
// WHEN IT IS USED:
// Imported and called inside DashboardPage, ProductsPage, and item detail components.

import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

/**
 * WHAT IT DOES: Central business service layer for product catalog resources.
 * WHY IT IS REQUIRED: Exposes simplified CRUD interfaces for components.
 * WHEN IT IS USED: Invoked by components to fetch, save, or delete inventory catalog definitions.
 */
export const productService = {
  // WHAT IT DOES: Fetches list of products.
  // WHY IT IS REQUIRED: Feeds the catalog table display.
  // WHEN IT IS USED: Fired on Products Page mount.
  getProducts: async () => {
    try {
      const res = await productApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.PRODUCTS);
    }
  },

  // WHAT IT DOES: Fetches details of a single product.
  // WHY IT IS REQUIRED: Feeds detail modal boards.
  // WHEN IT IS USED: Fired when selecting an item to view.
  getProductById: async (id) => {
    try {
      const res = await productApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.PRODUCTS, id);
    }
  },

  // WHAT IT DOES: Creates a new catalog item.
  // WHY IT IS REQUIRED: Commits new items to database.
  // WHEN IT IS USED: Fired on submit creation forms.
  createProduct: async (data) => {
    try {
      const res = await productApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.PRODUCTS, data);
    }
  },

  // WHAT IT DOES: Edits attributes of an existing item.
  // WHY IT IS REQUIRED: Updates price, safety margins, or procurement attributes.
  // WHEN IT IS USED: Fired on submit edit forms.
  updateProduct: async (id, data) => {
    try {
      const res = await productApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.PRODUCTS, id, data);
    }
  },

  // WHAT IT DOES: Removes an item from the database.
  // WHY IT IS REQUIRED: Deletes obsolete products.
  // WHEN IT IS USED: Fired on confirm delete dialogues.
  deleteProduct: async (id) => {
    try {
      await productApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.PRODUCTS, id);
    }
  },

  // Category services

  // WHAT IT DOES: Fetches category divisions.
  // WHY IT IS REQUIRED: Populates product division tables and dropdowns.
  // WHEN IT IS USED: Fired on list mounting.
  getCategories: async () => {
    try {
      const res = await categoryApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.CATEGORIES);
    }
  },

  // WHAT IT DOES: Creates a new category division.
  // WHY IT IS REQUIRED: Enables adding new departments.
  // WHEN IT IS USED: Fired on submit category forms.
  createCategory: async (data) => {
    try {
      const res = await categoryApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.CATEGORIES, data);
    }
  },

  // WHAT IT DOES: Updates details of an existing category by ID.
  // WHY IT IS REQUIRED: Allows editing category descriptors.
  // WHEN IT IS USED: Fired on category editing submissions.
  updateCategory: async (id, data) => {
    try {
      const res = await categoryApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.CATEGORIES, id, data);
    }
  },

  // WHAT IT DOES: Deletes a category division by ID.
  // WHY IT IS REQUIRED: Removes catalog groups.
  // WHEN IT IS USED: Fired on confirm delete check.
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
