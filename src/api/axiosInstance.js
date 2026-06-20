// src/api/axiosInstance.js
// Global Axios Instance for FlowERP API Communication.
// Configured with standard request/response interceptors to manage JWT authorization headers 
// and global response error handling (e.g. 401 logouts, API server down notifications).

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token dynamically if it is in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        // Parse because storage writes it JSON stringified
        const token = JSON.parse(storedToken);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('Axios Interceptor: Could not read token from localStorage', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle standardized response codes
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected network error occurred. Please try again.';

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Capture message from backend API response if available
      errorMessage = data?.message || data?.error || errorMessage;

      switch (status) {
        case 401:
          // Unauthorized: Session expired, clear storage and redirect
          console.warn('Session expired. Redirecting to login...');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Dispatches custom event to force Auth state logout and navigate
          window.dispatchEvent(new CustomEvent('auth-logout', { detail: { message: 'Session expired. Please log in again.' } }));
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error. Please contact support.';
          break;
        default:
          break;
      }
    } else if (error.request) {
      errorMessage = 'Unable to reach the server. Please check your internet connection.';
    }

    // Trigger standard global toast notifier event for decoupled listeners (like ToastContext)
    window.dispatchEvent(new CustomEvent('api-error', { detail: { message: errorMessage } }));

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
