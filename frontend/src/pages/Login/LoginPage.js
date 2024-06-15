import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';

import './LoginPage.css';
import { useAuth } from '../../AuthContext';
import AuthForm from '../../components/AuthForm/AuthForm';
import { validateAuthForm } from '../../utils/validation';

const LoginPage = () => {
  const { handleAuthentication } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAuthForm(formData, false);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await handleAuthentication(e, 'email', formData);
      } catch (error) {
        console.error('Authentication failed: ', error.message);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const formFields = [
    {
      name: 'email',
      value: formData.email,
      type: 'text',
      label: 'Email or username',
      onChange: handleChange,
      icon: <Person />,
    },
    {
      name: 'password',
      value: formData.password,
      type: 'password',
      label: 'Password',
      onChange: handleChange,
      icon: <Lock />,
    },
  ];

  return (
    <AuthForm
      title={'Welcome back'}
      formFields={formFields}
      errors={errors}
      buttonText={'Log in'}
      handleSubmit={handleSubmit}
      additionalElement={
        <>
          <Typography
            variant="body1"
            sx={{ marginTop: 2, color: 'text.secondary' }}
          >
            <Link to="/auth/forgot">Forgot password?</Link>
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginTop: 2, color: 'text.secondary' }}
          >
            Don't have an account? <Link to="/auth/signup">Sign up</Link>
          </Typography>
        </>
      }
    />
  );
};

export default LoginPage;
