// src/services/productService.js
// Product and category service layer — live APIs only, no mock fallbacks.

import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';

export const productService = {
  getProducts: async () => {
    const res = await productApi.getAll();
    const data = res.data;
    return Array.isArray(data) ? data : (data.content || []);
  },

  getProductById: async (id) => {
    const res = await productApi.getById(id);
    return res.data;
  },

  createProduct: async (data) => {
    const res = await productApi.create(data);
    return res.data;
  },

  updateProduct: async (id, data) => {
    const res = await productApi.update(id, data);
    return res.data;
  },

  deleteProduct: async (id) => {
    await productApi.delete(id);
    return true;
  },

  getCategories: async () => {
    const res = await categoryApi.getAll();
    const data = res.data;
    return Array.isArray(data) ? data : (data.content || []);
  },

  createCategory: async (data) => {
    const res = await categoryApi.create(data);
    return res.data;
  },

  updateCategory: async (id, data) => {
    const res = await categoryApi.update(id, data);
    return res.data;
  },

  deleteCategory: async (id) => {
    await categoryApi.delete(id);
    return true;
  },
};

export default productService;
