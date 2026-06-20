// src/api/vendorApi.js
// Vendors catalog API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const vendorApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.VENDORS, { params }),
  getById: (id) => axiosInstance.get(`${API_ENDPOINTS.VENDORS}/${id}`),
  create: (data) => axiosInstance.post(API_ENDPOINTS.VENDORS, data),
  update: (id, data) => axiosInstance.put(`${API_ENDPOINTS.VENDORS}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.VENDORS}/${id}`),
};

export default vendorApi;
