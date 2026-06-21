// src/services/authService.js
// Authentication and user-management service layer.
// Calls live backend APIs only — no mock fallbacks.

import authApi from '../api/authApi';
import userApi from '../api/userApi';

export const authService = {
  saveToken: (token) => {
    localStorage.setItem('auth_token', JSON.stringify(token));
  },

  getToken: () => {
    try {
      const stored = localStorage.getItem('auth_token');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  login: async (username, password) => {
    const response = await authApi.login({ username, password });
    const { user, token, accessToken } = response.data;
    const jwt = token || accessToken;
    authService.saveToken(jwt);
    return { user, token: jwt };
  },

  getCurrentUser: async () => {
    try {
      const response = await authApi.getMe();
      return response.data;
    } catch {
      // Fall back to stored user object on session restore (not mock — real session data)
      const stored = localStorage.getItem('auth_user');
      if (stored) return JSON.parse(stored);
      throw new Error('No active user session.');
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // best-effort; always clean up local state
    }
    authService.removeToken();
    localStorage.removeItem('auth_user');
  },
};

export const userService = {
  getUsers: async () => {
    const res = await userApi.getAll();
    const data = res.data;
    return Array.isArray(data) ? data : (data.content || []);
  },

  createUser: async (user) => {
    const res = await userApi.create(user);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await userApi.update(id, data);
    return res.data;
  },

  deleteUser: async (id) => {
    await userApi.delete(id);
    return true;
  },
};

export default authService;
