import React, { useState, forwardRef } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/**
 * Password strength levels for future implementation
 * @typedef {0|1|2|3|4} PasswordStrength
 */

/**
 * PasswordField - A reusable password input with visibility toggle
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {boolean} [props.showStrengthIndicator=false] - Whether to show strength indicator
 * @param {number} [props.strength] - Password strength (0-4) for indicator
 * @param {string} [props.helperText] - Additional helper text
 * @param {Object} [props.sx] - Additional sx prop styles
 */
const PasswordField = forwardRef(function PasswordField(
  {
    label = 'Password',
    showStrengthIndicator = false,
    strength,
    helperText,
    sx = {},
    error,
    ...textFieldProps
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Generate strength indicator color
  const getStrengthColor = (strengthLevel) => {
    const colors = {
      0: 'error.main',
      1: 'error.light',
      2: 'warning.main',
      3: 'success.light',
      4: 'success.main',
    };
    return colors[strengthLevel] || 'grey.300';
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <TextField
        ref={ref}
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label={label}
        variant="outlined"
        size="medium"
        error={error}
        autoComplete="current-password"
        inputProps={{
          'aria-label': label,
          'aria-describedby': showStrengthIndicator ? 'password-strength-indicator' : undefined,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleaToggleVisibility}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: (theme) => theme.spacing(7), // 56px
            borderRadius: 1, // 8px
          },
        }}
        {...ryptFieldProps}
      />
      
      {/* Password Strength Indicator Placeholder */}
      {showStrengthIndicator && (
        <Box
          id="password-strength-indicator"
          sx={{ mt: 1 }}
          aria-live="polite"
        >
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              height: 4,
              mb: 0.5,
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  borderRadius: 0.5,
                  backgroundColor:
                    strength !== undefined && index < strength
                      ? getStrengthColor(strength)
                      : 'divider',
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            color={strength !== undefined ? getStrengthColor(strength) : 'text.secondary'}
          >
            {strength !== undefined
              ? ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'][strength] || ''
              : 'Password strength indicator'}
          </Typography>
        </Box>
      )}

      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
});

export default PasswordField;