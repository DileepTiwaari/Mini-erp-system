// src/api/procurementApi.js
// Automated replenishment suggestions API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const procurementApi = {
  getRecommendations: () => axiosInstance.get(API_ENDPOINTS.PROCUREMENT),
  executeProcurement: (data) => axiosInstance.post(API_ENDPOINTS.PROCUREMENT, data),
};

export default procurementApi;
