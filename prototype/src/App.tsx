import React from 'react';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

import Explanation from './component/Explanation';
import Interpretation from './component/Interpretation';
import { CASES } from './const';

import './App.css';

import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon, TroubleshootOutlined as TroubleShootIcon, Sync as SyncIcon } from '@mui/icons-material';
import { Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Paper, Typography } from '@mui/material';


export interface IHypo {
    freetext: string;
    features: string[],
    relation: string,
    prediction: string;
    condition: string,
    possibleRelations: string[];
    possibleConditions: string[];
}



function App(appProps: typeof CASES[0]) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [hypo, setHypo] = useState<IHypo>({
        freetext: '',
        features: [],
        relation: '',
        prediction: '',
        condition: '',
        possibleRelations: [],
        possibleConditions: []
    });
    const [curCase, setCase] = useState(CASES[0]);

    const handleHypoChange = (newHypo: IHypo) => {
        setHypo(newHypo);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
            <List>
                <ListItem key='drawerheader' >
                    <ListItemText primary={<span style={{ fontSize: '20px', textAlign: 'center', marginLeft: 15 }}>Cases</span>} />
                </ListItem>

                {CASES.map(c => (
                    <ListItem key={c.name} disablePadding onClick={() => setCase(c)}>
                        <ListItemButton href={`#${c.href}`}>
                            <ListItemIcon>
                                <TroubleShootIcon />
                            </ListItemIcon>
                            <ListItemText primary={c.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const Header = <Grid item xs={12}>
        <Toolbar sx={{ backgroundColor: 'black', fontSize: '28px', color: 'white' }}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setOpen(true)}
                edge="start"
            // sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            Are you interpreting correctly?
        </Toolbar>
    </Grid>

    return (
        <Grid container justifyContent="center">
            {Header}
            <Drawer open={open} onClose={() => setOpen(false)}>
                {DrawerList}
            </Drawer>

            <Grid item xs={10}>
                <Paper style={{ padding: "15px" }}>
                    <Typography variant="h5" gutterBottom> ML Model and Dataset {appProps.name.includes('Free') && <SyncIcon />}</Typography>
                    <p style={{ margin: '0px 5px' }}>
                        The ML model use 10 features to predict the progression of diabetes.
                    </p>
                </Paper>
            </Grid>
            <Grid item xs={4} className='App-body'>
                <Interpretation isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} hypo={hypo} onHypoChange={handleHypoChange} selectedCase={curCase.name} {...appProps} />
            </Grid>
            <Grid item xs={7} className='App-body'>
                <Explanation isSubmitted={isSubmitted} hypo={hypo}{...appProps} />
            </Grid>


        </Grid>
    );
}

export default App;
