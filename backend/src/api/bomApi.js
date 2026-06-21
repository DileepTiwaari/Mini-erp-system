// src/api/bomApi.js
// Bill of Materials (BOM) API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const bomApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.BOM, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.BOM}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.BOM, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.BOM}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.BOM}/${id}`),
};

export default bomApi;
