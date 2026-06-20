// src/api/productApi.js
// Products inventory catalog API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const productApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.PRODUCTS, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`),
};

export default productApi;
