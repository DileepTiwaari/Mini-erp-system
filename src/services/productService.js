// src/services/productService.js
// Products catalog service layer. Handles products and category requests.

import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const productService = {
  getProducts: async () => {
    try {
      const res = await productApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.PRODUCTS);
    }
  },

  getProductById: async (id) => {
    try {
      const res = await productApi.getById(id);
      return res.data;
    } catch (e) {
      return mockDb.getById(DB_KEYS.PRODUCTS, id);
    }
  },

  createProduct: async (data) => {
    try {
      const res = await productApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.PRODUCTS, data);
    }
  },

  updateProduct: async (id, data) => {
    try {
      const res = await productApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.PRODUCTS, id, data);
    }
  },

  deleteProduct: async (id) => {
    try {
      await productApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.PRODUCTS, id);
    }
  },

  // Category services
  getCategories: async () => {
    try {
      const res = await categoryApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.CATEGORIES);
    }
  },

  createCategory: async (data) => {
    try {
      const res = await categoryApi.create(data);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.CATEGORIES, data);
    }
  },

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
