import React, { useState } from 'react'; 
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomAlert = ({ message }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={3000} 
      onClose={handleClose} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="info"
        sx={{
          backgroundColor: '#2196F3', 
          color: '#FFFFFF',
        }}
        elevation={6}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
