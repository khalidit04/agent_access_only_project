import { useState, useCallback } from 'react';
import * as authService from '../services/auth';

/**
 * Hook for managing authentication state and operations.
 *
 * @returns {Object} Authentication state and handlers
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Authenticate user with credentials.
   *
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @param {boolean} [credentials.rememberMe]
   */
  const login = useCallback(async ({ email, password, rememberMe }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login({ email, password, rememberMe });
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log out the current user.
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
}