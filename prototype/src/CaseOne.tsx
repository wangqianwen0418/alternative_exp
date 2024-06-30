import React from 'react';
import Grid from '@mui/material/Grid';
import {useState} from 'react';

import Explanation from './component/Explanation';
import Interpretation from './component/Interpretation';

import './App.css';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Toolbar } from '@mui/material';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  return (
    <Grid container>
    <Grid item xs={12}>
      <Toolbar sx={{backgroundColor: 'black', fontSize: '28px', color: 'white'}}>
      <IconButton
            color="inherit"
            aria-label="open drawer"
            // onClick={handleDrawerOpen}
            edge="start"
            // sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        Are you interpreting correctly?
      </Toolbar>
    </Grid>
    <Grid item xs={4} className='App-body'>
      <Interpretation isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}/>
    </Grid>
    <Grid item xs={8} className='App-body'>
      <Explanation isSubmitted={isSubmitted}/>
    </Grid>
    
  </Grid>
  );
}

export default App;
