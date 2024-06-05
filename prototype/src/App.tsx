import React from 'react';
import Grid from '@mui/material/Grid';
import {useState} from 'react';

import Explanation from './component/Explanation';
import Interpretation from './component/Interpretation';

import './App.css';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  return (
    <Grid container>
    <Grid item xs={12}>
      <header className="App-header">Are you interpreting correctly?</header>
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
