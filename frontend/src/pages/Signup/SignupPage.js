import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

import '../Login/LoginPage.css';
import { useAuth } from '../../AuthContext';
import AuthForm from '../../components/AuthForm/AuthForm';
import { validateAuthForm } from '../../utils/validation';

const SignupPage = () => {
  const { handleAuthentication } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({});

  const formFields = [
    {
      name: 'displayName',
      value: formData.displayName,
      type: 'text',
      label: 'Full name',
      onChange: (e) => handleChange(e),
    },
    {
      name: 'email',
      value: formData.email,
      type: 'text',
      label: 'Email or username',
      onChange: (e) => handleChange(e),
    },
    {
      name: 'password',
      value: formData.password,
      type: 'password',
      label: 'Password',
      onChange: (e) => handleChange(e),
    },
    {
      name: 'passwordConfirm',
      value: formData.passwordConfirm,
      type: 'password',
      label: 'Confirm password',
      onChange: (e) => handleChange(e),
    },
  ];

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

    const validationErrors = validateAuthForm(formData, true);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await handleAuthentication(e, 'register', formData);
      } catch (error) {
        console.error('Authentication failed: ', error.message);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <AuthForm
      title={'Create an account'}
      formFields={formFields}
      errors={errors}
      buttonText={'Sign up'}
      handleSubmit={handleSubmit}
      additionalElement={
        <>
          <Typography
            variant="body1"
            sx={{ marginTop: 2, color: 'text.secondary' }}
          >
            Already have an account? <Link to="/auth/login">Login</Link>
          </Typography>
        </>
      }
    />
  );
};

export default SignupPage;
