import { Button } from '@mui/material';
import { Public } from '@mui/icons-material';

const ShareButton = ({ isDisabled, setIsShareDialogOpen }) => {
  return (
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
  );
};

export default ShareButton;