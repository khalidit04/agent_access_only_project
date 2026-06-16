import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginForm from './LoginForm';

// Theme with design tokens applied
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
    },
  },
  shape: {
    borderRadius: 8,
  },
});

/**
 * Usage Example
 */
function App() {
  const handleSubmit = async (credentials) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'error@example.com') {
          reject(new Error('Invalid email or password'));
        } else {
          console.log('Login successful:', credentials);
          resolve({ success: true });
        }
      }, 1500);
    });
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  const handleCreateAccount = () => {
    console.log('Navigate to create account');
  };

  return (
    <ThemeProvider theme={theme}>
      <LoginForm
        onSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
        onCreateAccount={handleCreateAccount}
        showRememberMe={true}
        brandName="Acme Corp"
      />
    </ThemeProvider>
  );
}

export default App;