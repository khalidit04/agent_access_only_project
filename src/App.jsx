import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/LoginPage';

const theme = createTheme({
  // Your custom theme configuration
});

function App() {
  const handleLogin = async (credentials) => {
    console.log('Login attempt:', credentials);
    // API call to authenticate
    // const response = await api.login(credentials);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage onLogin={handleLogin} />
    </ThemeProvider>
  );
}

export default App;