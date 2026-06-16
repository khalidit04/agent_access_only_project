import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';

/**
 * RememberMeCheckbox - A reusable, accessible checkbox component for "Remember Me" functionality.
 *
 * Provides visual hierarchy as a secondary form action with supporting helper text
 * and full screen reader support via aria-describedby.
 *
 * @param {boolean} checked - Controlled checked state
 * @param {function} onChange - Change handler (event, checked)
 * @param {string} helperText - Descriptive text shown below checkbox (e.g., "Stay signed in for 30 days")
 * @param {boolean} [showSecurityWarning] - Optional: show shared device warning
 * @param {string} [className] - Optional additional className
 */
const RememberMeCheckbox = ({
  checked,
  onChange,
  helperText,
  showSecurityWarning = false,
  className,
  ...props
}) => {
  // Generate unique ID for aria-describedby to link checkbox to helper text
  const helperTextId = React.useId();
  const securityWarningId = React.useId();

  const describedByIds = [
    helperText ? helperTextId : null,
    showSecurityWarning ? securityWarningId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box
      sx={{
        mt: 1, // checkbox_margin_top: theme.spacing(1)
        mb: 2, // checkbox_margin_bottom: theme.spacing(2)
      }}
      className={className}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
            inputProps={{
              'aria-describedby': describedByIds || undefined,
              // Ensure checkbox is focusable and toggleable via keyboard (Space)
              // Native checkbox behavior; MUI preserves this
            }}
            sx={{
              color: 'text.secondary',
              '&.Mui-checked': {
                color: 'primary.main', // checkbox_primary
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              // Focus ring for keyboard navigation
              '&.Mui-focusVisible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
            {...props}
          />
        }
        label={
          <Typography
            variant="body2" // checkbox_label_variant
            component="span"
            sx={{ color: 'text.primary' }}
          >
            Remember me
          </Typography>
        }
        sx={{
          // Align checkbox with label properly
          alignItems: 'flex-start',
          // Reduce default padding for tighter form integration
          ml: -1,
          mr: 0,
          '& .MuiFormControlLabel-asterisk': {
            display: 'none', // No required indicator
          },
        }}
      />

      {/* Helper text with aria-describedby linkage */}
      {helperText && (
        <FormHelperText
          id={helperTextId}
          sx={{
            mt: 0.5, // helper_text_margin_top: theme.spacing(0.5)
            ml: 4, // Indent to align with checkbox label
            typography: 'caption', // helper_text_variant
            color: 'text.secondary', // helper_text & helper_text_color
            // Ensure sufficient contrast for accessibility
          }}
        >
          {helperText}
        </FormHelperText>
      )}

      {/* Optional security warning for shared/public devices */}
      {showSecurityWarning && (
        <Typography
          id={securityWarningId}
          variant="caption"
          component="p"
          sx={{
            mt: 0.5,
            ml: 4,
            color: 'warning.main',
            fontWeight: 500,
          }}
        >
          Only use on personal devices. Others using this device may access your account.
        </Typography>
      )}
    </Box>
  );
};

RememberMeCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  showSecurityWarning: PropTypes.bool,
  className: PropTypes.string,
};

RememberMeCheckbox.defaultProps = {
  helperText: '',
  showSecurityWarning: false,
  className: '',
};

export default RememberMeCheckbox;