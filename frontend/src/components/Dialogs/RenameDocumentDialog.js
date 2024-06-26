import React from 'react';
import {
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const RenameDialog = ({
  isRenameDialogOpen,
  setIsRenameDialogOpen,
  updateDocumentTitle,
  editedTitle,
  setEditedTitle,
}) => {
  const handleUpdateTitle = () => {
    setIsRenameDialogOpen(false);
    updateDocumentTitle();
  };

  return (
    <Dialog
      open={isRenameDialogOpen}
      onClose={() => setIsRenameDialogOpen(false)}
      disableScrollLock={true}
    >
      <DialogTitle>Rename Document</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom>
          Please enter a new name for the item:
        </Typography>
        <TextField
          sx={{ margin: '2px' }}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleUpdateTitle}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
