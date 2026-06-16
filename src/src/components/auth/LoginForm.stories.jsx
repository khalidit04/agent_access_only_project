/**
 * Usage Example and Storybook story for LoginForm
 */

import LoginForm from './LoginForm';

// Example usage in your app
function App() {
  const handleLogin = async (data) => {
    // Simulate API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }

    return response.json();
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    console.log('Navigate to forgot password');
  };

  const handleCreateAccount = () => {
    // Navigate to registration page
    console.log('Navigate to create account');
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onForgotPassword={handleForgotPassword}
      onCreateAccount={handleCreateAccount}
      brandName="Acme Corp"
      // Optional: logo={<YourLogo />}
    />
  );
}

export default App;