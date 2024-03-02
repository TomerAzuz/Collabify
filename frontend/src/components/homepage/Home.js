import { useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import '../../App.css';
import './Home.css';


const Home = () => {
  const [showDoc, setShowDoc] = useState(false);

  const showEditor = () => {
    setShowDoc(!showDoc);
  } 
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper>
            
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            
          </Paper>
        </Grid>
      </Grid>
    </>
  )
};

export default Home;