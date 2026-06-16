import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import PasswordField from './PasswordField';

/**
 * LoginForm - Branded login form with full accessibility and validation
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Called with {email, password, rememberMe} on valid submission
 * @param {Function} [props.onForgotPassword] - Called when forgot password is clicked
 * @param {Function} [props.onCreateAccount] - Called when create account is clicked
 * @param {boolean} [props.showRememberMe=true] - Whether to show remember me checkbox
 * @param {string} [props.brandName] - Optional brand name to display
 */
const LoginForm = ({
  onSubmit,
  onForgotPassword,
  onCreateAccount,
  showRememberMe = true,
  brandName = 'Your Brand',
}) => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Refs for focus management
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const submitButtonRef = useRef(null);
  const errorRef = useRef(null);

  // Validation rules
  const validateField = useCallback((name, value) => {
    const newErrors = {};

    switch (name) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email or username is required';
        } else if (value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        break;
      default:
        break;
    }

    return newErrors;
  }, []);

  const validateForm = useCallback(() => {
    const emailErrors = validateField('email', email);
    const passwordErrors = validateField('password', password);
    return { ...emailErrors, ...passwordErrors };
  }, [email, password, validateField]);

  // Handlers
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateField(field, field === 'email' ? email : password);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      const fieldErrors = validateField('email', value);
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
    setServerError('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Show strength indicator when user starts typing
    if (value.length > 0 && !showPasswordStrength) {
      setShowPasswordStrength(true);
    }
    
    if (touched.password) {
      const fieldErrors = validateField('password', value);
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ email: true, password: true });

    // Validate
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      // Focus first error field
      if (formErrors.email) {
        emailRef.current?.focus();
      } else if (formErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    // Submit
    setIsSubmitting(true);
    setServerError('');

    try {
      await onSubmit({ email, password, rememberMe });
    } catch (error) {
      setServerError(
        error.message || 'Unable to sign in. Please check your credentials and try again.'
      );
      // Focus error announcement for screen readers
      setTimeout(() => {
        errorRef.current?.focus();
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit(e);
    }
  };

  // Calculate password strength for demo (placeholder logic)
  const calculateStrength = (pwd) => {
    if (!pwd) return undefined;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 448, // cardMaxWidth from tokens
          borderRadius: 1, // 8px
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 }, // cardPadding responsive
            '&:last-child': { pb: { xs: 3, sm: 4 } },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Sign in to {brandName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your details to access your account
            </Typography>
          </Box>

          {/* Server Error - Non-blocking inline */}
          <Fade in={!!serverError}>
            <Alert
              ref={errorRef}
              severity="error"
              sx={{ mb: 3 }}
              tabIndex={-1}
              role="alert"
              aria-live="polite"
            >
              {serverError}
            </Alert>
          </Fade>

          {/* Live region for client-side validation announcements */}
          <Box
            sx={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {Object.entries(errors).map(
              ([field, message]) => `${field} error: ${message}`
            )}
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <TextField
              ref={emailRef}
              fullWidth
              id="email"
              name="email"
              label="Email or username"
              type="text"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email ? errors.email : ' '}
              disabled={isSubmitting}
              autoComplete="username email"
              autoFocus
              required
              inputProps={{
                'aria-label': 'Email or username',
                'aria-describedby': 'email-helper-text',
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  height: 56, // inputHeight
                  borderRadius: 1,
                },
              }}
            />

            {/* Password Field */}
            <PasswordField
              ref={passwordRef}
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              error={touched.password && !!errors.password}
              helperText={
                touched.password && errors.password ? errors.password : ' '
              }
              disabled={isSubmitting}
              showStrengthIndicator={showPasswordStrength}
              strength={calculateStrength(password)}
              sx={{ mb: 1.5 }}
            />

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mb: 3,
                mt: 1,
              }}
            >
              {showRememberMe && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isSubmitting}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.primary">
                      Remember me
                    </Typography>
                  }
                />
              )}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onForgotPassword}
                disabled={isSubmitting}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  '&:disabled': { color: 'text.disabled' },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              ref={submitButtonRef}
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
              sx={{
                height: 48,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" aria-label="Signing in..." />
              ) : (
                'Sign in'
              )}
            </Button>

            {/* Create Account */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={onCreateAccount}
                  disabled={isSubmitting}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    '&:disabled': { color: 'text.disabled' },
                  }}
                >
                  Create account
                </Link>
              </Typography>
            </Box>

            {/* Divider for visual separation */}
            <Divider sx={{ my: 3 }} />

            {/* Accessibility note - visually hidden */}
            <Typography
              component="div"
              sx={{
                position: 'absolute',
                left: -9999,
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              Press Tab to navigate between fields. Press Enter to submit the form.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;