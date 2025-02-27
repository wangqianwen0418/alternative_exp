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
  isUserStudyAtom,
} from "../store";
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
  const [isUserStudy] = useAtom(isUserStudyAtom);

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
  if (insight?.graph.graphType) {
    switch (insight?.graph.graphType) {
      case "Bar":
        additionalVisualizations = isSubmitted && (
          <Bar
            allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
            featureNames={shap_diabetes["feature_names"].slice(0, 100)}
            width={600}
            height={
              insight.graph.featuresToShow
                ? 60 * insight.graph.featuresToShow.length
                : 300
            }
            id="bar-secondVis"
            offsets={[0, 0]}
            annotation={insight.graph.annotation}
            featuresToHighlight={insight.graph.featuresToHighlight}
            featuresToShow={insight.graph.featuresToShow}
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
              xLabel={insight.graph.xValues}
              yLabel={insight.graph.yValues}
              annotation={insight.graph.annotation}
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
              featuresToHighlight={insight.graph.featuresToHighlight}
              featuresToShow={insight.graph.featuresToShow}
              selectedIndices={selectedIndices}
              setSelectedIndices={setSelectedIndices}
              annotation={insight.graph.annotation}
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
              insight.graph.featuresToShow
                ? 70 * insight.graph.featuresToShow!.length
                : 350
            }
            title="Diabetes Heatmap"
            featuresToHighlight={insight.graph.featuresToHighlight}
            featuresToShow={insight.graph.featuresToShow}
          />
        );
        break;

      case "two-scatter":
        additionalVisualizations = isSubmitted && (
          <TwoColorScatter
            xValues={
              variableMapping[insight.graph.xValues] ||
              diabetes_bmi_featureValues
            }
            yValues={
              variableMapping[insight.graph.yValues] ||
              diabetes_bmi_featureValues
            }
            colorValues={
              variableMapping[
                insight?.graph.colorValues ?? "Age Feature Values"
              ]
            }
            width={600}
            height={400}
            id="two-color-additional"
            xLabel={insight.graph.xValues}
            yLabel={insight.graph.yValues}
            colorLabel={insight?.graph?.colorValues ?? ""}
            annotation={insight.graph.annotation}
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
