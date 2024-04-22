import { Button } from '@mui/material';

import '../ProfilePage.css';

const DeleteAccountButton = ({ setisDeleteDialogOpen }) => (
<div className='delete-account-button'>
    <Button 
      variant="contained" 
      sx={{ 
        backgroundColor: '#DC3545', 
        marginTop: '50px',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#c82333', 
        },
      }} 
      onClick={() => setisDeleteDialogOpen(true)}
    >
      Delete Account
    </Button>
  </div>
);

export default DeleteAccountButton;