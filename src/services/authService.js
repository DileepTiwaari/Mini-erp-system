// src/services/authService.js
// Authentication Service layer.
// Bridges the UI to authApi, falling back to mockDb users for standalone offline demo.

import authApi from '../api/authApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';

export const authService = {
  login: async (email, password) => {
    try {
      // Try hitting the backend API first
      const response = await authApi.login({ email, password });
      return response.data; // Expected { user: {...}, token: 'jwt-token' }
    } catch (error) {
      console.warn('authService.login: API failed or unreachable. Falling back to local mock DB...', error.message);
      
      // Standalone simulation fallback
      const users = mockDb.getAll(DB_KEYS.USERS);
      const user = users.find(u => u.email === email && u.active);
      
      if (!user) {
        throw new Error('Invalid email credentials or user is inactive.');
      }
      
      // Simulate JWT creation
      const mockToken = `mock-jwt-token-for-${user.role}-${Date.now()}`;
      
      mockDb.logAudit('User Login', `User ${email} authenticated successfully (Standalone mode).`);
      
      return {
        user,
        token: mockToken
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authApi.getMe();
      return response.data;
    } catch (error) {
      console.warn('authService.getCurrentUser: API failed. Falling back to local session...', error.message);
      // Reads from active stored state directly
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      if (token && user) {
        return JSON.parse(user);
      }
      throw new Error('No active session.');
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('authService.logout: API failed. Running local cleanup...', error.message);
    }
    mockDb.logAudit('User Logout', 'User logged out successfully.');
  }
};

export default authService;
// Also mock user API inside this file since userApi shares user management logic
import userApi from '../api/userApi';

export const userService = {
  getUsers: async () => {
    try {
      const res = await userApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.USERS);
    }
  },
  createUser: async (user) => {
    try {
      const res = await userApi.create(user);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.USERS, user);
    }
  },
  updateUser: async (id, data) => {
    try {
      const res = await userApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.USERS, id, data);
    }
  },
  deleteUser: async (id) => {
    try {
      await userApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.USERS, id);
    }
  }
};
