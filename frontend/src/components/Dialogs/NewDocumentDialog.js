import React from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const NewDocumentDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  createNewDocument,
}) => (
  <Dialog
    open={isDialogOpen}
    onClose={() => setIsDialogOpen(false)}
    disableScrollLock={true}
  >
    <DialogTitle>Create a new document</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography gutterBottom>
        Are you sure you want to create a new document?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
      <Button onClick={createNewDocument}>Create</Button>
    </DialogActions>
  </Dialog>
);

export default NewDocumentDialog;
