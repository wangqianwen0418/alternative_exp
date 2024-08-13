import React from 'react';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

import Explanation from './component/Explanation';
import Interpretation from './component/Interpretation';
import { CASES, TInsight } from './const';

import './App.css';

import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon, TroubleshootOutlined as TroubleShootIcon, Sync as SyncIcon } from '@mui/icons-material';
import { Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Paper, Typography } from '@mui/material';

export interface IHypo {
    freetext: string;
    features: string[],
    featureState: string[],
    attribution: string;
    relation: string,
    prediction: string;
    condition: string,
    constant: string,
    possibleRelations: string[];
    possibleConditions: string[];
    category: number;
}


function App(appProps: typeof CASES[0]) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [hypo, setHypo] = useState<IHypo>({
        freetext: '',
        features: [],
        featureState: [],
        attribution: '',
        relation: '',
        prediction: '',
        condition: '',
        constant: '',
        possibleRelations: [],
        possibleConditions: [],
        category: -1
    });

    const [insight, setInsight] = useState<TInsight>(appProps.insight);

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
                    <ListItem key={c.name} disablePadding >
                        <ListItemButton href={c.href}>
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
                        Each instance in the dataset corresponds to a patient, characterized by values for 10 distinct features.
                        <br />
                        This machine learning model predicts the progression of diabetes in patients using these 10 features.
                    </p>
                </Paper>
            </Grid>
            <Grid item xs={4} className='App-body'>
                <Interpretation isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} hypo={hypo} onHypoChange={handleHypoChange} {...appProps} />
            </Grid>
            <Grid item xs={7} className='App-body'>
                <Explanation isSubmitted={isSubmitted} hypo={hypo}{...appProps} />
            </Grid>


        </Grid>
    );
}

export default App;
