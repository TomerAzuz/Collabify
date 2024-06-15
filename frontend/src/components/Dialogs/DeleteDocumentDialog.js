import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const DeleteDialog = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  deleteDocument,
  isOwner,
}) => {
  const handleDeleteDocument = () => {
    setIsDeleteDialogOpen(false);
    deleteDocument();
  };

  return (
    <Dialog
      open={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(false)}
      disableScrollLock={true}
    >
      <DialogTitle>Delete Document</DialogTitle>
      <DialogContent>
        {isOwner
          ? 'Are you sure you want to permanently delete this document?'
          : 'Are you sure you want to remove this document from the view?'}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDeleteDocument}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
