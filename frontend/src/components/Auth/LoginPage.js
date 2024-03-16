import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Card, Container, CardContent, CardHeader, Alert } from '@mui/material';
import { Person, Lock, Google, GitHub } from '@mui/icons-material';

import './LoginPage.css'
import { useAuth } from './AuthContext';
import FormField from './FormField';
import LoginButton from './LoginButton';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { handleAuthentication } = useAuth();

  const formFields = [{
      name: 'email',
      value: formData.email,
      type: 'text',
      label: 'Email or username',
      onChange: e => handleChange(e),
      icon: <Person />,
    }, {
      name: 'password',
      value: formData.password,
      type: 'password',
      label: 'Password',
      onChange: e => handleChange(e),
      icon: <Lock />,
    },
  ];

  const loginMethodsButtons = [{
      icon: <Google />,
      method: 'google',
    }, {
      icon: <GitHub />,
      method: 'github',
    },
  ];
  
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>
      <Typography variant='h3' textAlign='center'>Collabify</Typography>
      <Card className='login-paper' elevation={2}>
        <CardHeader 
          title="Sign in"
          titleTypographyProps={{ variant: 'h4', textAlign: 'center' }} 
        />
        <CardContent>
          <form>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={2} align="center">
              {formFields.map((field) => (
                <FormField key={field.name} field={field} />
              ))}
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    type='submit'
                    className='login-button'
                    onClick={e => {handleAuthentication(e, 'email', formData)}}
                    style={{ marginRight: '12px' }}
                  >
                    Log in
                  </Button>
                  <Button component={Link} to="/signup" variant="contained">
                    Create account
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5' align='center' gutterBottom>
                    OR
                  </Typography>
                </Grid>
                {loginMethodsButtons.map((button) => (
                  <LoginButton 
                    key={button.method} 
                    icon={button.icon} 
                    method={button.method}
                  />
                ))}
              </Grid>
            </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
