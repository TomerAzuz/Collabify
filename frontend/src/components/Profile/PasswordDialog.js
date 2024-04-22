import { Button, TextField, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';

const PasswordDialog = ({ password, setPassword, isPasswordDialogOpen, handleClosePasswordDialog, handleConfirmAction }) => (
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
);

export default PasswordDialog;