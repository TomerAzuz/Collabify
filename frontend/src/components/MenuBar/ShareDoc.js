import React, { useState } from 'react';
import { FormControl, Select, MenuItem, Button, Dialog, DialogContent, DialogTitle, DialogActions, Typography } from '@mui/material';
import { Public } from '@mui/icons-material';

import './MenuBar.css';
import { putData } from '../../apiService';

const ShareDoc = ({ doc, user }) => {
  const roles = ['Viewer', 'Editor'];
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [role, setRole] = useState(roles[0]);

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

  const updateRole = async () => {
    setIsShareDialogOpen(false);
    try {
      const response = await putData('documents', doc.id, {
        role: role,
      });
      console.log(`Document role was successfully updated to ${role}:`, response);
    } catch (error) {
      console.error('Error updating document role:', error);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsShareDialogOpen(true)}
        disabled={!doc || doc.createdBy !== user.uid}
        startIcon={<Public />}
      >
        Share
      </Button>
      <Dialog
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      >
        <DialogTitle>Share '{doc && doc.title}'</DialogTitle>
        <DialogContent>
          <Typography>Anyone on the internet with the link can {role === 'Viewer' ? 'view' : 'edit'}</Typography>
          <div className='select-role'>          
            <FormControl fullWidth>
              <Select
                labelId="select-role"
                id="select-role"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                {roles.map((roleItem) => (
                  <MenuItem 
                    key={roleItem} 
                    value={roleItem}
                  >
                    {roleItem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink}>Copy link</Button>
          <Button onClick={updateRole}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShareDoc;