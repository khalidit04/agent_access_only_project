import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlined from '@mui/icons-material/LockOutlined';

// ============================================
// Validation Utilities
// ============================================

const VALIDATION_RULES = {
  email: {
    required: 'Email or username is required',
    validate: (value) => {
      if (!value.trim()) return 'Email or username is required';
      // Allow both email and username formats
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
      if (!emailRegex.test(value) && !usernameRegex.test(value)) {
        return 'Please enter a valid email or username (at least 3 characters)';
      }
      return '';
    },
  },
  password: {
    required: 'Password is required',
    validate: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    },
  },
};

// ============================================
// Sub-component: PasswordVisibilityToggle
// ============================================

/**
 * Accessible password visibility toggle button
 */
const PasswordVisibilityToggle = ({ visible, onToggle, inputId }) => {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-controls={inputId}
        aria-expanded={visible}
        onClick={onToggle}
        edge="end"
        size="large"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
          },
        }}
      >
        {visible ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
};

// ============================================
// Sub-component: AuthFormField
// ============================================

/**
 * Reusable form field with validation support
 */
const AuthFormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  autoComplete,
  autoFocus = false,
  inputProps,
  InputProps,
  ...props
}) => {
  return (
    <TextField
      id={id}
      name={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error || helperText}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      fullWidth
      required
      variant="outlined"
      margin="normal"
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 56, // inputHeight token
          borderRadius: 1, // shape.borderRadius
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          marginTop: 0.5,
        },
      }}
      inputProps={{
        'aria-invalid': !!error,
        'aria-describedby': error ? `${id}-error` : undefined,
        ...inputProps,
      }}
      InputProps={InputProps}
      {...props}
    />
  );
};

// ============================================
// Main Component: AuthLayout
// ============================================

/**
 * AuthLayout - Shared layout wrapper for authentication pages
 * 
 * Provides consistent card styling, max-width constraint, and responsive padding.
 * Supports login, register, and forgot-password flows.
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (e.g., "Sign In")
 * @param {string} props.subtitle - Optional subtitle text
 * @param {function} props.onSubmit - Form submission handler
 * @param {boolean} props.loading - Loading state
 * @param {string} props.serverError - Server-side error message
 * @param {React.ReactNode} props.additionalFields - Extra form fields (for register, etc.)
 * @param {string} props.submitButtonText - Text for submit button
 * @param {Object} props.links - Configuration for footer links
 */
const AuthLayout = ({
  title = 'Sign In',
  subtitle,
  onSubmit,
  loading = false,
  serverError,
  additionalFields = null,
  submitButtonText = 'Sign In',
  links = {},
}) => {
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [liveRegionMessage, setLiveRegionMessage] = useState('');
  
  // Refs for focus management
  const cardRef = useRef(null);
  const firstInputRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Announce server errors to screen readers
  useEffect(() => {
    if (serverError) {
      setLiveRegionMessage(serverError);
      // Clear after announcement to allow re-announcement
      const timer = setTimeout(() => setLiveRegionMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  // Validation
  const validateField = useCallback((name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return '';
    return rule.validate(value);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((fieldName) => {
      if (fieldName === 'email' || fieldName === 'password') {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  // Event handlers
  const handleChange = useCallback((event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((event) => {
    const { name, value } = event.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    if (!validateForm()) {
      // Focus first error field
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    onSubmit?.(formData);
  }, [formData, onSubmit, validateForm]);

  const handleKeyDown = useCallback((event) => {
    // Enter key submits form when not in a textarea
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      // Let default form submission handle it if we're on the submit button
      if (event.target.type !== 'submit') {
        submitButtonRef.current?.click();
      }
    }
  }, []);

  // Default link configurations
  const defaultLinks = {
    forgotPassword: { text: 'Forgot password?', href: '/forgot-password' },
    createAccount: { text: "Don't have an account? Create one", href: '/register' },
  };
  const mergedLinks = { ...defaultLinks, ...links };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Card
        ref={cardRef}
        sx={{
          width: '100%',
          maxWidth: 448, // cardMaxWidth token
          borderRadius: 1, // shape.borderRadius
          boxShadow: theme.shadows[3],
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 }, // cardPadding responsive
            '&:last-child': { pb: { xs: 3, sm: 4 } },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockOutlined sx={{ color: 'primary.contrastText' }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                textAlign: 'center',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Live region for screen reader announcements */}
          <Box
            aria-live="polite"
            aria-atomic="true"
            sx={{
              position: 'absolute',
              width: 1,
              height: 1,
              p: 0,
              m: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            {liveRegionMessage}
          </Box>

          {/* Server Error Alert */}
          {serverError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              role="alert"
            >
              {serverError}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            noValidate
          >
            <AuthFormField
              id="email"
              label="Email or Username"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              autoComplete="username email"
              autoFocus
              inputRef={firstInputRef}
            />

            <AuthFormField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <PasswordVisibilityToggle
                    visible={showPassword}
                    onToggle={handleTogglePasswordVisibility}
                    inputId="password"
                  />
                ),
              }}
            />

            {/* Remember Me */}
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Remember me"
              sx={{
                mt: 1,
                mb: 2,
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                },
              }}
            />

            {/* Additional fields (for register, etc.) */}
            {additionalFields}

            {/* Submit Button */}
            <Button
              ref={submitButtonRef}
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: 48,
                mt: 2,
                mb: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:disabled': {
                  bgcolor: 'primary.main',
                  opacity: 0.7,
                },
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                  sx={{ color: 'primary.contrastText' }}
                />
              ) : (
                submitButtonText
              )}
            </Button>

            {/* Footer Links */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mt: 2,
              }}
            >
              {mergedLinks.forgotPassword && (
                <Link
                  href={mergedLinks.forgotPassword.href}
                  variant="body2"
                  color="primary"
                  underline="hover"
                  sx={{ textAlign: 'center' }}
                >
                  {mergedLinks.forgotPassword.text}
                </Link>
              )}
              {mergedLinks.createAccount && (
                <Link
                  href={mergedLinks.createAccount.href}
                  variant="body2"
                  color="primary"
                  underline="hover"
                  sx={{ textAlign: 'center' }}
                >
                  {mergedLinks.createAccount.text}
                </Link>
              )}
            </Box>

            {/* Divider for social login or alternative methods */}
            <Divider sx={{ my: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 2 }}
              >
                or
              </Typography>
            </Divider>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Protected by reCAPTCHA and subject to our{' '}
              <Link href="/privacy" underline="hover">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" underline="hover">
                Terms of Service
              </Link>
              .
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthLayout;