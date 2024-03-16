import { Button, Grid } from '@mui/material';
import { useAuth } from './AuthContext';

const LoginButton = ({ icon, method }) => {
  const { handleAuthentication } = useAuth();

  return (
    <Grid item xs={12}>
      <Button
        variant='contained'
        startIcon={icon}
        onClick={e => handleAuthentication(e, method)}
      >
        Login with {method}
      </Button>
    </Grid>
  )
};

export default LoginButton;