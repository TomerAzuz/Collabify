import { Button, Grid } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';

import './LoginPage.css';
import { useAuth } from './AuthContext';

const LoginButton = () => {
  const { handleAuthentication } = useAuth();

  const loginMethodsButtons = [{
    icon: <Google />,
    method: 'google',
  }, {
    icon: <GitHub />,
    method: 'github',
  }];

  return (
    <Grid item xs={12}>
      {loginMethodsButtons.map((button, index) => (
        <div key={index} className="buttonWrapper">
          <Button
            className={button.method}
            variant='outlined'
            startIcon={button.icon}
            onClick={e => handleAuthentication(e, button.method)}
          >
            Continue with {button.method}
          </Button>
        </div>
      ))}
    </Grid>
  );
};

export default LoginButton;