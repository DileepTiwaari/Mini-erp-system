// src/hooks/useAuth.js
// 
// WHAT IT DOES:
// A custom React hook wrapper around React's useContext(AuthContext). It returns the 
// authentication state and operational handles (user, token, login, logout, etc.).
// 
// WHY IT IS REQUIRED:
// 1. Encourages encapsulation: hides React's context lookup mechanics.
// 2. Improves developer efficiency: avoids importing both `useContext` and `AuthContext` in every component.
// 3. Centralizes auth validations, ensuring that components read consistent access methods.
// 
// WHEN IT IS USED:
// Triggered by components that need to read active user details (like showing profiles in headers) 
// or run login actions (like forms) or check role strings in route controllers.

import { useAuth } from '../context/AuthContext';

/**
 * WHAT IT DOES: Default exported hook to fetch the global authentication context.
 * WHY IT IS REQUIRED: Simplifies context access for frontend developers.
 * WHEN IT IS USED: Invoked in Login Forms, Top Navbars, Sidebars, and Route protection guards.
 * 
 * @returns {object} The active authentication context parameters (user, token, login, logout, isAuthenticated, loading)
 */
const useAuthHook = () => {
  return useAuth();
};

export default useAuthHook;
