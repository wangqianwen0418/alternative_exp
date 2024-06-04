import React from 'react';
import Grid from '@mui/material/Grid';

import Explanation from './component/Explanation';
import Interpretation from './component/Interpretation';

import './App.css';

function App() {
  return (
    <Grid container>
    <Grid item xs={12}>
      <header className="App-header">Are you interpreting correctly?</header>
    </Grid>
    <Grid item xs={8} className='App-body'>
      <Explanation />
    </Grid>
    <Grid item xs={4} className='App-body'>
      <Interpretation />
    </Grid>
  </Grid>
  );
}

export default App;
