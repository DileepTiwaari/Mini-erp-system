// src/api/auditApi.js
// Enterprise operations audit logs API requests.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const auditApi = {
  getLogs: (params) => axiosInstance.get(API_ENDPOINTS.AUDIT, { params }),
};

export default auditApi;
