import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * @typedef {Object} AuthContextValue
 * @property {Object|null} user - Current authenticated user
 * @property {boolean} isAuthenticated - Whether user is currently authenticated
 * @property {boolean} isLoading - Loading state for auth operations
 * @property {string|null} error - Error message from last auth operation
 * @property {boolean} rememberMe - Whether to persist session long-term
 * @property {function} login - Authenticate with credentials
 * @property {function} logout - Clear authentication
 * @property {function} setRememberMe - Update remember me preference
 */

const AuthContext = createContext(null);

/**
 * Custom hook to access authentication context
 * @returns {AuthContextValue}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component for authentication state management
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  /**
   * Authenticate user with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} [rememberMePreference] - Whether to persist session
   */
  const login = useCallback(async (email, password, rememberMePreference = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import to avoid circular dependency
      const { authenticate } = await import('../services/auth');
      const response = await authenticate(email, password, rememberMePreference);
      
      setUser(response.user);
      setIsAuthenticated(true);
      setRememberMe(rememberMePreference);
      
      // Store remember me preference for session restoration
      if (rememberMePreference) {
        localStorage.setItem('auth_remember_me', 'true');
      } else {
        localStorage.removeItem('auth_remember_me');
      }

      return response;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear authentication state
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('auth_remember_me');
    // Additional cleanup (tokens, etc.) would happen here
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    rememberMe,
    setRememberMe,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;