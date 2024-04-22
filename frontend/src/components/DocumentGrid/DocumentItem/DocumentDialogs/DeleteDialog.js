import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DeleteDialog = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, deleteDocument, isOwner }) => (
  <Dialog 
    open={isDeleteDialogOpen} 
    onClose={() => setIsDeleteDialogOpen(false)}
    disableScrollLock={true}
  >
    <DialogTitle>Delete Document</DialogTitle>
    <DialogContent>
      {isOwner ? "Are you sure you want to permenanetly delete this document?" : 
                 "Are you sure you want to withdraw as a collaborator from this document?"
      }
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
      <Button onClick={deleteDocument}>Delete</Button>
    </DialogActions>
  </Dialog>
  );

export default DeleteDialog;