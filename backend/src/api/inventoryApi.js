// src/api/inventoryApi.js
// Stock ledger and adjustment API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const inventoryApi = {
  getLedger: (params) => axiosInstance.get(`${API_ENDPOINTS.INVENTORY}/ledger`, { params }),
  adjust: (data) => axiosInstance.post(`${API_ENDPOINTS.INVENTORY}/adjust`, data),
  getSummary: () => axiosInstance.get(`${API_ENDPOINTS.INVENTORY}/summary`),
};

export default inventoryApi;
