import {
  Paper,
  Typography,
  IconButton,
  Popover,
  Button,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import shap_diabetes from "../assets/shap_diabetes.json";
import {
  diabetesShapValues,
  diabetesFeatureValues,
  diabetesLabels,
  variableMapping,
  diabetes_bmi_featureValues,
  diabetes_bmi_shapValues,
  diabetes_age_featureValues,
} from "../util/diabetesData";
import { useState, useEffect, useRef } from "react";
import Heatmap from "./Heatmap";
import Swarm from "./Swarm";
import Scatter from "./Scatter";
import Bar from "./Bar";
import { useAtom } from "jotai";
import {
  initVisAtom,
  insightAtom,
  isSubmittedAtom,
  tutorialAtom,
  isUserStudyAtom,
  selectedIndicesAtom,
  tutorialStep,
  secondGraphTypeAtom,
  questionIndexAtom,
  questionOrderAtom
} from "../store";
import TwoColorScatter from "./TwoColorScatter";
import { TGraph } from "../util/types";
import { yellow } from "@mui/material/colors";
import Tutorial from "./Tutorial";
import { QuestionList } from "../util/questionList"

function getRandomPoints(arr: number[]) {
  if (arr.length < 25) {
    throw new Error("Array has fewer than 25 points.");
  }

  const randomPoints = [];
  const randomIndices = new Set();

  while (randomIndices.size < 25) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    if (!randomIndices.has(randomIndex)) {
      randomIndices.add(randomIndex);
      randomPoints.push(arr[randomIndex]);
    }
  }

  return randomPoints;
}



export default function Explanation() {
  const [isSubmitted] = useAtom(isSubmittedAtom);
  const [insight] = useAtom(insightAtom);
  let [initVis] = useAtom(initVisAtom);
  const [selectedIndices, setSelectedIndices] = useAtom(selectedIndicesAtom);
  const initialVisRef = useRef<SVGGElement>(null);
  const additionalVisRef = useRef<SVGGElement>(null);
  const [secondVisTranslateY, setSecondVisTranslateY] = useState(0);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStepValue, setTutorialStep] = useAtom(tutorialStep);
  const [, setShowTutorial] = useAtom(tutorialAtom);
  const [isUserStudy] = useAtom(isUserStudyAtom);
  const [secondGraphType, setSecondGraphType] = useAtom(secondGraphTypeAtom);
  const [questionIndexesArray] = useAtom(questionOrderAtom);
  const [questionIndex, setQuestionIndex] = useAtom(questionIndexAtom);

  useEffect(() => {
    if (initialVisRef.current) {
      const bbox = initialVisRef.current.getBBox();
      setSecondVisTranslateY(bbox.height + 25);
    }
  }, [initVis, isSubmitted, selectedIndices, insight]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openTutorialAtStep = (graphType: string) => {
    const stepMapping: Record<string, number> = {
      "Bar": 3,
      "Swarm": 2,
      "Scatter": 4,
      "Heatmap": 5,
    };
  
    // Get the step based on the graphType, defaulting to 0 if not found
    const stepIndex = stepMapping[graphType] ?? 0;
  
    // Set the tutorial to open at the appropriate step
    setTutorialStep(stepIndex);
    setTutorialOpen(true);
    setShowTutorial(true);
    console.log("Tutorial showing now at step " + stepIndex);
  };


  const open = Boolean(anchorEl);

  let initialVisualization;
  if (initVis === undefined) {
    initVis = {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    };
  }

  switch ((initVis as TGraph).graphType) {
    case "Swarm":
      initialVisualization = (
        <Swarm
          xValues={diabetesShapValues}
          colorValues={diabetesFeatureValues}
          id="swarm-initVis"
          labels={diabetesLabels}
          width={600}
          height={400}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          featuresToHighlight={
            isUserStudy ? (initVis as TGraph).featuresToHighlight : undefined
          }
          featuresToShow={
            isUserStudy ? (initVis as TGraph).featuresToShow : undefined
          }
        />
      );
      break;
    case "Scatter":
      initialVisualization = (
        <Scatter
          xValues={
            variableMapping[(initVis as TGraph).xValues] ||
            diabetes_bmi_featureValues
          }
          yValues={
            variableMapping[(initVis as TGraph).yValues] ||
            diabetes_bmi_shapValues
          }
          width={600}
          height={400}
          id="scatter-initVis"
          offsets={[0, 0]}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          xLabel={(initVis as TGraph).xValues ?? ""}
          yLabel={(initVis as TGraph).yValues ?? ""}
          // annotation={{
          //   type: "highlightRange",
          //   xRange: [-0.04, Infinity],
          //   yRange: [Infinity, 30],
          // }}
          // annotation={{ type: "singleLine", xValue: 0.04 }}
          // annotation={{
          //   type: "highlightPoints",
          //   xValues: test_random_feature,
          // }}
        />
      );
      break;
    case "Bar":
      initialVisualization = (
        <Bar
          allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
          featureNames={shap_diabetes["feature_names"].slice(0, 100)}
          width={600}
          height={
            (initVis as TGraph).featuresToShow
              ? 30 * (initVis as TGraph).featuresToShow!.length
              : 300
          }
          // height={400}
          id="bar-initVis"
          offsets={[0, 0]}
          featuresToHighlight={
            isUserStudy ? (initVis as TGraph).featuresToHighlight : undefined
          }
          featuresToShow={
            isUserStudy ? (initVis as TGraph).featuresToShow : undefined
          }
        />
      );
      break;
    case "Heatmap":
      initialVisualization = (
        <Heatmap
          shapValuesArray={diabetesShapValues}
          featureValuesArray={diabetesFeatureValues}
          labels={diabetesLabels}
          width={600}
          height={
            (initVis as TGraph).featuresToShow
              ? 70 * (initVis as TGraph).featuresToShow!.length
              : 350
          }
          title="Diabetes Heatmap"
          featuresToHighlight={
            isUserStudy ? (initVis as TGraph).featuresToHighlight : undefined
          }
          featuresToShow={
            isUserStudy ? (initVis as TGraph).featuresToShow : undefined
          }
        />
      );
      break;
    case "two-scatter":
      initialVisualization = (
        <TwoColorScatter
          yValues={diabetes_bmi_shapValues}
          xValues={diabetes_bmi_featureValues}
          colorValues={diabetes_age_featureValues}
          width={600}
          height={400}
          id="two-color-initial"
          xLabel="BMI Feature Values"
          yLabel="BMI SHAP Values"
          colorLabel="Age Feature Values"
          // annotation={{
          //   type: "twoColorRange",
          //   range: [
          //     [0, 0.02],
          //     [0.05, 0.1],
          //   ],
          // }}
        />
      );
      break;
    default:
      initialVisualization = (
        <text x={50} y={50}>
          Loading ....{" "}
        </text>
      );
      break;
  }

  let additionalVisualizations;
  const q = QuestionList[questionIndexesArray[questionIndex]];
  var graphCase = "random";
  if (q != null){
    graphCase = q.condition? q.condition : "random";
  }
  var graph =
    graphCase === "optimal" ? insight?.optimalGraph : insight?.randomGraph;
  setSecondGraphType(graphCase);
  if (graph?.graphType) {
    switch (graph.graphType) {
      case "Bar":
        additionalVisualizations = isSubmitted && (
          <Bar
            allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
            featureNames={shap_diabetes["feature_names"].slice(0, 100)}
            width={600}
            height={
              graph.featuresToShow
                ? 60 * graph.featuresToShow.length
                : 300
            }
            id="bar-secondVis"
            offsets={[0, 0]}
            annotation={graph.annotation}
            featuresToHighlight={graph.featuresToHighlight}
            featuresToShow={graph.featuresToShow}
          />
        );
        break;
      case "Scatter":
        additionalVisualizations = isSubmitted && (
          <>
            <Scatter
              xValues={
                variableMapping[graph.xValues] ||
                diabetes_bmi_featureValues
              }
              yValues={
                variableMapping[graph.yValues] ||
                diabetes_bmi_shapValues
              }
              width={600}
              height={400}
              id="scatter-secondVis"
              offsets={[0, 0]}
              selectedIndices={selectedIndices}
              setSelectedIndices={setSelectedIndices}
              xLabel={graph.xValues}
              yLabel={graph.yValues}
              annotation={graph.annotation}
            />
          </>
        );
        break;
      case "Swarm":
        additionalVisualizations = isSubmitted && (
          <>
            <Swarm
              colorValues={diabetesFeatureValues}
              xValues={diabetesShapValues}
              width={600}
              height={400}
              id="swarm-secondVis"
              labels={diabetesLabels}
              featuresToHighlight={graph.featuresToHighlight}
              featuresToShow={graph.featuresToShow}
              selectedIndices={selectedIndices}
              setSelectedIndices={setSelectedIndices}
              annotation={graph.annotation}
            />
          </>
        );
        break;

      case "Heatmap":
        additionalVisualizations = isSubmitted && (
          <Heatmap
            shapValuesArray={diabetesShapValues}
            featureValuesArray={diabetesFeatureValues}
            labels={diabetesLabels}
            width={600}
            height={
              graph.featuresToShow
                ? 70 * graph.featuresToShow!.length
                : 350
            }
            title="Diabetes Heatmap"
            featuresToHighlight={graph.featuresToHighlight}
            featuresToShow={graph.featuresToShow}
          />
        );
        break;

      case "two-scatter":
        additionalVisualizations = isSubmitted && (
          <TwoColorScatter
            xValues={
              variableMapping[graph.xValues] ||
              diabetes_bmi_featureValues
            }
            yValues={
              variableMapping[graph.yValues] ||
              diabetes_bmi_featureValues
            }
            colorValues={
              variableMapping[
                insight?.optimalGraph.colorValues ?? "Age Feature Values"
              ]
            }
            width={600}
            height={400}
            id="two-color-additional"
            xLabel={graph.xValues}
            yLabel={graph.yValues}
            colorLabel={graph.colorValues ?? ""}
            annotation={graph.annotation}
          />
        );
        break;
      default:
        console.log("UNKNOWN GRAPH TYPE");
    }
  }

  return (
    <Paper style={{ padding: "15px" }}>
      <Typography variant="h5" gutterBottom>
        Visual Explanation
        <IconButton onClick={handlePopoverOpen} aria-label="help">
          <InfoIcon />
        </IconButton>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
        Note that visualizations without annotations are interactive.
      </Typography>
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          In many machine learning models, features are adjusted so their
          average is 0, and the scale is based on standard deviations. <br />
          A positive value (e.g., BMI 0.1) is above average, and a negative
          value is below. <br />
          For example, a blood pressure feature value of 0.2 indicates a higher
          blood pressure than 0.1, which is higher than -0.05. <br />
          This makes it easier to meaningfully compare features like BMI and
          blood pressure, even though they use different scales.
        </Typography>
      </Popover>

      <Box sx={{ position: "relative", width: "100%" }}>
        <svg className="swarm" width="85%" height="100vh">
          {/* Initial Visualization */}
          <g ref={initialVisRef} transform="translate(0, 0)">
            {initialVisualization}
          </g>

          {/* Additional Visualization BELOW the initialVisualization */}
          {isSubmitted && (
            <g
              ref={additionalVisRef}
              transform={`translate(0, ${secondVisTranslateY})`}
            >
              {additionalVisualizations}
            </g>
          )}
        </svg>

        {/* Button for first visualization */}
        <Box
          sx={{
            position: "absolute",
            top: 150, // Adjust as needed to align with first visualization
            right: "25%",
            zIndex: 1,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => openTutorialAtStep((initVis as TGraph).graphType)}
            sx={{ whiteSpace: "nowrap" }}
          >
            CONFUSED ABOUT THIS
            <br />
            VISUALIZATION?
          </Button>
        </Box>

        {/* Button for second visualization */}
        {isSubmitted && (
          <Box
            sx={{
              position: "absolute",
              top: secondVisTranslateY + 150, // Position relative to second visualization
              right: "25%",
              zIndex: 1,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => openTutorialAtStep(graph?.graphType? graph?.graphType : "")}
              sx={{ whiteSpace: "nowrap" }}
            >
              CONFUSED ABOUT THIS
              <br />
              VISUALIZATION?
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
