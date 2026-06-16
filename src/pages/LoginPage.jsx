import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  Alert,
  Collapse,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * LoginPage - A responsive, accessible login page with Remember Me functionality
 * 
 * @component
 * @example
 * return <LoginPage onLogin={(credentials) => handleAuth(credentials)} />
 */
const LoginPage = ({ onLogin }) => {
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState({});
  const [showSecurityWarning, setShowSecurityWarning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate unique IDs for ARIA relationships
  const checkboxId = 'remember-me-checkbox';
  const helperTextId = 'remember-me-helper';

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRememberMeChange = (event) => {
    setFormData((prev) => ({ ...prev, rememberMe: event.target.checked }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onLogin?.(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
        backgroundColor: 'background.default',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: '100%',
          // Ensure minimum width doesn't break layout on very small screens
          minWidth: '280px',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            // Responsive width constraints
            maxWidth: { sm: '448px', md: '480px' },
            mx: 'auto',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 600,
                textAlign: 'center',
                color: 'text.primary',
              }}
            >
              Sign In
            </Typography>
          </Box>

          {/* Optional Security Warning for Shared/Public Devices */}
          <Collapse in={showSecurityWarning}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close security warning"
                  color="inherit"
                  size="small"
                  onClick={() => setShowSecurityWarning(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                mb: { xs: 2, sm: 3 },
                '& .MuiAlert-message': {
                  // Ensure text doesn't overflow on small screens
                  overflow: 'hidden',
                },
              }}
            >
              <Typography variant="body2">
                Using a shared or public device? Avoid selecting "Remember Me" to 
                protect your account.
              </Typography>
            </Alert>
          </Collapse>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            {/* Email Field */}
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              inputProps={{
                'aria-label': 'Email address',
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              inputProps={{
                'aria-label': 'Password',
              }}
            />

            {/* Remember Me Checkbox Section */}
            <Box
              sx={{
                mt: theme.spacing(1), // checkbox_margin_top
                mb: theme.spacing(2), // checkbox_margin_bottom
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    id={checkboxId}
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                    inputProps={{
                      // Link checkbox to helper text for screen readers
                      'aria-describedby': checkboxId,
                      // Ensure proper keyboard handling (Space to toggle)
                      // This is default MUI behavior, but explicit for clarity
                    }}
                    sx={{
                      // Custom focus ring with primary color at 0.2 opacity
                      '&.Mui-focusVisible': {
                        outline: `3px solid ${theme.palette.primary.main}33`,
                        outlineOffset: '2px',
                      },
                      // Hover state enhancement
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      // Ensure checkbox is properly sized for touch targets
                      padding: '9px',
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      color: 'text.primary',
                      // Prevent text selection for better UX
                      userSelect: 'none',
                    }}
                  >
                    Remember me
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  // Ensure proper spacing between checkbox and label
                  '& .MuiFormControlLabel-label': {
                    ml: 0.5,
                  },
                }}
              />
              
              {/* Helper Text - Linked via aria-describedby */}
              <FormHelperText
                id={helperTextId}
                sx={{
                  mt: theme.spacing(0.5), // helper_text_margin_top
                  ml: '34px', // Align with checkbox label (checkbox width + spacing)
                  color: 'text.secondary', // helper_text color
                  // Typography variant for helper text
                  ...theme.typography.caption,
                }}
              >
                Stay signed in for 30 days
              </FormHelperText>
            </Box>

            {/* Sign In Button - Primary action, visually dominant */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                mt: { xs: 1, sm: 2 },
                py: { xs: 1.25, sm: 1.5 },
                // Ensure minimum touch target size
                minHeight: '48px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Additional Links */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                mt: { xs: 2, sm: 3 },
              }}
            >
              <Button
                href="#forgot-password"
                variant="text"
                size="small"
                sx={{
                  textTransform: 'none',
                  color: 'primary.main',
                  // Ensure touch target on mobile
                    minHeight: { xs: '44px', sm: 'auto' },
                }}
              >
                Forgot password?
              </Button>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                |
              </Typography>
              <Button
                href="#create-account"
                variant="text"
                size="small"
                sx={{
                  textTransform: 'none',
                  color: 'primary.main',
                  minHeight: { xs: '44px', sm: 'auto' },
                }}
              >
                Create account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;