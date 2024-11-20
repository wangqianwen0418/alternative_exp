import { Paper, Typography } from "@mui/material";
import shap_diabetes from "../assets/shap_diabetes.json";
import {
  diabetesShapValues,
  diabetesFeatureValues,
  diabetesLabels,
  // test_random_feature,
  // test_random_shap,
  diabetes_bmi_featureValues,
  diabetes_bmi_shapValues,
} from "../util/diabetesHeatmapData";
import { useState } from "react";
import Heatmap from "./Heatmap";
import Swarm from "./Swarm";
import Scatter from "./Scatter";
import Bar from "./Bar";
import { useAtom } from "jotai";
import {
  initVisAtom,
  // insightAtom,
  isSubmittedAtom,
} from "../store";

export default function Explanation() {
  const [isSubmitted] = useAtom(isSubmittedAtom);
  // const [insight, setInsight] = useAtom(insightAtom);
  const [initVis] = useAtom(initVisAtom);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  let initialVisualization;
  switch (initVis) {
    case "beeswarm":
      initialVisualization = (
        <Swarm
          xValues={diabetes_bmi_shapValues}
          colorValues={diabetes_bmi_featureValues}
          width={500}
          height={300}
          id="bmi"
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          // annotation={{ type: "highlightRange", shapRange: [-20, 30] }}
          // annotation={{ type: "highlightRange", shapRange: [30, Infinity] }}
          // annotation={{ type: "singleLine", xValue: 15 }}
          // annotation={{ type: "highlightPoints", shapValues: test_random_shap }}
        />
      );
      break;
    case "scatter":
      initialVisualization = (
        <Scatter
          yValues={diabetes_bmi_shapValues}
          xValues={diabetes_bmi_featureValues}
          width={400}
          height={300}
          id="bmi-scatter"
          offsets={[0, 0]}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          // annotation={{
          //   type: "highlightRange",
          //   xValueRange: [-0.04, Infinity],
          //   yValueRange: [Infinity, 30],
          // }}
          // annotation={{ type: "singleLine", xValue: 0.04 }}
          // annotation={{
          //   type: "highlightPoints",
          //   xValues: test_random_feature,
          // }}
        />
      );
      break;
    case "bar":
      initialVisualization = (
        <Bar
          allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
          featureNames={shap_diabetes["feature_names"].slice(0, 100)}
          width={600}
          height={200}
          id="bmi-scatter"
          offsets={[0, 0]}
          // annotation={{ type: "verticalLine", xValue: 15 }}
          // annotation={{
          //   type: "highlightBars",
          //   labels: ["bmi", "age"],
          // }}
        />
      );
      break;
    case "heatmap":
      initialVisualization = (
        <Heatmap
          shapValuesArray={diabetesShapValues}
          featureValuesArray={diabetesFeatureValues}
          labels={diabetesLabels}
          width={800}
          height={50}
          title="Diabetes Heatmap"
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

  // [TODO: additional visualizations should be updated based in hypothesis]
  const additionalVisualizations = isSubmitted && (
    <>
      <Scatter
        yValues={diabetes_bmi_shapValues}
        xValues={diabetes_bmi_featureValues}
        width={400}
        height={300}
        id="bmi-scatter"
        offsets={[0, 150]}
        selectedIndices={selectedIndices}
        setSelectedIndices={setSelectedIndices}
      />

      <g>
        <rect
          x={550}
          y={0}
          width={300}
          height={200}
          fill="white"
          stroke="black"
        />
        <text x={700} y={50} textAnchor="middle">
          Other Explanations
        </text>
      </g>
      <g>
        <rect
          x={450}
          y={250}
          width={400}
          height={200}
          fill="white"
          stroke="black"
        />
        <text x={600} y={300} textAnchor="middle">
          Other Explanations
        </text>
      </g>
    </>
  );

  return (
    <Paper style={{ padding: "15px" }}>
      <Typography variant="h5" gutterBottom>
        Visual Explanation
      </Typography>
      <svg className="swarm" width={900} height="70vh">
        {initialVisualization}

        {isSubmitted && additionalVisualizations}
      </svg>
    </Paper>
  );
}
