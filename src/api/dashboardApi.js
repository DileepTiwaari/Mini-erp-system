// src/api/dashboardApi.js
// Aggregated dashboard metrics API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const dashboardApi = {
  getSummary: () => axiosInstance.get(API_ENDPOINTS.DASHBOARD),
};

export default dashboardApi;
