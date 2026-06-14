import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './pages/LoginPage';

// Optional: Wrap with your app's theme
const theme = createTheme({
  // Your custom theme overrides
});

function App() {
  // Optional: Custom submit handler
  const handleLogin = async (credentials) => {
    const { email, password, rememberMe } = credentials;
    // Your authentication logic
    console.log('Login attempt:', { email, rememberMe });
    
    // Return promise or handle redirect
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    return response.json();
  };

  return (
    <ThemeProvider theme={theme}>
      <LoginPage
        onSubmit={handleLogin}
        brandName="Acme Corp"
        // Optional: custom logo
        logo={<img src="/logo.svg" alt="Acme Corp" />}
      />
    </ThemeProvider>
  );
}

export default App;