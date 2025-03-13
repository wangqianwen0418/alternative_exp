import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  MobileStepper,
  Radio,
  RadioGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import DefinableWord from "./DefinableWord";
import {
  SwarmTutorialGraph,
  ScatterTutorialGraph,
  BarTutorialGraph,
  HeatmapTutorialGraph,
  TwoColorTutorialGraph,
  AnnotationTutorialGraph,
} from "../util/tutorialGraphs";
import {
  tutorialStep
} from "../store"

const definedWords = {
  XAI: "Explainable AI (XAI) is an approach to provide insight into the decision-making process of AI models, where explanations or rationales accompany recommendations made by AI.",
};

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
          If you already know what you're doing, feel free to skip this
          tutorial.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 1: Background Info",
    content: (
      <>
        <Typography variant="body1">
          First, we'd like to provide some background about the user study.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <b>What is the purpose of this study?:</b> We aim to evaluate a novel
          interactive visualization technique designed to enhance users'
          understanding of AI explanations.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <b>What is the significance of this research topic?:</b> Although{" "}
          <DefinableWord word="XAI" definition={definedWords.XAI} /> methods are
          designed to clarify model behavior, they do not ensure accurate user
          interpretations. Research has shown that users often struggle to
          correctly understand AI explanations, sometimes misusing them to
          justify incorrect predictions, and may even place blind trust in these
          explanations.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <b>How does the model work?:</b> By analyzing patient data such as
          BMI, blood pressure, and other health indicators, our model makes
          predictions about the progression of diabetes in a patient.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <b>What are SHAP and feature values?:</b> SHAP values represent the
          impact a feature had on the model's prediction (positive = increased
          risk, negative = decreased risk). SHAP values are the primary values
          we use in this user study. Feature values represent the specific
          numerical value of a particular feature at a data point. Feature
          values will be explicitly referenced if used.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 2a: Visualizations",
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Now, we'd like to go over the five different visualizations you will
          see in the user study. The first visualization you will see is the
          Swarm plot. Each data point represents a SHAP value corresponding to
          the feature type for a particular instance. The data points are
          colored on feature values.
        </Typography>
        <SwarmTutorialGraph />
        <Typography variant="body1">
          To interact with this visualization, you can click and drag a
          selection box to highlight data points from a particular feature. This allows you to see additional info and the
          same instances across features (Give it a try!). Additionally, visualizations without
          annotations are interactive, while visualizations with annotations are
          not.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 2b: Visualizations",
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The second visualization you will see is the Bar plot. Each bar
          represents the average SHAP value for each feature.
        </Typography>
        <BarTutorialGraph />
        <Typography variant="body1" sx={{ mt: 1 }}>
          To interact with this visualization, you can click and drag a
          selection box to highlight bars to focus on specific features.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 2c: Visualizations",
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The third visualization you will see is the Scatter plot. Each data
          point represents the feature value and SHAP value for one instance,
          plotted in the (x, y) plane.
        </Typography>
        <ScatterTutorialGraph />
        <Typography variant="body1" sx={{ mt: 1 }}>
          To interact with this visualization, you can click and drag a
          selection box around a group of points to see additional info.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 2d: Visualization",
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The fourth visualization you will see is the Heatmap plot. Each
          rectangle represents a SHAP value corresponding to the feature type
          for a particular instance. The rectangles are colored on SHAP values.
          Note that in the Heatmap plot, each column (all features in a
          particular x position) corresponds to one instance.{" "}
        </Typography>
        <HeatmapTutorialGraph />
        <Typography variant="body1" sx={{ mt: -5 }}>
          This visualization is not interactive.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 1e: Visualizations",
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The fifth and final visualization you will see is the Two-Color
          Scatter Plot. Similar to the previous Scatter plot, each data point
          represents the feature value and SHAP value for one instance, plotted
          in the (x, y) plane. However, points are colored based on another
          feature in the Two-Color Scatter. In this case, the additional feature
          is the SHAP values for age.
        </Typography> 
        <TwoColorTutorialGraph />
        <Typography variant="body1" sx={{ mt: 2 }}>
          To interactive with this visualization, you can drag the two black
          sliders on the legend up and down to filter out points.
        </Typography>
      </>
    ),
  },
  {
    title: "Step 3: The Insight and First Visualization",
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 1 }}>
          For each question, you'll be given an <b>insight</b> (a statement
          about a data visualization) and an <b>initial visualization</b>. Below
          is an example of a visualization you could receive.
        </Typography>
        <SwarmTutorialGraph />
        <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
          Note isualizations without annotations are interactive, while
          visualizations with annotations are not. Try left clicking and
          dragging to highlight a portion of the Swarm plot.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Now, an example insight you may be given is:{" "}
          <i>"age contributes at least 5 (SHAP Value) to the prediction."</i>
        </Typography>
      </>
    ),
  },
  {
    title: "Step 4: Selecting an Answer and Rating Confidence",
    content: (
      <>
        <Typography variant="body1">
          Next, you'll need to decide if the provided insight is:
        </Typography>
        <ul style={{ marginTop: 2 }}>
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
        <Typography variant="body1" sx={{ mt: -1 }}>
          In this tutorial, we highlight one possible option. (In the real
          study, you have to decide for yourself!)
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RadioGroup
            row
            aria-labelledby="disabled-radio-buttons-group-label"
            name="disabled-radio-buttons-group"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
                opacity: 0.5,
              }}
            >
              <Radio checked={false} disabled />
              <span>
                <b>Correct</b>
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
                opacity: 0.5,
              }}
            >
              <Radio checked={false} disabled />
              <span>
                <b>Incorrect</b>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Radio checked={true} />
              <span>
                <b>Irrelevant</b>
              </span>
            </div>
          </RadioGroup>
        </div>
        <Typography variant="body1">
          Additionally, you'll rate your confidence in your response from 1-6.
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ mt: 2, minWidth: 100 }}>
            <InputLabel id="tutorial-initial-confidence-label">
              Confidence
            </InputLabel>
            <Select
              labelId="tutorial-initial-confidence-label"
              id="tutorial-initial-confidence"
              value={"2"}
              autoWidth
              label="Confidence"
              readOnly
            >
              <MenuItem value="2">2</MenuItem>
            </Select>
          </FormControl>
        </div>
      </>
    ),
  },
  {
    title: "Step 5: Second Visualization",
    content: (
      <>
        <Typography variant="body1">
          Next, we show a <b>second graph</b> about the same statement.
        </Typography>
        <AnnotationTutorialGraph />
        <Typography variant="body2" color="text.secondary" sx={{ mt: -2 }}>
          Since this chart has an annotation, it is not interactive.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          As a reminder, the original insight was{" "}
          <i>"age contributes at least 5 to the prediction."</i>
        </Typography>
      </>
    ),
  },
  {
    title: "Last Step: Selecting an Answer and Rating Confidence",
    content: (
      <>
        <Typography variant="body1">
          Finally, you will once again decide if the provided insight is
          correct, incorrect, or irrelevant and then rate your confidence in
          your answer. In the case of the new visualization, an example response
          may be:
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <RadioGroup
            row
            aria-labelledby="disabled-radio-buttons-group-label"
            name="disabled-radio-buttons-group"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
                opacity: 0.5,
              }}
            >
              <Radio checked={false} disabled />
              <span>
                <b>Correct</b>
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
              }}
            >
              <Radio checked={true} />
              <span>
                <b>Incorrect</b>
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "16px",
                opacity: 0.5,
              }}
            >
              <Radio checked={false} disabled />
              <span>
                <b>Irrelevant</b>
              </span>
            </div>
          </RadioGroup>{" "}
          <FormControl sx={{ m: 2, minWidth: 100 }}>
            <InputLabel id="tutorial-second-confidence-label">
              Confidence
            </InputLabel>
            <Select
              labelId="tutorial-second-confidence-label"
              id="tutorial-second-confidence"
              value={"5"}
              autoWidth
              label="Confidence"
              readOnly
            >
              <MenuItem value="5">5</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Typography variant="body1">
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
  initialStep?: number;
}

export default function Tutorial({ show, onClose, initialStep=0 }: TutorialProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(initialStep);
  const maxSteps = tutorialSteps.length;
  console.log("ACTIVE STEP: " + initialStep);

  React.useEffect(() => {
    setActiveStep(initialStep);
  }, [initialStep]);
  

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
          width: "65vw",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          maxHeight: "85vh",
          overflow: "auto",
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
