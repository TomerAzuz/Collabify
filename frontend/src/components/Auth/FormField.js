import React, { useState } from 'react';
import { TextField, Grid, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const FormField = ({ field, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid item xs={12}>
      <TextField
        style={{ width: '30%' }}
        variant='outlined'
        label={field.label}
        name={field.name}
        type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
        value={field.value}
        autoComplete={field.name}
        onChange={field.onChange}
        error={Boolean(error)}
        helperText={error}
        InputProps={{
          startAdornment: field.icon,
          endAdornment: field.type === 'password' && (
            <InputAdornment position="end">
              <IconButton
                aria-label="showPassword"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
};

export default FormField;