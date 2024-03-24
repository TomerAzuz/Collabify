import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Card, Container, CardContent, CardHeader, Alert } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';

import './LoginPage.css';
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
  }];


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container className="login-page">
      <Card className='login-paper' elevation={2}>
        <CardHeader
          title="Welcome back"
          titleTypographyProps={{ variant: 'h4', textAlign: 'center', fontWeight: 'bold' }}
        />
        <CardContent>
          <form>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={2} align="center">
              {formFields.map((field, index) => (
                <FormField key={index} field={field} />
              ))}
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  type='submit'
                  className='login-button'
                  onClick={e => { handleAuthentication(e, 'email', formData) }}
                  style={{ marginRight: '12px' }}
                >
                  Log in
                </Button>
                <Typography 
                  variant='body1' 
                  sx={{ marginTop: 2, color: 'text.secondary' }}>
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
              <LoginButton />
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
