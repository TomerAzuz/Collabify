import React, { useState } from 'react';
import { updateProfile, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth';
import { Button, 
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

import './ProfilePage.css';
import Logo from '../Common/Logo/Logo.js';
import { useAuth } from '../Auth/AuthContext';

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

  console.log(user)
  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };

  const handleCloseDeleteAccountDialog = () => {
    setIsDeleteAccountDialogOpen(false);
  };

  const handleFieldUpdate = async () => {
    if (user.providerData[0].providerId === 'password') {
      setIsPasswordDialogOpen(true);
    } else {
      handleConfirmUpdate();
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmUpdate = async () => {
    try {
      const userCredential = await handleReauthentication(password);
      switch (field) {
        case 'photoURL':
          await updateProfile(userCredential.user, { photoURL: formData.photoURL });
          console.log('Photo URL updated successfully.');
          break;
        case 'name':
          await updateProfile(userCredential.user, { displayName: formData.name });
          console.log('Name updated successfully.');
          break;
        case 'email':
          await verifyBeforeUpdateEmail(userCredential.user, formData.email);
          console.log('Email updated successfully.');
          break;
        case 'newPassword':
          await updatePassword(userCredential.user, formData.newPassword);
          console.log('Password updated successfully.');
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('Failed to update:', error.message);
    } finally {
      setIsPasswordDialogOpen(false);
      setFormData(prevForm => ({ ...prevForm, newPassword: '' }));
      setField(null);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userCredential = await handleReauthentication(password);
      await userCredential.user.delete();
      console.log('Account deleted successfully');
    } catch (error) {
      console.log('Failed to delete account: ', error);
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
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel-content" id="panel-header">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Typography variant="subtitle1" sx={{ margin: 'auto' }}>Profile picture</Typography>
                <Typography variant="body2" sx={{ margin: 'auto' }}>Add a profile picture to personalize your account</Typography>
                <Avatar src={user.photoURL} alt="Profile Picture" sx={{ width: 35, height: 35, marginRight: 'auto' }} />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <TextField name="photoURL" label="Photo URL" value={formData.photoURL} onChange={e => handleFormChange(e)} />
                <Button type="button" variant="contained" onClick={() => { setField('photoURL'); handleFieldUpdate(); }} sx={{ marginLeft: 'auto' }}>Save</Button>
              </div>
            </AccordionDetails>
          </Accordion> 

          {/* Name */}
          <Accordion sx={{ marginBottom: '20px' }}>
            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel-content" id="panel-header">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '120px' }}>
                <Typography variant="subtitle1" sx={{ marginLeft: '0' }}>Name</Typography>
                <Typography variant="body2" sx={{ margin: 'auto' }}>{user.displayName}</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <TextField name="name" label="Name" value={formData.name} onChange={e => handleFormChange(e)} />
                <Button type="button" variant="contained" onClick={() => { setField('name'); handleFieldUpdate(); }} sx={{ marginLeft: 'auto' }}>Save</Button>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Email */}
          {user.providerData[0].providerId === 'password' && (
          <>
            <Accordion sx={{ marginBottom: '20px' }}>
              <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel-content" id="panel-header">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '120px' }}>
                  <Typography variant="subtitle1" sx={{ marginLeft: '0' }}>Email</Typography>
                  <Typography variant="body2" sx={{ margin: 'auto' }}>{user.email}</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                  <TextField name="email" label="Email" value={formData.email} onChange={e => handleFormChange(e)} />
                  <Button type="button" variant="contained" onClick={() => { setField('email'); handleFieldUpdate(); }} sx={{ marginLeft: 'auto' }}>Save</Button>
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Password */}
            <Accordion sx={{ marginBottom: '20px' }}>
              <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel-content" id="panel-header">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '120px' }}>
                  <Typography variant="subtitle1" sx={{ marginLeft: '0' }}>Password</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                  <TextField name="newPassword" label="New Password" type="password" value={formData.newPassword} onChange={e => handleFormChange(e)} />
                  <Button type="button" variant="contained" onClick={() => { setField('newPassword'); handleFieldUpdate(); }} sx={{ marginLeft: 'auto' }}>Save</Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </>
          )}
          {/* Delete Account */}
          <Button variant="contained" sx={{ backgroundColor: 'red', marginTop: 20, display: 'flex' }} onClick={() => setIsDeleteAccountDialogOpen(true)}>
            Delete Account
          </Button>

          {/* Delete Account Dialog */}
          <Dialog open={isDeleteAccountDialogOpen} onClose={handleCloseDeleteAccountDialog}>
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
              <Button color="primary" onClick={handleDeleteAccount}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Password Dialog */}
          <Dialog open={isPasswordDialogOpen} onClose={handleClosePasswordDialog}>
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
              <Button color="primary" onClick={handleConfirmUpdate}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
