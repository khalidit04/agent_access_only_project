import { useState } from 'react';
import LoginForm from './components/LoginForm/LoginForm';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async ({ username, password, rememberMe }) => {
    setIsLoading(true);
    try {
      // Your login API call here
      const response = await api.login({ username, password });
      // Handle success...
    } catch (error) {
      // Handle error...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin} 
      loading={isLoading} 
    />
  );
}