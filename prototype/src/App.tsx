import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useAtom } from "jotai";
import {
  insightAtom,
  isSubmittedAtom,
  freeTextAtom,
  initVisAtom,
  pageNameAtom,
} from "./store";

import Explanation from "./component/Explanation";
import Interpretation from "./component/Interpretation";
import UserResponse from "./component/UserResponse";
import { TCase, TInsight, TQuestion } from "./util/types";
import { CASES } from "./util/cases";

import "./App.css";

import IconButton from "@mui/material/IconButton";
import {
  Menu as MenuIcon,
  TroubleshootOutlined as TroubleShootIcon,
  Sync as SyncIcon,
} from "@mui/icons-material";
import {
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  Typography,
} from "@mui/material";

function App(appProps: TCase | TQuestion) {
  const [open, setOpen] = useState(false); // sider drawer

  const [isSubmitted] = useAtom(isSubmittedAtom);
  const [, setInsight] = useAtom(insightAtom);
  const [, setFreetext] = useAtom(freeTextAtom);
  const [, setInitVis] = useAtom(initVisAtom);
  const [, setName] = useAtom(pageNameAtom);

  useEffect(() => {
    setFreetext(appProps.userText);
    setInsight(appProps.insight);
    setInitVis(appProps.initVis);
    setName(appProps.pageName);
  }, [appProps.pageName]);

  //   const [insight, setInsight] = useState<TInsight>(appProps.insight);
  //   const [freetext, setFreetext] = useState<string>(appProps.userText);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
      <List>
        <ListItem key="drawerheader">
          <ListItemText
            primary={
              <span
                style={{
                  fontSize: "20px",
                  textAlign: "center",
                  marginLeft: 15,
                }}
              >
                Cases
              </span>
            }
          />
        </ListItem>

        {CASES.map((c) => (
          <ListItem key={c.pageName} disablePadding>
            <ListItemButton href={`#${c.href}`}>
              <ListItemIcon>
                <TroubleShootIcon />
              </ListItemIcon>
              <ListItemText primary={c.pageName} />
            </ListItemButton>
          </ListItem>
        )).concat(
          <ListItem key="questions" disablePadding>
            <ListItemButton href="#/questions">
              <ListItemIcon>
                <TroubleShootIcon />
              </ListItemIcon>
              <ListItemText primary="User Study Question" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const Header = (
    <Grid item xs={12}>
      <Toolbar
        sx={{ backgroundColor: "black", fontSize: "28px", color: "white" }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
          edge="start"
          // sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        Is this the right interpretation?
      </Toolbar>
    </Grid>
  );

  return (
    <Grid container justifyContent="center">
      {Header}
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>

      <Grid item xs={10}>
        <Paper style={{ padding: "15px" }} elevation={0}>
          <p style={{ margin: "0px 5px" }}>
            <b>ML Model and Dataset :</b> Each instance in the dataset
            corresponds to a patient, characterized by values for 10 distinct
            features.
            <br />
            This machine learning model predicts the progression of diabetes in
            patients using these 10 features.{" "}
            {/* {appProps.pageName:.includes("Free") && <SyncIcon />} */}
          </p>
        </Paper>
      </Grid>
      <Grid item xs={4} className="App-body">
        <Interpretation />
        {"index" in appProps && isSubmitted && <UserResponse />}
      </Grid>
      <Grid item xs={7} className="App-body">
        <Explanation />
      </Grid>
    </Grid>
  );
}

export default App;
