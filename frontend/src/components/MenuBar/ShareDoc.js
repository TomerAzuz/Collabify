import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Button, Dialog, DialogContent, DialogTitle, DialogActions, Typography } from '@mui/material';
import { Public } from '@mui/icons-material';

import './MenuBar.css';
import { updateDocument } from '../Services/documentService';
import Loader from '../Common/Loader/Loader.js';
import CustomAlert from '../Common/Alert';

const ShareDoc = ({ doc, user }) => {
  const permissions = ['Viewer', 'Editor'];
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [permission, setPermission] = useState(permissions[0]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (alertMessage) {
      const alertTimeout = setTimeout(() => {
        setAlertMessage(null);
      }, 2000);

      return () => clearTimeout(alertTimeout);
    }
  }, [alertMessage]);

  const handleCopyLink = () => {
    setIsShareDialogOpen(false);
    const link = window.location.href;
    navigator.clipboard.writeText(link)
        .then(() => {
            console.log('URL copied to clipboard');
        })
        .catch(error => {
            console.error('Failed to copy link', error);
        });
  };

  const updatePermission = async (e) => {
    try {
      setLoading(true);
      setPermission(e.target.value)
      await updateDocument(doc.id, {
        ...doc,
        permission: e.target.value,
      });
      setAlertMessage(`Document permission set to: ${e.target.value}`);
    } catch (error) {
      setAlertMessage('Error setting document permission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsShareDialogOpen(true)}
        disabled={!doc || doc.createdBy !== user.uid}
        startIcon={<Public />}
        color='inherit'
      >
        Share
      </Button>
      <Dialog
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      >
        <DialogTitle>Share '{doc && doc.title}'</DialogTitle>
        <DialogContent>
          <Typography>
            Anyone on the internet with the link can {permission === 'Viewer' ? 'view' : 'edit'}
          </Typography>
          <div className='select-permission'>          
            <FormControl fullWidth>
              <Select
                labelId="select-permission"
                id="select-permission"
                value={permission}
                onChange={e => updatePermission(e)}
              >
                {permissions.map((permissionItem, index) => (
                  <MenuItem key={index} value={permissionItem}>
                    {permissionItem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {doc?.collaborators?.length > 0 && 
            <Typography variant="subtitle"> 
              You currently share the document with {doc?.collaborators?.length === 1 ? `${doc.collaborators.length} person` : `${doc.collaborators.length} people`}
            </Typography>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink}>Copy link</Button>
          <Button onClick={() => setIsShareDialogOpen(false)}>Done</Button>
        </DialogActions>
        {loading && <Loader />}
      </Dialog>
      {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </>
  );
};

export default ShareDoc;