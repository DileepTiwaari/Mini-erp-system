// src/api/workCenterApi.js
// Work Center configurations API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const workCenterApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.WORK_CENTERS, { params }),
  create: (data) => axiosInstance.post(API_ENDPOINTS.WORK_CENTERS, data),
  delete: (id) => axiosInstance.delete(`${API_ENDPOINTS.WORK_CENTERS}/${id}`),
};

export default workCenterApi;
