import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Typography, Box } from '@mui/material';

import './LandingPage.css';
import Typewriter from './TypeWriter';

const LandingPage = () => {
  const text = 
   `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Donec non urna eget tellus mattis pellentesque vitae in augue.
    Nam consectetur sed nisi posuere eleifend.
    Mauris fermentum justo in leo imperdiet, non posuere neque fermentum.
    Nam vel ipsum non metus ullamcorper tincidunt et eget risus.
    Curabitur eleifend turpis elit, ut commodo purus aliquet pretium.
    Maecenas porttitor, nunc non semper hendrerit, elit mi porta magna, eget auctor justo arcu et augue.
    In posuere leo nisi, in pretium neque hendrerit ut.
    Etiam sollicitudin faucibus nisl, sed rutrum metus.
    Praesent tincidunt consectetur consectetur.`;

  return (
    <Box className="landing-page">
      <Box className="left-section">
        <Typewriter text={text} speed={30} />
      </Box>
      <Box className="right-section">
        <Typography variant="h2" style={{ fontFamily: 'Montserrat' }}>
          <span className="collabify-text">Collabify</span>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Real-time collaboration made easy. Edit documents together, seamlessly.
        </Typography>
        <ButtonGroup className="button-group">
          <Button 
            component={Link} 
            to="/auth/signup" 
            size="large" 
            variant="contained"
            sx={{ marginTop: 8, marginBottom: 4, fontSize: '1.6rem' }}
          >
            Sign up
          </Button>
          <Button 
            component={Link} 
            to="/auth/login" 
            size="large" 
            variant="contained"
            sx={{ fontSize: '1.6rem' }}
          >
            Log in
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default LandingPage;
