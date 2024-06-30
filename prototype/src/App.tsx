import React from 'react';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

import Explanation from './component/Explanation';
import Interpretation from './component/Interpretation';

import './App.css';

import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon, TroubleshootOutlined as TroubleShootIcon } from '@mui/icons-material';
import { Toolbar, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { styled, useTheme, } from '@mui/material/styles';

export interface IHypo {
    entities: string[],
    relations: string[],
    conditions: any,
}


interface AppProps {
    dataset: string,
    initVis: string
}

const CASES = ['Case One', 'Case Two', 'Case Three']

function App(appProps: AppProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [hypo, setHypo] = useState<IHypo>()


    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
            <List>
                <ListItem key='drawerheader' >
                    <ListItemText primary={<span style={{ fontSize: '20px', textAlign: 'center', marginLeft: 15 }}>Cases</span>} />
                </ListItem>

                {CASES.map((name, index) => (
                    <ListItem key={name} disablePadding>
                        <ListItemButton href={`/case${index + 1}`}>
                            <ListItemIcon>
                                <TroubleShootIcon />
                            </ListItemIcon>
                            <ListItemText primary={name} />
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

            <Grid item xs={4} className='App-body'>
                <Interpretation isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} hypo={hypo} setHypo={setHypo} />
            </Grid>
            <Grid item xs={7} className='App-body'>
                <Explanation isSubmitted={isSubmitted} initVis={appProps.initVis} />
            </Grid>


        </Grid>
    );
}

export default App;
