// src/api/categoryApi.js
// Product categories API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const categoryApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.CATEGORIES, { params }),
  create: (data) => axiosInstance.post(API_ENDPOINTS.CATEGORIES, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`),
};

export default categoryApi;
