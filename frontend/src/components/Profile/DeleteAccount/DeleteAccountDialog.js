import { Button, Typography, TextField, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';

const DeleteAccountDialog = ({ password, setPassword, handleDeleteAccount, isDeleteDialogOpen, closeDeleteAccountDialog }) => (
  <Dialog 
    open={isDeleteDialogOpen} 
    onClose={closeDeleteAccountDialog}
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
        <Button onClick={closeDeleteAccountDialog} color="primary">
          Cancel
        </Button>
        <Button color="primary" type='submit'>
          Confirm
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);

export default DeleteAccountDialog;
