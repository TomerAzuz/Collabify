import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Person } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import './LoginPage.css';
import { useAuth } from './AuthContext';
import AuthForm from './AuthForm';
import { isValidEmail } from '../Common/Utils/validation';

const PasswordResetPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({
      ...errors,
      email: '',
    });
  };

  const formFields = [{
    name: 'email',
    value: email,
    type: 'text',
    label: 'Email or username',
    onChange: handleChange,
    icon: <Person />,
  }];

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email) {
      setErrors({ ...errors, email: 'Email is required' });
    } else if (!isValidEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else {
      try {
        await resetPassword(email);
        toast.success('Password reset email sent successfully.');
        navigate('/');
      } catch (error) {
        toast.error('Failed to reset password.');
      }
    }
  };

  return (
    <AuthForm 
      title={'Forgot Password?'}
      formFields={formFields}
      errors={errors}
      buttonText={'Submit'}
      handleSubmit={handleSubmit}
    />
  );
};

export default PasswordResetPage;