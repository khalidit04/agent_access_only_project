import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import RememberMeCheckbox from './RememberMeCheckbox';

/**
 * Example LoginForm demonstrating RememberMeCheckbox placement and integration.
 * Shows the checkbox positioned between password field and Sign In button
 * with natural form flow and visual hierarchy.
 */
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleRememberMeChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: event.target.checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit logic here
    console.log('Form submitted:', formData);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 }, // Responsive padding from 320px up
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400, // Constrain width for readability
          p: { xs: 3, sm: 4 }, // Responsive padding
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}
        >
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <TextField
            fullWidth
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            sx={{ mb: 2 }}
          />

          {/* Password field */}
          <TextField
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            margin="normal"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            sx={{ mb: 0 }}
          />

          {/* 
            RememberMeCheckbox positioned between password and Sign In button.
            Visual hierarchy: secondary action before primary submission.
          */}
          <RememberMeCheckbox
            checked={formData.rememberMe}
            onChange={handleRememberMeChange}
            helperText="Stay signed in for 30 days"
            showSecurityWarning
          />

          {/* Primary submission action - visually dominant */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;