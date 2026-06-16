import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login form with "Remember Me" functionality
 * Integrates with AuthContext for authentication state management
 */
const LoginForm = () => {
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [submitError, setSubmitError] = useState('');

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Handle input changes for text fields
   */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setSubmitError('');
  }, []);

  /**
   * Handle checkbox change for Remember Me
   */
  const handleRememberMeChange = useCallback((event) => {
    const { checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  }, []);

  /**
   * Validate form before submission
   * @returns {boolean}
   */
  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
    };
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password, formData.rememberMe);
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please try again.');
    }
  }, [formData, login]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // theme.spacing(2) = 16px per design tokens
        width: '100%',
        maxWidth: 400,
      }}
    >
      {/* Email Field */}
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        error={Boolean(formErrors.email)}
        helperText={formErrors.email}
        disabled={isLoading}
        required
        fullWidth
        autoComplete="email"
        autoFocus
      />

      {/* Password Field */}
      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={Boolean(formErrors.password)}
        helperText={formErrors.password}
        disabled={isLoading}
        required
        fullWidth
        autoComplete="current-password"
      />

      {/* Remember Me Checkbox with Helper Text */}
      <Box
        sx={{
          mt: '8px', // checkbox_margin_top from design tokens
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              id="remember-me-checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleRememberMeChange}
              disabled={isLoading}
              color="primary"
              inputProps={{
                'aria-describedby': 'remember-me-helper-text',
              }}
              sx={{
                color: 'primary.main', // checkbox_primary from design tokens
                '&.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          }
          label={
            <Typography variant="body2" component="span">
              Remember Me
            </Typography>
          }
          sx={{
            alignItems: 'flex-start',
            marginLeft: -0.5, // Adjust for checkbox default padding
            '& .MuiFormControlLabel-label': {
              marginTop: 0.5, // Visual alignment with checkbox
            },
          }}
        />
        <Typography
          id="remember-me-helper-text"
          variant="caption"
          sx={{
            display: 'block',
            ml: 4, // Align with checkbox label (checkbox width + gap)
            color: 'text.secondary', // text_secondary from design tokens
            mt: 0.5,
          }}
        >
          Stay logged in for 30 days
        </Typography>
      </Box>

      {/* Error Alert */}
      {(error || submitError) && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {submitError || error}
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        fullWidth
        sx={{
          mt: 1, // Additional spacing before button
        }}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  );
};

export default LoginForm;