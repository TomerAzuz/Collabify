import React, { useState } from 'react';
import { updateProfile, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth';
import { Box, 
         Button, 
         Accordion, 
         AccordionSummary, 
         AccordionDetails, 
         Typography, 
         Avatar, 
         TextField, 
         Dialog, 
         DialogContent, 
         DialogTitle,
         DialogActions 
        } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import './ProfilePage.css';
import Logo from '../Common/Logo/Logo.js';
import { useAuth } from '../Auth/AuthContext';
import { validateProfileForm } from '../Common/Utils/validation';

const ProfilePage = () => {
  const { user, handleReauthentication } = useAuth();
  const [formData, setFormData] = useState({
    name: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    newPassword: ''
  });
  
  const [password, setPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [field, setField] = useState(null);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      name: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      newPassword: ''
    });
  };

  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };

  const handleCloseDeleteAccountDialog = () => {
    setIsDeleteAccountDialogOpen(false);
  };

  const handleFieldUpdate = async (e, fieldName) => {
    e.preventDefault();
    setField(fieldName);
    const validationErrors = validateProfileForm(formData);
    const isEmailProvider = user.providerData[0].providerId === 'password';
    if (Object.keys(errors).length === 0) {
      if (isEmailProvider) {
        setIsPasswordDialogOpen(true);
      } else {
        handleConfirmUpdate(e);
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
        case 'name':
          await updateProfile(userCredential.user, { displayName: formData.name });
          toast.success('Name updated successfully.');
          break;
        case 'email':
          await verifyBeforeUpdateEmail(userCredential.user, formData.email);
          toast.success('Email updated successfully.');
          break;
        case 'newPassword':
          await updatePassword(userCredential.user, formData.newPassword);
          toast.success('Password updated successfully.');
          break;
        default:
          break;
      }
      resetForm();
      setField(null);
      setErrors({});
    } catch (error) {
      console.log('Failed to update:', error.message);
    } finally {
      setIsPasswordDialogOpen(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await handleReauthentication(password);
      await userCredential.user.delete();
      toast.success('Account deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete account.');
    }
  };

  return (
    <>
      <Logo variant={'h3'} sx={{ left: 0, top: 0 }}/>
      <div className="profile-container">
        <Typography variant="h2" gutterBottom>
          Profile Information
        </Typography>
        <div className="profile-info">
          
          {/* Profile picture */}
          <Accordion sx={{ marginBottom: '20px' }}>
            <AccordionSummary 
              expandIcon={<ExpandMore />} 
              aria-controls="panel-content" 
              id="panel-header"
            >
              <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ margin: 'auto' }}
                >
                  Profile picture
                </Typography>
                <Typography variant="body2" sx={{ margin: 'auto' }}>
                  Add a profile picture to personalize your account
                </Typography>
                <Avatar 
                  src={user.photoURL} 
                  alt="Profile Picture" 
                  sx={{ width: 35, height: 35, marginRight: 'auto' }} 
                />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div 
                style={{ display: 'flex', 
                         flexDirection: 'row', 
                         width: '100%', 
                         alignItems: 'center' 
                       }}>
                <Box>
                  <TextField 
                    name="photoURL" 
                    label="Photo URL" 
                    value={formData.photoURL} 
                    onChange={e => handleFormChange(e)} 
                  />
                  {errors.photoURL && <Typography color="error">{errors.photoURL}</Typography>}
                </Box>
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={(e) => handleFieldUpdate(e, 'photoURL')} 
                  sx={{ marginLeft: 'auto' }}
                >
                  Save
                </Button>
              </div>
            </AccordionDetails>
          </Accordion> 
      
          {/* Name */}
          <Accordion sx={{ marginBottom: '20px' }}>
            <AccordionSummary 
              expandIcon={<ExpandMore />} 
              aria-controls="panel-content" 
              id="panel-header"
            >
              <div style={{ display: 'flex', flexDirection: 'row', gap: '120px' }}>
                <Typography variant="subtitle1" sx={{ marginLeft: '0' }}>Name</Typography>
                <Typography variant="body2" sx={{ margin: 'auto' }}>{user.displayName}</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div 
                style={{ display: 'flex', 
                         flexDirection: 'row', 
                         width: '100%', 
                         alignItems: 'center' 
                        }}>
                <Box>
                  <TextField 
                    name="name" 
                    label="Name" 
                    value={formData.name} 
                    onChange={e => handleFormChange(e)} 
                  />
                  {errors.displayName && 
                  <Typography color="error">{errors.displayName}</Typography>}
                </Box>
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={(e) => handleFieldUpdate(e, 'name')} 
                  sx={{ marginLeft: 'auto' }}
                >
                  Save
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Email */}
          <Accordion sx={{ marginBottom: '20px' }}>
            <AccordionSummary 
              expandIcon={<ExpandMore />} 
              aria-controls="panel-content" 
              id="panel-header"
            >
              <div style={{ display: 'flex', flexDirection: 'row', gap: '120px' }}>
                <Typography variant="subtitle1" sx={{ marginLeft: '0' }}>Email</Typography>
                <Typography variant="body2" sx={{ margin: 'auto' }}>{user.email}</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div 
                style={{ display: 'flex', 
                         flexDirection: 'row', 
                         width: '100%', 
                         alignItems: 'center' }}
                >
                <Box>
                  <TextField 
                    name="email" 
                    label="Email" 
                    value={formData.email} 
                    onChange={e => handleFormChange(e)} 
                  />
                  {errors.email && <Typography color="error">{errors.email}</Typography>}
                </Box>
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={(e) => { handleFieldUpdate(e, 'email') }} 
                  sx={{ marginLeft: 'auto' }}
                >
                  Save
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Password */}
          <Accordion sx={{ marginBottom: '20px' }}>
            <AccordionSummary 
              expandIcon={<ExpandMore />} 
              aria-controls="panel-content" 
              id="panel-header"
            >
              <div 
                style={{ display: 'flex', 
                         flexDirection: 'row', 
                         gap: '120px' }}>
                <Typography variant="subtitle1" sx={{ marginLeft: '0' }}>Password</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div 
                style={{ display: 'flex', 
                         flexDirection: 'row', 
                         width: '100%', 
                         alignItems: 'center' }}>
                <Box>
                  <TextField 
                    name="newPassword" 
                    label="New Password" 
                    type="password" 
                    value={formData.newPassword} 
                    onChange={e => handleFormChange(e)} 
                  />
                  {errors.password && <Typography color="error">{errors.password}</Typography>}
                </Box>
                <Button 
                  type="button" 
                  variant="contained" 
                  onClick={(e) => handleFieldUpdate(e, 'newPassword')} 
                  sx={{ marginLeft: 'auto' }}
                >
                  Save
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Delete Account */}
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#dc3545', 
              marginTop: 20,
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#c82333', 
              },
            }} 
            onClick={() => setIsDeleteAccountDialogOpen(true)}>
            Delete Account
          </Button>

          {/* Delete Account Dialog */}
          <Dialog 
            open={isDeleteAccountDialogOpen} 
            onClose={handleCloseDeleteAccountDialog}
          >
            <form onSubmit={(e) => handleDeleteAccount(e)}>
              <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
              <DialogContent>
                <Typography>
                  This action cannot be undone. Enter your password to confirm.
                </Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteAccountDialog} color="primary">
                  Cancel
                </Button>
                <Button color="primary" type='submit'>
                  Confirm
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Password Dialog */}
          <Dialog 
            open={isPasswordDialogOpen} 
            onClose={handleClosePasswordDialog}
          >
            <form onSubmit={(e) => handleConfirmAction(e)}>
              <DialogTitle>Verify password</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordDialog} color="primary">
                  Cancel
                </Button>
                <Button color="primary" type='submit'>
                  Confirm
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
