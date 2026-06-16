import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useRememberMe } from '../../hooks/useRememberMe';

/**
 * LoginForm Component
 * 
 * A login form with username/password fields, "Remember Me" checkbox,
 * and integration with useRememberMe hook for username persistence.
 * 
 * @param {Object} props
 * @param {function} props.onSubmit - Callback fired on successful form submission
 * @param {boolean} [props.loading] - Whether the form is in a loading state
 */
function LoginForm({ onSubmit, loading = false }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const usernameInputRef = useRef(null);
  
  const {
    rememberedUsername,
    setRememberedUsername,
    clearRememberedUsername,
    isLoaded,
  } = useRememberMe();

  // Pre-fill username from localStorage on load, with visual feedback
  useEffect(() => {
    if (isLoaded && rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
      
      // Move cursor to end of input for visual feedback
      const input = usernameInputRef.current;
      if (input) {
        // Use setTimeout to ensure focus happens after render
        setTimeout(() => {
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }, 0);
      }
    }
  }, [isLoaded, rememberedUsername]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
[self.errors, setErrors] = useState({});
    
    if (!validateForm()) {
      return;
    }

    // Handle Remember Me logic
    if (rememberMe) {
      setRememberedUsername(username.trim());
    } else {
      clearRememberedUsername();
    }

    // Call the onSubmit prop with credentials
    onSubmit?.({ username: username.trim(), password, rememberMe });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  // Determine if username was pre-filled for animation trigger
  const wasPreFilled = isLoaded && rememberedUsername && username === rememberedUsername;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'spacing.form_field_gap',
        width: '100%',
      }}
    >
      <TextField
        inputRef={usernameInputRef}
        id="username"
        name="username"
        label="Username"
        type="text"
        autoComplete="username"
        required
        fullWidth
        value={username}
        onChange={handleUsernameChange}
        error={Boolean(errors.username)}
        helperText={errors.username || ''}
        disabled={loading}
        autoFocus={!wasPreFilled}
        sx={{
          // Subtle animation when pre-filled
          '& .MuiInputBase-input': {
            transition: 'background-color 0.3s ease',
            ...(wasPreFilled && {
              backgroundColor: 'action.hover',
            }),
          },
        }}
        // Announce pre-fill to screen readers
        aria-describedby={wasPreFilled ? 'username-prefilled' : undefined}
      />
      
      {wasPreFilled && (
        <Typography
          id="username-prefilled"
          variant="srOnly"
          component="span"
        >
          Your username has been pre-filled from your previous session
        </Typography>
      )}

      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        fullWidth
        value={password}
        onChange={handlePasswordChange}
        error={Boolean(errors.password)}
        helperText={errors.password || ''}
        disabled={loading}
      />

      <FormControlLabel
        control={
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            disabled={loading}
            sx={{
              color: 'checkbox_primary',
              '&.Mui-checked': {
                color: 'checkbox_primary',
              },
            }}
          />
        }
        label={
          <Typography
            variant="label_variant"
            sx={{
              color: 'label_text',
              fontWeight: 'font_weight',
            }}
          >
            Remember Me
          </Typography>
        }
        sx={{
          mt: 'checkbox_margin_top',
          mb: 'checkbox_margin_bottom',
          ml: 0,
          alignItems: 'flex-start',
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        sx={{ mt: 'spacing.form_field_gap' }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </Box>
  );
}

export default LoginForm;