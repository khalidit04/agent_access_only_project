/**
 * Authentication service for API communication
 */

/**
 * Mock authentication function - replace with actual API call
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to create a persistent session
 * @returns {Promise<{user: Object, token: string}>}
 */
export const authenticate = async (email, password, rememberMe = false) => {
  // Simulate APIetti
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation - replace with actual API
      if (!email || !password) {
        reject(new Error('Email and password are required'));
        return;
      }

      if (password.length < 6) {
        reject(new Error('Invalid credentials'));
        return;
      }

      // Simulate successful authentication
      const mockUser = {
        id: 'user-123',
        email,
        name: 'Test User',
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('auth_token', mockToken);
      } else {
        sessionStorage.setItem('auth_token', mockToken);
      }

      resolve({
        user: mockUser,
        token: mockToken,
        rememberMe,
      });
    }, 800); // Simulate network delay
  });
};

/**
 * Clear all stored authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('auth_remember_me');
};

/**
 * Get stored token based on remember me preference
 * @returns {string|null}
 */
export const getStoredToken = () => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};