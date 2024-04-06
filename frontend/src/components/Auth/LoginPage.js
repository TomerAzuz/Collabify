import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Card, Container, CardContent, CardHeader, Alert } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';

import './LoginPage.css';
import { useAuth } from './AuthContext';
import FormField from './FormField';
import LoginMethodButtons from './LoginMethodButtons';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const { handleAuthentication, error } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      setErrors({ ...errors, email: value ? '' : 'Email is required' });
    } else if (name === 'password') {
      setErrors({ ...errors, password: value ? '' : 'Password is required' });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    let formValid = true;
    Object.values(formData).forEach(value => {
      if (!value) {
        formValid = false;
      }
    });

    if (formValid) {
      try {
        await handleAuthentication(e, 'email', formData);
      } catch (error) {
        console.error('Authentication failed: ', error.message);
      }
    } else {
      setErrors({
        email: formData.email ? '' : 'Email is required',
        password: formData.password ? '' : 'Password is required',
      });
    }
  };

  const formFields = [{
    name: 'email',
    value: formData.email,
    type: 'text',
    label: 'Email or username',
    onChange: handleChange,
    icon: <Person />,
  }, {
    name: 'password',
    value: formData.password,
    type: 'password',
    label: 'Password',
    onChange: handleChange,
    icon: <Lock />,
  }];

  return (
    <Container className="login-page">
      <Card className='login-paper' elevation={2}>
        <CardHeader
          title="Welcome back"
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
              {formFields.map((field, index) => (
                <FormField 
                  key={index} 
                  field={field} 
                  error={errors[field.name]} 
                />
              ))}
              <Grid item xs={12}>
                <Button
                  variant='contained'
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
                  Log in
                </Button>
                <Typography variant='body1' 
                  sx={{ 
                    marginTop: 2, 
                    color: 'text.secondary' 
                    }}
                  >
                  Don't have an account? <Link to='/auth/signup'>Sign up</Link>
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

export default LoginPage;
