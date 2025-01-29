import * as React from "react";
import { Box, Button, Typography, Modal, MobileStepper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Swarm from "./Swarm";
import {
  diabetesFeatureValues,
  diabetesLabels,
  diabetesShapValues,
} from "../util/diabetesData";
import shap_diabetes from "../assets/shap_diabetes.json";
import Bar from "./Bar";

function FirstTutorialGraph() {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        className="swarm"
        width={600}
        height={400}
        style={{ marginBottom: "-45px" }}
      >
        <g>
          <Swarm
            xValues={diabetesShapValues}
            colorValues={diabetesFeatureValues}
            ids={diabetesLabels}
            width={600}
            height={400}
            selectedIndices={selectedIndices}
            setSelectedIndices={setSelectedIndices}
          />
        </g>
      </svg>
    </Box>
  );
}

function SecondTutorialGraph() {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        className="swarm"
        width={600}
        height={375}
        style={{ marginTop: "15px" }}
      >
        <g>
          <Bar
            allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
            featureNames={shap_diabetes["feature_names"].slice(0, 100)}
            width={600}
            height={350}
            id="bmi"
            offsets={[0, 0]}
            annotation={{ type: "singleLine", xValue: 30 }}
          />
        </g>
      </svg>
    </Box>
  );
}

const tutorialSteps = [
  {
    title: "Welcome to the User Study",
    content: (
      <>
        <Typography variant="body1">
          Thank you for participating in our user study! We'll quickly walk you
          through how things work and then you'll begin the real questions.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          ADD INFO ABOUT USER STUDY
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          If you already know what you're doing, feel free to skip this
          tutorial.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 1: Reading the Insight",
    content: (
      <>
        <Typography variant="body1">
          In each question, you'll be given an insight (a statement about a data
          visualization).
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Here's an example:
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontStyle: "italic", fontWeight: "bold", mt: 1 }}
        >
          CREATE INSIGHT FOR TUTORIAL
        </Typography>
      </>
    ),
  },
  {
    title: "Step 2: Visual Check (First Graph)",
    content: (
      <>
        <Typography variant="body1">
          We will show you a visualization below. You need to decide if the
          insight is:
        </Typography>
        <ul>
          <li>
            <b>Correct</b> (the visualization supports the insight),
          </li>
          <li>
            <b>Incorrect</b> (the visualization contradicts the insight),
          </li>
          <li>
            <b>Irrelevant</b> (the visualization does not provide enough
            information to determine).
          </li>
        </ul>
        <FirstTutorialGraph />
        <Typography variant="body2" color="text.secondary">
          Note that charts without annotations are interactive! Try highlighting
          a portion of the beeswarm plot.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 3: Selecting an Answer and Rating Confidence",
    content: (
      <>
        <Typography variant="body1">
          ADD CORRECT/INCORRECT ANSWER Additionally, you would rate your
          confidence in the answer by selecting a value between 1-6.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          In this tutorial, we highlight one possible option. (In the real
          study, you have to decide for yourself!)
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          ADD RADIO BUTTONS
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
          Everything else is grayed out, so you can see how an answer is chosen.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 4: Second Visualization",
    content: (
      <>
        <Typography variant="body1">
          Next, we show a <b>second graph</b> about the same statement.
        </Typography>
        <SecondTutorialGraph />
        <Typography variant="body2" color="text.secondary">
          Since this chart has an annotation, it is not interactive.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You again choose whether the same statement (<i>"ADD STATEMENT"</i> )
          is supported, contradicted, or irrelevant based on the <b>new</b>{" "}
          visualization.
        </Typography>
      </>
    ),
  },
  {
    title: "Last Step: Selecting an Answer and Rating Confidence",
    content: (
      <>
        <Typography variant="body1">REPEAT STEP 3</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          That's it! Click "Finish" to begin the real user study now, or "Back"
          to revisit any step.
        </Typography>
      </>
    ),
  },
];

interface TutorialProps {
  show: boolean;
  onClose: () => void;
}

export default function Tutorial({ show, onClose }: TutorialProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      onClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="tutorial-modal"
      aria-describedby="tutorial-modal-description"
      closeAfterTransition
    >
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "35vw",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {tutorialSteps[activeStep].title}
        </Typography>

        {tutorialSteps[activeStep].content}

        <MobileStepper
          variant="progress"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ mt: 2 }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps}
            >
              {activeStep === maxSteps - 1 ? "Finish" : "Next"}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />

        <Box sx={{ textAlign: "right" }}>
          {activeStep < maxSteps - 1 && (
            <Button variant="text" color="secondary" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
