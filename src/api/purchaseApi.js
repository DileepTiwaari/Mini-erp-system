// src/api/purchaseApi.js
// Purchase orders processing API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const purchaseApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.PURCHASES, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.PURCHASES}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.PURCHASES, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.PURCHASES}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.PURCHASES}/${id}`),
};

export default purchaseApi;
