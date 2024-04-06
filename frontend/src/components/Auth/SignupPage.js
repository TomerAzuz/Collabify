import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container,
         Card, 
         CardHeader, 
         CardContent, 
         Typography, 
         Grid, 
         Button, 
         Alert } from '@mui/material';

import './LoginPage.css';
import { useAuth } from './AuthContext';
import FormField from './FormField';
import LoginMethodButtons from './LoginMethodButtons';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const { handleAuthentication, error } = useAuth();

  const formFields = [{
      name: 'displayName',
      value: formData.displayName,
      type: 'text',
      label: 'Full name',
      onChange: e => handleChange(e),
    },{
      name: 'email',
      value: formData.email,
      type: 'text',
      label: 'Email or username',
      onChange: e => handleChange(e),
    }, {
      name: 'password',
      value: formData.password,
      type: 'password',
      label: 'Password',
      onChange: e => handleChange(e),
    },{
      name: 'passwordConfirm',
      value: formData.passwordConfirm,
      type: 'password',
      label: 'Confirm password',
      onChange: e => handleChange(e),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      setErrors({ ...errors, email: value ? '' : 'Email is required' });
    } else if (name === 'password') {
      setErrors({ ...errors, password: value ? '' : 'Password is required' });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    let formValid = true;
    Object.values(formData).forEach(value => {
      if (!value) {
        formValid = false;
      }
    });

    if (formValid) {
      if (formData.password !== formData.passwordConfirm) {
        setErrors({ ...errors, passwordConfirm: 'Passwords do not match' });
      } else {
        handleAuthentication(e, 'register', formData);
      }
    } else {
      setErrors({
        displayName: formData.displayName ? '' : 'Full name is required',
        email: formData.email ? '' : 'Email is required',
        password: formData.password ? '' : 'Password is required',
        passwordConfirm: formData.passwordConfirm ? '' : 'Confirm password is required',
      });
    }
  };

  return (
    <Container>
      <Card className='login-paper' elevation={2}>
        <CardHeader
          title="Create an account"
          titleTypographyProps={{ 
            variant: 'h4', 
            textAlign: 'center', 
            fontWeight: 'bold' 
          }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && <Alert sx={{ marginBottom: '15px' }} severity="error">{error}</Alert>} 
            <Grid container spacing={2} align="center">
              {formFields.map((field) => (
                <FormField 
                  key={field.name} 
                  field={field} 
                  error={errors[field.name]} 
                />
              ))}
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#ffffff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#388e3c',
                    },
                  }}
                >
                  Sign up
                </Button>
                <Typography
                  variant='body1'
                  sx={{ marginTop: 2, color: 'text.secondary' }}>
                  Already have an account? <Link to='/auth/login'>Login</Link>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <div className="lineAround">
                  <Typography variant='paragraph' align='center' gutterBottom>
                    OR
                  </Typography>
                </div>
              </Grid>
              <LoginMethodButtons />
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignupPage;
