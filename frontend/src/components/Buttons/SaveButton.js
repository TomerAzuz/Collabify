import { Button } from '@mui/material';

const SaveButton = ({ validateField }) => (
  <Button
    type="button"
    variant="contained"
    onClick={validateField}
    sx={{ margin: '10px' }}
  >
    Save
  </Button>
);

export default SaveButton;
