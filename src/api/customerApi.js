// src/api/customerApi.js
// Customers catalog API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const customerApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.CUSTOMERS, { params }),
  create: (data) => axiosInstance.post(API_ENDPOINTS.CUSTOMERS, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`),
};

export default customerApi;
