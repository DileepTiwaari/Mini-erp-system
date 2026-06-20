// src/api/salesApi.js
// Sales orders processing API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const salesApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.SALES, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.SALES}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.SALES, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.SALES}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.SALES}/${id}`),
};

export default salesApi;
