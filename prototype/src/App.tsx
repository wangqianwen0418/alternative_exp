import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useAtom } from "jotai";
import {
  insightAtom,
  freeTextAtom,
  initVisAtom,
  pageNameAtom,
  questionIndexAtom,
  uuidAtom,
  questionOrderAtom,
  tutorialAtom,
} from "./store";

import Explanation from "./component/Explanation";
import Interpretation from "./component/Interpretation";
import UserResponse from "./component/UserResponse";
import DefinableWord from "./component/DefinableWord";
import { TCase, TQuestion } from "./util/types";
import { CASES } from "./util/cases";

import "./App.css";

import IconButton from "@mui/material/IconButton";
import {
  Menu as MenuIcon,
  TroubleshootOutlined as TroubleShootIcon,
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
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { generateQuestionOrder } from "./util/questionBalance";
import Tutorial from "./component/Tutorial";
import Demographics from "./component/Demographics";

function App(appProps: (TCase | TQuestion) & { questionIndex: number }) {
  const [open, setOpen] = useState(false); // sider drawer

  const [, setInsight] = useAtom(insightAtom);
  const [, setFreetext] = useAtom(freeTextAtom);
  const [, setInitVis] = useAtom(initVisAtom);
  const [, setName] = useAtom(pageNameAtom);
  const [, setQuestionIndex] = useAtom(questionIndexAtom);
  const [, setUUID] = useAtom(uuidAtom);
  const [, setQuestionOrder] = useAtom(questionOrderAtom);
  const [showTutorial, setShowTutorial] = useAtom(tutorialAtom);

  const [demographics, setDemographics] = useState<any>(null);
  const [showDemographics, setShowDemographics] = useState(false)

  let uuid = Cookies.get("uuid");

  if (!uuid) {
    uuid = uuidv4();
    Cookies.set("uuid", uuid);
  }

  useEffect(() => {
    const demographicsSubmitted = Cookies.get("demographicsSubmitted");
    if (!demographicsSubmitted) {
      setShowDemographics(true);
    }
  }, [])

  useEffect(() => {
    const tutorialSeen = Cookies.get("showTutorial");
    if (!tutorialSeen) {
      setShowTutorial(true);
      Cookies.set("showTutorial", "false");
    } else {
      setShowTutorial(false);
    }
  }, [setShowTutorial]);


  useEffect(() => {
    setUUID(uuid);
    // setUUID("d42ccc56-b330-427b-9b4f-d99b0a626b5b"); // test uuid
    // setUUID("d46741cf-57b6-43a1-a661-119204bb7a00"); // test uuid
    const questionIndexesArray = generateQuestionOrder(uuid!);
    setQuestionOrder(questionIndexesArray);
  }, [setUUID, setQuestionOrder, uuid]);

  useEffect(() => {
    setFreetext(appProps.userText);
    setInsight(appProps.insight);
    setInitVis(appProps.initVis);
    setName(appProps.pageName);
    setQuestionIndex(appProps.questionIndex);
  }, [
    appProps.userText,
    appProps.insight,
    appProps.initVis,
    appProps.pageName,
    appProps.questionIndex,
    setFreetext,
    setInsight,
    setInitVis,
    setName,
    setQuestionIndex,
  ]);

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

  const definitions = {
    Features:
      "The different inputs for the model. In this experiment, the features were age, sex, bmi, blood pressure, serum cholesterol, low-density lipoproteins, high-density lipoproteins, total/HDL cholesterol ratio, serum triglycerides level, and blood sugar level.",
    FeatureValues:
      "The value of a specific feature for that patient/datapoint. Feature values are normalized and standardized to make them easier to compare across different features.",
    SHAP: "SHapley Additive exPlanations. SHAP values represent the CONTRIBUTION a feature had on the model's prediction (positive = increased risk, negative = decreased risk)",
    Instance:
      "A single data point representing one patient's complete set of measurements across the ten features",
    Annotations:
      "Visual markers or notes added to help interpret the data, such as a highlighted range or dashed line indicating a value",
  };

  return (
    <Grid container justifyContent="center">
      {Header}
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>

      <Grid item xs={10}>
        <Paper style={{ padding: "15px" }} elevation={0}>
          <p style={{ margin: "0px -50px" }}>
            <b>ML Model and Dataset:</b> Each{" "}
            <DefinableWord word="Instance" definition={definitions.Instance} />{" "}
            in the dataset corresponds to a patient, characterized by values for
            ten distinct{" "}
            <DefinableWord word="Features" definition={definitions.Features} />{" "}
            . This machine learning model predicts the risk of diabetes
            progression in patients using these ten features.
            <br />
            <b>Explanations: </b>
            Visualizations generated based on{" "}
            <DefinableWord
              word="feature values"
              definition={definitions.FeatureValues}
            />{" "}
            and{" "}
            <DefinableWord word="SHAP values" definition={definitions.SHAP} />.
            They can also contain{" "}
            <DefinableWord
              word="annotations"
              definition={definitions.Annotations}
            />
            .
            <br />
            {/* {appProps.pageName:.includes("Free") && <SyncIcon />} */}
          </p>
        </Paper>
      </Grid>
      <Grid item xs={4} className="App-body">
        <Interpretation />
        {"index" in appProps && <UserResponse />}
        {/* <Paper style={{ padding: "15px", marginTop: "10px" }}>
          <CounterbalanceButton />
        </Paper> */}
      </Grid>

      {"index" in appProps && showDemographics && (
        <Demographics
          show={showDemographics}
          onSubmit={(data) => {
            setDemographics(data);
            setShowDemographics(false);
            Cookies.set("demographicsSubmitted", "true", { expires: 365 });
          }}
        />
      )}
      
      {"index" in appProps && !showDemographics && (
        <Tutorial
          show={showTutorial}
          onClose={() => {
            setShowTutorial(false);
            Cookies.set("showTutorial", "false", { expires: 365 }); // Ensure it doesn't show again
          }}
        />
      )}
      <Grid item xs={7} className="App-body">
        {!("index" in appProps) || !showTutorial ? (
          <Explanation />
        ) : (
          <div
            style={{
              width: "100%",
              height: "400px",
              background: "transparent",
            }}
          >
            {/* Placeholder div to keep layout stable */}
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
