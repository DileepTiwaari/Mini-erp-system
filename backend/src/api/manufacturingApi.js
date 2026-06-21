// src/api/manufacturingApi.js
// Manufacturing orders processing API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const manufacturingApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.MANUFACTURING, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.MANUFACTURING}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.MANUFACTURING, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.MANUFACTURING}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.MANUFACTURING}/${id}`),
};

export default manufacturingApi;
