// src/services/authService.js
// 
// WHAT IT DOES:
// Serves as the authentication business logic service layer. It acts as a middleman 
// between the UI context and the API request handlers. It executes network logins, 
// saves tokens, resolves active profile details, and handles standalone fallback routines.
// 
// WHY IT IS REQUIRED:
// 1. Decouples components from network mechanics: components do not need to understand local storage keys or fetch headers.
// 2. Holds token caching policies in a single file.
// 3. Implements local storage mapping so that frontend auth remains fully active without database servers.
// 
// WHEN IT IS USED:
// Triggered on form submit at the login screen, during navbar logout requests, and on page refresh mounts.

import authApi from '../api/authApi';
import { mockDb, DB_KEYS } from '../utils/mockDb';
import userApi from '../api/userApi';

export const authService = {
  /**
   * WHAT IT DOES: Saves the authentication token string in local storage.
   * WHY IT IS REQUIRED: Keeps the token cached persistently so browser refreshes do not disrupt session state.
   * WHEN IT IS USED: Triggered immediately when login verification returns a valid JWT.
   * 
   * @param {string} token - The JWT token to persist
   */
  saveToken: (token) => {
    localStorage.setItem('auth_token', JSON.stringify(token));
  },

  /**
   * WHAT IT DOES: Reads the authentication token string from local storage.
   * WHY IT IS REQUIRED: Allows Axios interceptors and context constructors to retrieve active credentials.
   * WHEN IT IS USED: Evaluated on app load and before sending API requests.
   * 
   * @returns {string|null} The cached token string or null if unauthenticated
   */
  getToken: () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      return storedToken ? JSON.parse(storedToken) : null;
    } catch (e) {
      console.error('authService.getToken: Error parsing token', e);
      return null;
    }
  },

  /**
   * WHAT IT DOES: Deletes the authentication token from local storage.
   * WHY IT IS REQUIRED: Cleans up credentials cache on logout to block subsequent requests.
   * WHEN IT IS USED: Invoked during user logouts or session expirations.
   */
  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  /**
   * WHAT IT DOES: Authenticates user credentials via backend API, falling back to mockDb users on failure.
   * WHY IT IS REQUIRED: Resolves email/password queries, returns user details, and generates local mock tokens.
   * WHEN IT IS USED: Invoked on submit click at the LoginPage.
   * 
   * @param {string} email - Input email address
   * @param {string} password - Input password
   * @returns {object} Session response containing user details and token
   */
  login: async (email, password) => {
    try {
      // Try hitting the backend API first
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;
      
      // Save token dynamically
      authService.saveToken(token);
      return response.data;
    } catch (error) {
      console.warn('authService.login: API failed or unreachable. Falling back to local mock DB...', error.message);
      
      // Standalone simulation fallback
      const users = mockDb.getAll(DB_KEYS.USERS);
      const user = users.find(u => u.email === email && u.active);
      
      if (!user) {
        throw new Error('Invalid email credentials or user account is inactive.');
      }
      
      // Simulate JWT creation matching user role
      const mockToken = `mock-jwt-token-for-${user.role}-${Date.now()}`;
      
      // Persist token in local storage
      authService.saveToken(mockToken);
      
      // Log Audit activity
      mockDb.logAudit('User Login', `User ${email} authenticated successfully (Standalone mode).`);
      
      return {
        user,
        token: mockToken
      };
    }
  },

  /**
   * WHAT IT DOES: Fetches active user profile info from server or local cache on refresh.
   * WHY IT IS REQUIRED: Synchronizes user details state when browser reloads.
   * WHEN IT IS USED: Mounted inside AuthContext useEffect startup checks.
   * 
   * @returns {object} The user profile details
   */
  getCurrentUser: async () => {
    try {
      const response = await authApi.getMe();
      return response.data;
    } catch (error) {
      console.warn('authService.getCurrentUser: API failed. Falling back to local session...', error.message);
      
      // Read from active stored state directly
      const token = authService.getToken();
      const user = localStorage.getItem('auth_user');
      
      if (token && user) {
        return JSON.parse(user);
      }
      throw new Error('No active user session detected.');
    }
  },

  /**
   * WHAT IT DOES: Coordinates session cleanup by notifying backend and wiping local tokens.
   * WHY IT IS REQUIRED: Ensures user logs out securely and terminates any cached session states.
   * WHEN IT IS USED: Triggered on user logouts.
   */
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('authService.logout: API failed. Running local cleanup...', error.message);
    }
    
    // Wipe token
    authService.removeToken();
    localStorage.removeItem('auth_user');
    mockDb.logAudit('User Logout', 'User logged out successfully.');
  }
};

/**
 * WHAT IT DOES: userService manages system credentials (CRUD actions) for administrators.
 * WHY IT IS REQUIRED: Integrates User Management forms with database resources.
 * WHEN IT IS USED: Mounted in UsersPage.jsx when lists refresh or edit modals submit.
 */
export const userService = {
  /**
   * WHAT IT DOES: Fetches the collection of registered users.
   * WHY IT IS REQUIRED: Feeds the table listing in the Users page.
   * WHEN IT IS USED: On users page load.
   */
  getUsers: async () => {
    try {
      const res = await userApi.getAll();
      return res.data;
    } catch (e) {
      return mockDb.getAll(DB_KEYS.USERS);
    }
  },

  /**
   * WHAT IT DOES: Inserts a new user record.
   * WHY IT IS REQUIRED: Registers new credentials into the database.
   * WHEN IT IS USED: On submitting user creation forms.
   */
  createUser: async (user) => {
    try {
      const res = await userApi.create(user);
      return res.data;
    } catch (e) {
      return mockDb.insert(DB_KEYS.USERS, user);
    }
  },

  /**
   * WHAT IT DOES: Overwrites an existing user record.
   * WHY IT IS REQUIRED: Updates user roles or contact profiles.
   * WHEN IT IS USED: On submitting user update forms.
   */
  updateUser: async (id, data) => {
    try {
      const res = await userApi.update(id, data);
      return res.data;
    } catch (e) {
      return mockDb.update(DB_KEYS.USERS, id, data);
    }
  },

  /**
   * WHAT IT DOES: Deletes credentials profile.
   * WHY IT IS REQUIRED: Revokes access permissions for an employee.
   * WHEN IT IS USED: On clicking delete icon on a user row.
   */
  deleteUser: async (id) => {
    try {
      await userApi.delete(id);
      return true;
    } catch (e) {
      return mockDb.delete(DB_KEYS.USERS, id);
    }
  }
};

export default authService;
