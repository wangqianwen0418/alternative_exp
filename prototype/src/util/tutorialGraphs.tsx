import React from "react";
import Bar from "../component/Bar";
import Swarm from "../component/Swarm";
import { Box } from "@mui/material";
import shap_diabetes from "../assets/shap_diabetes.json";
import {
  diabetesShapValues,
  diabetesFeatureValues,
  diabetesLabels,
  diabetes_bmi_shapValues,
  diabetes_bmi_featureValues,
  diabetes_age_shapValues,
} from "./diabetesData";
import Scatter from "../component/Scatter";
import Heatmap from "../component/Heatmap";
import TwoColorScatter from "../component/TwoColorScatter";

export function SwarmTutorialGraph() {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg className="swarm" width={600} height={400}>
        <g>
          <Swarm
            xValues={diabetesShapValues}
            colorValues={diabetesFeatureValues}
            id="swarm-tutorial"
            labels={diabetesLabels}
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

export function ScatterTutorialGraph() {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg className="swarm" width={600} height={400}>
        <g>
          <Scatter
            yValues={diabetes_bmi_shapValues}
            xValues={diabetes_bmi_featureValues}
            width={600}
            height={400}
            id="scatter-tutorial"
            xLabel="Feature Values (BMI)"
            yLabel="SHAP Values (BMI)"
            offsets={[0, 0]}
            selectedIndices={selectedIndices}
            setSelectedIndices={setSelectedIndices}
          />
        </g>
      </svg>
    </Box>
  );
}

export function BarTutorialGraph() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg className="swarm" width={600} height={400}>
        <g>
          <Bar
            allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
            featureNames={shap_diabetes["feature_names"].slice(0, 100)}
            width={600}
            height={400}
            id="bar-tutorial"
            offsets={[0, 0]}
          />
        </g>
      </svg>
    </Box>
  );
}

export function HeatmapTutorialGraph() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg className="swarm" width={600} height={400}>
        <g>
          <Heatmap
            shapValuesArray={diabetesShapValues}
            featureValuesArray={diabetesFeatureValues}
            labels={diabetesLabels}
            width={600}
            height={350}
            title="Diabetes Heatmap"
          />
        </g>
      </svg>
    </Box>
  );
}

export function TwoColorTutorialGraph() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg className="swarm" width={600} height={400}>
        <g>
          <TwoColorScatter
            yValues={diabetes_bmi_shapValues}
            xValues={diabetes_bmi_featureValues}
            colorValues={diabetes_age_shapValues}
            width={600}
            height={400}
            id="two-color-tutorial"
            xLabel="Feature Values (BMI)"
            yLabel="SHAP Values (BMI)"
            colorLabel="SHAP Values (Age)"
          />
        </g>
      </svg>
    </Box>
  );
}

export function AnnotationTutorialGraph() {
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
        width={550}
        height={375}
        style={{ marginTop: "15px" }}
      >
        <g>
          <Bar
            allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
            featureNames={shap_diabetes["feature_names"].slice(0, 100)}
            width={550}
            height={350}
            id="bar-tutorial-with-annotations"
            offsets={[0, 0]}
            annotation={{ type: "singleLine", xValue: 5 }}
          />
        </g>
      </svg>
    </Box>
  );
}
