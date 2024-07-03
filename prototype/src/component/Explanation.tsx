import { Paper, Typography } from "@mui/material";
import shap_diabetes from "../assets/shap_diabetes.json";

import Swarm from "./Swarm";
import Scatter from "./Scatter";
import Bar from "./Bar";
import PCP from "./PCP";
import { IHypo } from "../App";
import { CASES } from "../const";

type props = (typeof CASES)[0] & {
  isSubmitted: boolean;
  hypo: IHypo | undefined;
};

export default function Explanation(props: props) {
  const { isSubmitted, initVis } = props;
  const featureName = "bmi",
    featureIndex = shap_diabetes["feature_names"].indexOf(featureName),
    featureValues = shap_diabetes["feature_values"]
      .slice(0, 100)
      .map((row) => row[featureIndex]),
    featureShapValues = shap_diabetes["shap_values"]
      .slice(0, 100)
      .map((row) => row[featureIndex]);

  let initialVisualization;
  switch (initVis) {
    case "beeswarm":
      initialVisualization = (
        <Swarm
          xValues={featureShapValues}
          colorValues={featureValues}
          width={500}
          height={100}
          id="bmi"
        />
      );
      break;
    case "scatter":
      initialVisualization = (
        <Scatter
          yValues={featureShapValues}
          xValues={featureValues}
          width={400}
          height={300}
          id="bmi-scatter"
          offsets={[0, 0]}
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
        />
      );
      break;
    default:
      initialVisualization = (
        <Swarm
          xValues={featureShapValues}
          colorValues={featureValues}
          width={500}
          height={100}
          id="bmi"
        />
      );
  }

  // [TODO: additional visualizations should be updated based in hypothesis]
  let additionalVisualizations = (
    <>
      <Scatter
        yValues={featureShapValues}
        xValues={featureValues}
        width={400}
        height={300}
        id="bmi-scatter"
        offsets={[0, 150]}
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

  if (props.name === "Case 2") {
    additionalVisualizations = (
      <PCP
        allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
        featureNames={shap_diabetes["feature_names"]}
        width={600}
        height={300}
        id="pcp"
        offsets={[0, 250]}
      />
    );
  }

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
