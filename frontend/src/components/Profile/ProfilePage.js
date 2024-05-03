import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth';
import { Typography } from '@mui/material';
import { toast } from 'react-hot-toast';

import './ProfilePage.css';
import { useAuth } from '../Auth/AuthContext';
import { validateProfileForm } from '../Common/Utils/validation';
import Logo from '../Common/Logo/Logo.js';
import DeleteAccountButton from './DeleteAccount/DeleteAccountButton.js';
import DeleteAccountDialog from './DeleteAccount/DeleteAccountDialog.js';
import PasswordDialog from './PasswordDialog.js';
import ProfiileSection from './ProfileSection.js';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, handleReauthentication } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    newPassword: ''
  });
  
  const [password, setPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [field, setField] = useState(null);
  const [isDeleteDialogOpen, setisDeleteDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      password: ''
    });
  };

  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };

  const handleCloseDeleteAccountDialog = () => {
    setisDeleteDialogOpen(false);
  };

  const validateField = async (e, fieldName) => {
    e.preventDefault();

    setField(fieldName);
    const validationErrors = validateProfileForm(formData);
    const isEmailProvider = user.providerData[0].providerId === 'password';

    if (Object.keys(errors).length === 0) {
      if (isEmailProvider) {
        setIsPasswordDialogOpen(true);
      } else {
        handleConfirmAction(e);
      }                        
    } else {
      setErrors(validationErrors);
    }
  };

  const handleFormChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setErrors({ ...errors, [name]: '' });
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    
    try {
      const userCredential = await handleReauthentication(password);
      switch (field) {
        case 'photoURL':
          await updateProfile(userCredential.user, { photoURL: formData.photoURL });
          toast.success('Profile picture updated successfully.');
          break;
        case 'displayName':
          await updateProfile(userCredential.user, { displayName: formData.displayName });
          toast.success('Name updated successfully.');
          break;
        case 'email':
          await verifyBeforeUpdateEmail(userCredential.user, formData.email);
          toast.success('Email updated successfully.');
          break;
        case 'password':
          await updatePassword(userCredential.user, formData.password);
          toast.success('Password updated successfully.');
          break;
        default:
          break;
      }

      resetForm();
      setField(null);
      setErrors({});
      navigate('/dashboard');

    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsPasswordDialogOpen(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await handleReauthentication(password);
      await userCredential.user.delete();
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const formFields = [
    {
      title: 'Profile picture',
      subtitle: 'Add a profile picture to personalize your account',
      value: 'photoURL',
      avatar: user?.photoURL,
    },
    {
      title: 'Name',
      subtitle: user?.displayName,
      value: 'displayName',
      autoComplete: 'username',
    },
    { 
      title: 'Email',
      value: 'email',
      subtitle: user?.email,
    },
    {
      title: 'Password',
      value: 'password',
      autoComplete: 'new-password',
    }
  ];

  return (
    <>
      <Logo variant={'h2'} />
      <div className="profile-container">
        <Typography variant="h2" gutterBottom>
          Profile Information
        </Typography>
          {formFields.map((formField, index) => (
            <ProfiileSection
              key={index}
              formData={formData}
              field={formField}
              errors={errors}
              handleFormChange={handleFormChange}
              validateField={validateField}
            />
          ))}
          <DeleteAccountDialog 
            password={password}
            setPassword={setPassword}
            handleDeleteAccount={handleDeleteAccount}
            isDeleteDialogOpen={isDeleteDialogOpen}
            closeDeleteAccountDialog={handleCloseDeleteAccountDialog}        
          />
          <PasswordDialog 
            password={password}
            setPassword={setPassword}
            isPasswordDialogOpen={isPasswordDialogOpen}
            handleClosePasswordDialog={handleClosePasswordDialog}
            handleConfirmAction={handleConfirmAction}
          />
          <DeleteAccountButton 
            setisDeleteDialogOpen={setisDeleteDialogOpen}
        />
      </div>
    </>
  );
};

export default ProfilePage;
