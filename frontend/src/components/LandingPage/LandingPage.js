import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Typography } from '@mui/material';

import './LandingPage.css';
import Typewriter from './TypeWriter';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="left-section">
        <Typewriter text="Real-time collaboration made easy. Edit documents together, seamlessly." speed={50} />
      </div>
      <div className="right-section">
        <Typography variant="h2" gutterBottom style={{ fontFamily: 'Roboto' }}>
          Collabify
        </Typography>
        <Typography variant="subtitle1" paragraph style={{ fontFamily: 'Roboto', marginBottom: '20px' }}>
          Real-time collaboration made easy. Edit documents together, seamlessly.
        </Typography>
        <ButtonGroup sx={{ flexDirection: 'column' }}>
          <Button 
            component={Link} 
            to="/auth/signup" 
            size="large" 
            variant="contained"
            sx={{ width: '100%', height: '60px', marginBottom: 4, fontSize: '1.2rem' }}
          >
            Sign up
          </Button>
          <Button 
            component={Link} 
            to="/auth/login" 
            size="large" 
            variant="contained"
            sx={{ width: '100%', height: '60px', fontSize: '1.2rem' }}
          >
            Log in
          </Button>
      </ButtonGroup>
      </div>
    </div>
  );
};

export default LandingPage;


