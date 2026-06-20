// src/api/authApi.js
// Authentication API requests using axiosInstance.

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const authApi = {
  login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),
  getMe: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
};

export default authApi;
