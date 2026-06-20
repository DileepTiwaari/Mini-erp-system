// src/api/workOrderApi.js
// Sub-operational Work Orders API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const workOrderApi = {
  getAll: (params) => axiosInstance.get(API_ENDPOINTS.WORK_ORDERS, { params }),
  updateStatus: (id, status) => axiosInstance.patch(`${API_ENDPOINTS.WORK_ORDERS}/${id}`, { status }),
};

export default workOrderApi;
