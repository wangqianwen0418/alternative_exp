import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import {
  Menu as MenuIcon,
  TroubleshootOutlined as TroubleShootIcon,
} from '@mui/icons-material';
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
} from '@mui/material';

import Tutorial from 'components/tutorial/Tutorial';
import Demographics from 'components/ui/Demographics';
import DefinableWord from 'components/ui/DefinableWord';
import Explanation from 'components/interpretation/Explanation';
import Interpretation from 'components/interpretation/Interpretation';
import UserResponse from 'components/interpretation/UserResponse';

import { useLogging } from 'lib/utility/logging';
import { useUUID } from 'lib/utility/useUUID';
import { getCookieBoolean, setCookieBoolean } from 'lib/utility/cookies';
import type { TCase, TQuestion } from 'lib/types';
import { CASES } from 'research/cases';

import {
  freeTextAtom,
  initVisAtom,
  insightAtom,
  isUserStudyAtom,
  pageNameAtom,
  questionIndexAtom,
  questionOrderAtom,
  tutorialAtom,
  tutorialOverrideAtom,
  tutorialStep,
} from './atoms';

import './styles/App.css';

/**
 * src/app/App
 *
 * Top-level application shell.
 *
 * Responsibilities:
 * - Initializes per-session UUID and user-study state.
 * - Renders the primary layout (tutorial + interpretation + charts + response UI).
 * - Emits high-level analytics/logging events for study instrumentation.
 */

function App(appProps: (TCase | TQuestion) & { questionIndex: number }) {
  const [open, setOpen] = useState(false);

  const [, setInsight] = useAtom(insightAtom);
  const [, setFreetext] = useAtom(freeTextAtom);
  const [, setInitVis] = useAtom(initVisAtom);
  const [, setName] = useAtom(pageNameAtom);
  const [, setQuestionIndex] = useAtom(questionIndexAtom);

  const [showTutorial, setShowTutorial] = useAtom(tutorialAtom);
  const [isUserStudy] = useAtom(isUserStudyAtom);
  const [tutorialStepValue] = useAtom(tutorialStep);
  const [tutorialOverride, setTutorialOverride] = useAtom(tutorialOverrideAtom);

  const [questionIndex] = useAtom(questionIndexAtom);
  const [questionIndexesArray] = useAtom(questionOrderAtom);
  const [showDemographics, setShowDemographics] = useState(false);

  const log = useLogging();

  // Ensure UUID is available for logging + user-study ordering.
  useUUID();

  useEffect(() => {
    const demographicsSubmitted = getCookieBoolean('demographicsSubmitted');
    if (!demographicsSubmitted) {
      setShowDemographics(true);
    }
  }, []);

  useEffect(() => {
    const tutorialSeen = getCookieBoolean('showTutorial');
    if (tutorialSeen === undefined) {
      setShowTutorial(true);
      setCookieBoolean('showTutorial', false);
    } else {
      setShowTutorial(false);
    }
  }, [setShowTutorial]);

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
                  fontSize: '20px',
                  textAlign: 'center',
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
          </ListItem>,
        )}
      </List>
    </Box>
  );

  const Header = (
    <Grid item xs={12}>
      <Toolbar
        sx={{ backgroundColor: 'black', fontSize: '28px', color: 'white' }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        Is this the right interpretation?
      </Toolbar>
    </Grid>
  );

  const definitions = {
    Features:
      'The different inputs for the model. In this experiment, the features were age, sex, bmi, blood pressure, serum cholesterol, low-density lipoproteins, high-density lipoproteins, total/HDL cholesterol ratio, serum triglycerides level, and blood sugar level.',
    FeatureValues:
      'The value of a specific feature for that patient/datapoint. Feature values are normalized and standardized to make them easier to compare across different features.',
    SHAP: "SHapley Additive exPlanations. SHAP values represent the CONTRIBUTION a feature had on the model's prediction (positive = increased risk, negative = decreased risk)",
    Instance:
      "A single data point representing one patient's complete set of measurements across the ten features",
    Annotations:
      'Visual markers or notes added to help interpret the data, such as a highlighted range or dashed line indicating a value',
  };

  return (
    <Grid container justifyContent="center">
      {Header}
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>

      <Grid item xs={10}>
        <Paper style={{ padding: '15px' }} elevation={0}>
          <p style={{ margin: '0px -50px' }}>
            <b>ML Model and Dataset:</b> Each{' '}
            <DefinableWord word="Instance" definition={definitions.Instance} />{' '}
            in the dataset corresponds to a patient, characterized by values for
            ten distinct{' '}
            <DefinableWord word="Features" definition={definitions.Features} />{' '}
            . This machine learning model predicts the risk of diabetes
            progression in patients using these ten features.
            <br />
            <b>Explanations: </b>
            Visualizations generated based on{' '}
            <DefinableWord
              word="feature values"
              definition={definitions.FeatureValues}
            />{' '}
            and{' '}
            <DefinableWord word="SHAP values" definition={definitions.SHAP} />.
            They can also contain{' '}
            <DefinableWord
              word="annotations"
              definition={definitions.Annotations}
            />
            .
            <br />
          </p>
        </Paper>
      </Grid>

      <Grid item xs={4} className="App-body">
        <Interpretation />
        {isUserStudy && <UserResponse />}
      </Grid>

      {isUserStudy && showDemographics && (
        <Demographics
          show={showDemographics}
          onSubmit={(data) => {
            setShowDemographics(false);
            setCookieBoolean('demographicsSubmitted', true);
          }}
        />
      )}

      {((isUserStudy && !showDemographics) || tutorialOverride) && (
        <Tutorial
          show={showTutorial || tutorialOverride}
          onClose={() => {
            if (showTutorial) {
              log(
                'Question Started',
                'Index: ' + questionIndexesArray[questionIndex],
              );
            }
            log('Tutorial', 'User closed the tutorial.');
            setShowTutorial(false);
            setTutorialOverride(false);
            setCookieBoolean('showTutorial', false);
          }}
          initialStep={tutorialStepValue}
        />
      )}

      <Grid item xs={7} className="App-body">
        {!('index' in appProps) || !showTutorial ? (
          <Explanation />
        ) : (
          <div
            style={{
              width: '100%',
              height: '400px',
              background: 'transparent',
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
