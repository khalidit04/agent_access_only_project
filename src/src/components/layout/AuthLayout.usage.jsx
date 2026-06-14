import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import AuthLayout from './AuthLayout';

// Example: Custom theme extending the design tokens
const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    primary: {
      main: '#1976d2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      background: '#ffebee',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

/**
 * Example usage of AuthLayout for a login page
 */
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setServerError('');

    try {
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Authentication failed');
      }

      // Handle successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
        onSubmit={handleSubmit}
        loading={loading}
        serverError={serverError}
        submitButtonText="Sign In"
        links={{
          forgotPassword: {
            text: 'Forgot your password?',
            href: '/forgot-password',
          },
          createAccount: {
            text: "Don't have an account? Sign up",
            href: '/register',
          },
        }}
      />
    </ThemeProvider>
  );
};

/**
 * Example: Registration page with additional fields
 */
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    // Registration logic...
  };

  // Additional fields for registration
  const additionalFields = (
    <>
      <TextField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="displayName"
        label="Display Name"
        fullWidth
        required
        margin="normal"
      />
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <AuthLayout
        title="Create Account"
        subtitle="Join us today"
        onSubmit={handleSubmit}
        loading={loading}
        additionalFields={additionalFields}
        submitButtonText="Create Account"
        links={{
          createAccount: {
            text: 'Already have an account? Sign in',
            href: '/login',
          },
        }}
      />
    </ThemeProvider>
  );
};

// Export for use in app
export { LoginPage, RegisterPage };
export default LoginPage;