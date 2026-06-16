import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'app:rememberedUsername';

/**
 * Custom hook to manage "Remember Me" functionality for username persistence.
 * 
 * Encapsulates localStorage logic for getting, setting, and clearing the
 * remembered username. Keeps component logic clean and reusable.
 * 
 * @returns {Object} Hook state and actions
 * @returns {string|null} rememberedUsername - The stored username or null
 * @returns {function} setRememberedUsername - Save username to storage
 * @returns {function} clearRememberedUsername - Remove username from storage
 * @returns {boolean} isLoaded - Whether storage has been checked (for SSR safety)
 */
export function useRememberMe() {
  const [rememberedUsername, setRememberedUsernameState] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRememberedUsernameState(stored);
      }
    } catch (error) {
      // Silently fail if localStorage is unavailable (e.g., private mode)
      console.warn('Unable to access localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Persist username to localStorage
   * @param {string} username - The username to remember
   */
  const setRememberedUsername = useCallback((username) => {
    try {
      localStorage.setItem(STORAGE_KEY, username);
      setRememberedUsernameState(username);
    } catch (error) {
      console.warn('Unable to write to localStorage:', error);
    }
  }, []);

  /**
   * Remove remembered username from localStorage
   */
  const clearRememberedUsername = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRememberedUsernameState(null);
    } catch (error) {
      console.warn('Unable to clear localStorage:', error);
    }
  }, []);

  return {
    rememberedUsername,
    setRememberedUsername,
    clearRememberedUsername,
    isLoaded,
  };
}

export default useRememberMe;