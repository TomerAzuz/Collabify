import React, { useState } from 'react';
import { FormControl, 
         Select, 
         MenuItem, 
         Button, 
         Dialog, 
         DialogContent, 
         DialogTitle, 
         DialogActions, 
         Typography } from '@mui/material';
import { Public } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { updateDocument } from '../Services/documentService';
import Loader from '../Common/Loader/Loader.js';

const ShareDoc = ({ doc, user }) => {
  const permissions = ['Viewer', 'Editor'];
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [permission, setPermission] = useState(permissions[0]);
  const [loading, setLoading] = useState(false);

  const handleCopyLink = () => {
    setIsShareDialogOpen(false);
    const link = window.location.href;
    navigator.clipboard.writeText(link)
        .then(() => {
            toast.success('URL copied to clipboard.');
        })
        .catch(error => {
            toast.error('Failed to copy link.');
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
      toast.success(`Document permission set to ${e.target.value.toLowerCase()}`);
    } catch (error) {
      toast.error('Error setting document permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !doc || doc.createdBy.uid !== user.uid;

  return (
    <>
      <Button 
        variant="text" 
        onClick={() => setIsShareDialogOpen(true)}
        disabled={isDisabled}
        startIcon={<Public />}
        sx={{
          backgroundColor: isDisabled ? '#B0BEC5' : '#2196F3',
          color: 'white',
          broderRadius: '50px',
          transition: 'none',
          '&:hover': {
            backgroundColor: isDisabled ? '#B0BEC5' : '#1565C0',
          },
        }}
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
          <div>          
            <FormControl fullWidth>
              <Select
                labelId="select-permission"
                id="select-permission"
                value={permission}
                onChange={e => updatePermission(e)}
              >
                {permissions.map((per) => (
                  <MenuItem key={per} value={per}>
                    {per}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {doc.collaborators.length > 0 && 
            <Typography variant="subtitle"> 
              You currently share the document with {doc.collaborators.length === 1 ? `${doc.collaborators.length} person` : `${doc.collaborators.length} people`}
            </Typography>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink}>Copy link</Button>
          <Button onClick={() => setIsShareDialogOpen(false)}>Done</Button>
        </DialogActions>
        {loading && <Loader />}
      </Dialog>
    </>
  );
};

export default ShareDoc;