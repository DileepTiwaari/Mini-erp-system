/**
 * PURPOSE:
 * Serves as the central business logic coordinator for the product and category models.
 *
 * BUSINESS USE:
 * Decouples the frontend view screens (like ProductsPage) from specific API definitions.
 * All methods gracefully handle API failures by returning empty data structures.
 *
 * API USAGE:
 * Calls multiple endpoints inside `productApi` and `categoryApi`.
 */

import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';

const mapProductResponse = (p) => {
  if (!p || typeof p !== 'object') return p;
  return {
    ...p,
    price: p.salesPrice !== undefined ? p.salesPrice : p.price,
    cost: p.costPrice !== undefined ? p.costPrice : p.cost,
    stock: p.onHandQty !== undefined ? p.onHandQty : (p.stock || 0),
    minStock: p.minStock !== undefined ? p.minStock : 10,
    code: p.code || `PRD-${String(p.id).padStart(3, '0')}`,
    uom: p.uom || 'pcs',
    status: p.isActive !== undefined ? (p.isActive ? 'active' : 'inactive') : (p.status || 'active'),
  };
};

export const productService = {
  /**
   * Fetches all catalog products.
   * Returns an empty array if the API is unreachable.
   */
  getProducts: async () => {
    try {
      const res = await productApi.getAll();
      const rawData = res.data && res.data.success ? res.data.data : res.data;
      if (Array.isArray(rawData)) {
        return rawData.map(mapProductResponse);
      }
      // Handle paginated response { content: [...] }
      if (rawData && Array.isArray(rawData.content)) {
        return rawData.content.map(mapProductResponse);
      }
      return rawData ? [mapProductResponse(rawData)] : [];
    } catch (e) {
      console.warn('[ProductService] getProducts failed:', e.message);
      return [];
    }
  },

  /**
   * Fetches detailed specifications for a single product by ID.
   */
  getProductById: async (id) => {
    try {
      const res = await productApi.getById(id);
      const p = res.data && res.data.success ? res.data.data : res.data;
      return mapProductResponse(p);
    } catch (e) {
      console.warn('[ProductService] getProductById failed:', e.message);
      return null;
    }
  },

  /**
   * Creates a new catalog item record.
   */
  createProduct: async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      salesPrice: data.price,
      costPrice: data.cost,
      onHandQty: data.stock,
      procurementType: data.procurementType,
      procurementStrategy: data.procurementStrategy,
      procureOnDemand: data.procureOnDemand || false,
      categoryId: Number(data.categoryId) || null,
      isActive: data.status === 'active',
    };
    const res = await productApi.create(payload);
    const returned = res.data && res.data.success ? res.data.data : res.data;
    return mapProductResponse(returned);
  },

  /**
   * Updates an existing catalog product record.
   */
  updateProduct: async (id, data) => {
    const payload = {
      name: data.name,
      description: data.description,
      salesPrice: data.price,
      costPrice: data.cost,
      onHandQty: data.stock,
      procurementType: data.procurementType,
      procurementStrategy: data.procurementStrategy,
      procureOnDemand: data.procureOnDemand || false,
      categoryId: Number(data.categoryId) || null,
      isActive: data.status === 'active',
    };
    const res = await productApi.update(id, payload);
    const returned = res.data && res.data.success ? res.data.data : res.data;
    return mapProductResponse(returned);
  },

  /**
   * Deletes a catalog product record by ID.
   */
  deleteProduct: async (id) => {
    await productApi.delete(id);
    return true;
  },

  // Category services

  /**
   * Fetches all catalog category divisions.
   * Returns an empty array if the API is unreachable.
   */
  getCategories: async () => {
    try {
      const res = await categoryApi.getAll();
      const data = res.data && res.data.success ? res.data.data : res.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.content)) return data.content;
      return data ? [data] : [];
    } catch (e) {
      console.warn('[ProductService] getCategories failed:', e.message);
      return [];
    }
  },

  /**
   * Creates a new category division.
   */
  createCategory: async (data) => {
    const res = await categoryApi.create(data);
    return res.data && res.data.success ? res.data.data : res.data;
  },

  /**
   * Updates an existing category definition by ID.
   */
  updateCategory: async (id, data) => {
    const res = await categoryApi.update(id, data);
    return res.data && res.data.success ? res.data.data : res.data;
  },

  /**
   * Deletes a category division by ID.
   */
  deleteCategory: async (id) => {
    await categoryApi.delete(id);
    return true;
  }
};

export default productService;
