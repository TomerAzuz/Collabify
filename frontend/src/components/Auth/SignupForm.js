import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container,
         Card, 
         CardHeader, 
         CardContent, 
         Typography, 
         Grid, 
         Button, 
         ButtonGroup, 
         Alert } from '@mui/material';

import './LoginPage.css';
import { useAuth } from './AuthContext';
import FormField from './FormField';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const { handleAuthentication } = useAuth();

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      return setError("Passwords do not match");
    }
    handleAuthentication(e, 'register', formData);
  };

  return (
    <Container>
      <Card className='login-paper' elevation={2}>
        <CardHeader 
          title="Sign up"
          titleTypographyProps={{ variant: 'h4', textAlign: 'center' }} 
        />
        <CardContent>
          <form onSubmit={handleSubmit} >
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={2} align="center">
              {formFields.map((field) => (
                  <FormField key={field.name} field={field} />
                ))}
              <Grid item xs={12}>
                <ButtonGroup>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    className='login-button'
                    style={{ marginRight: '12px' }}
                  >
                    Sign up
                  </Button>
                </ButtonGroup>
                <Typography 
                  variant='body1' 
                  sx={{ marginTop: 2, color: 'text.secondary' }}>
                    <Link to='/auth/login'>Already have an account?</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignupForm;
