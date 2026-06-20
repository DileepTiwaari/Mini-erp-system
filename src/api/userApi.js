// src/api/userApi.js
// User profile and role API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const userApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.USERS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.USERS}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.USERS, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.USERS}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.USERS}/${id}`),
};

export default userApi;
