import { Paper, Typography, IconButton, Popover } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import shap_diabetes from "../assets/shap_diabetes.json";
import {
  diabetesShapValues,
  diabetesFeatureValues,
  diabetesLabels,
  variableMapping,
  diabetes_bmi_featureValues,
  diabetes_bmi_shapValues,
  diabetes_age_shapValues,
  s2DiabetesFeatureValues,
  s2DiabetesShapValues,
  s2DiabetesLabels,
} from "../util/diabetesData";
import { useState, useEffect, useRef } from "react";
import Heatmap from "./Heatmap";
import Swarm from "./Swarm";
import Scatter from "./Scatter";
import Bar from "./Bar";
import { useAtom } from "jotai";
import { initVisAtom, insightAtom, isSubmittedAtom } from "../store";
import TwoColorScatter from "./TwoColorScatter";
import { TGraph } from "../util/types";

export default function Explanation() {
  const [isSubmitted] = useAtom(isSubmittedAtom);
  const [insight] = useAtom(insightAtom);
  let [initVis] = useAtom(initVisAtom);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const initialVisRef = useRef<SVGGElement>(null);
  const additionalVisRef = useRef<SVGGElement>(null);
  const [secondVisTranslateY, setSecondVisTranslateY] = useState(0);

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

  const open = Boolean(anchorEl);

  let initialVisualization;
  if (initVis == undefined) {
    initVis = {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    };
  }

  switch ((initVis as TGraph).graphType) {
    case "Swarm":
      // console.log("Explanation IDs: " + diabetesLabels);
      initialVisualization = (
        <Swarm
          xValues={diabetesShapValues}
          colorValues={diabetesFeatureValues}
          id="swarm-initVis"
          labels={diabetesLabels}
          // xValues={[diabetes_s5_shapValues]}
          // colorValues={[diabetes_s5_featureValues]}
          // ids={["serum triglycerides level"]}
          // boldFeatureNames={["sex", "age"]}
          width={600}
          height={400}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          featuresToShow={(initVis as TGraph).features}
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
          height={400}
          id="bar-initVis"
          offsets={[0, 0]}
          highlightedFeatures={(initVis as TGraph).features}
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
          height={350}
          title="Diabetes Heatmap"
          // featuresToShow={["sex", "age"]}
        />
      );
      break;
    case "two-scatter":
      initialVisualization = (
        <TwoColorScatter
          yValues={diabetes_bmi_shapValues}
          xValues={diabetes_bmi_featureValues}
          colorValues={diabetes_age_shapValues}
          width={600}
          height={400}
          id="two-color-initial"
          xLabel="BMI feature values"
          yLabel="BMI SHAP values"
          colorLabel="age"
          // annotation={[
          //   [-5, 0],
          //   [15, 25],
          // ]}
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
  if (insight?.graph.graphType) {
    switch (insight?.graph.graphType) {
      case "Bar":
        additionalVisualizations = isSubmitted && (
          <Bar
            allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
            featureNames={shap_diabetes["feature_names"].slice(0, 100)}
            width={600}
            height={400}
            id="bar-secondVis"
            offsets={[0, 0]}
            annotation={
              insight?.graph.annotation
                ? insight?.graph.annotation[0]
                : undefined
            }
            highlightedFeatures={insight?.graph.features}
          />
        );
        break;
      case "Scatter":
        additionalVisualizations = isSubmitted && (
          <>
            <Scatter
              xValues={
                variableMapping[insight?.graph.xValues] ||
                diabetes_bmi_featureValues
              }
              yValues={
                variableMapping[insight?.graph.yValues] ||
                diabetes_bmi_shapValues
              }
              width={600}
              height={400}
              id="scatter-secondVis"
              offsets={[0, 0]}
              selectedIndices={selectedIndices}
              setSelectedIndices={setSelectedIndices}
              xLabel={insight?.graph?.xValues ?? ""}
              yLabel={insight?.graph?.yValues ?? ""}
              annotation={
                insight?.graph.annotation
                  ? insight?.graph.annotation[0]
                  : undefined
              }
            />
          </>
        );
        break;
      case "Swarm":
        // console.log("Swarm");
        let swarmFeatureValues = [[0.0]];
        let swarmFeatureShapValues = [[0]];
        if (insight.graph?.features) {
          const featureIndices = insight?.graph.features.map((feature) =>
            shap_diabetes["feature_names"].indexOf(feature)
          );
          swarmFeatureValues = shap_diabetes["feature_values"].map((row) =>
            featureIndices.map((index) => row[index])
          );
          swarmFeatureShapValues = shap_diabetes["shap_values"].map((row) =>
            featureIndices.map((index) => row[index])
          );
        }
        additionalVisualizations = isSubmitted && (
          <>
            <Swarm
              colorValues={
                insight.graph?.features?.includes("low-density lipoproteins")
                  ? s2DiabetesFeatureValues
                  : diabetesFeatureValues
              }
              xValues={
                insight.graph?.features?.includes("low-density lipoproteins")
                  ? s2DiabetesShapValues
                  : diabetesShapValues
              }
              width={600}
              height={400}
              id="swarm-secondVis"
              labels={
                insight.graph?.features?.includes("low-density lipoproteins")
                  ? s2DiabetesLabels
                  : diabetesLabels
              }
              featuresToShow={insight.graph?.features}
              selectedIndices={selectedIndices}
              setSelectedIndices={setSelectedIndices}
              annotation={
                insight?.graph.annotation
                  ? insight?.graph.annotation[0]
                  : undefined
              }
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
            height={350}
            title="Diabetes Heatmap"
            boldFeatureNames={insight?.graph.features}
          />
        );
        break;

      case "two-scatter":
        additionalVisualizations = isSubmitted && (
          <TwoColorScatter
            xValues={
              variableMapping[insight?.graph.xValues] ||
              diabetes_bmi_featureValues
            }
            yValues={
              variableMapping[insight?.graph.yValues] ||
              diabetes_bmi_featureValues
            }
            colorValues={
              variableMapping[
                insight?.graph.colorValues ?? "Age feature values"
              ]
            }
            width={600}
            height={400}
            id="two-color-additional"
            xLabel={insight?.graph?.xValues ?? ""}
            yLabel={insight?.graph?.yValues ?? ""}
            colorLabel={insight?.graph?.colorValues ?? ""}
            annotation={
              insight?.graph.annotation
                ? insight?.graph.annotation[0]
                : undefined
            }
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
          <HelpOutlineIcon />
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
          {/* This is the text you can customize */}
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
      <svg className="swarm" width="100%" height="100vh">
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
    </Paper>
  );
}
