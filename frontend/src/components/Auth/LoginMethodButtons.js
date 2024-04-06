import { Button, Grid } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';

import './LoginPage.css';
import { useAuth } from './AuthContext';

const LoginMethodButtons = () => {
  const { handleAuthentication } = useAuth();

  const loginMethodsButtons = [{
    icon: <Google />,
    method: 'google',
    color: '#4285F4', 
  }, {
    icon: <GitHub />,
    method: 'github',
    color: '#000000', 
  }];

  return (
    <Grid item xs={12}>
      {loginMethodsButtons.map((button, index) => (
        <div key={index} className="buttonWrapper">
          <Button
            className={button.method}
            variant='outlined'
            startIcon={button.icon}
            style={{ backgroundColor: button.color, color: '#ffffff' }}
            onClick={e => handleAuthentication(e, button.method)}
          >
            Continue with {button.method}
          </Button>
        </div>
      ))}
    </Grid>
  );
};

export default LoginMethodButtons;