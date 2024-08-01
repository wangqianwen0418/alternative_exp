import { Paper, Typography } from "@mui/material";
import shap_diabetes from "../assets/shap_diabetes.json";
import shap_income from "../assets/shap_income_subset.json";
import { useState } from "react";

import Swarm from "./Swarm";
import Heatmap from "./Heatmap";
import Scatter from "./Scatter";
import Bar from "./Bar";
import PCP from "./PCP";
import { IHypo } from "../App";
import { CASES } from "../const";

type props = (typeof CASES)[0] & {
  isSubmitted: boolean;
  hypo: IHypo;
};

export default function Explanation({ isSubmitted, hypo, initVis }: props) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  console.log("SELECTED INDICES: ");
  console.log(selectedIndices);
  const featureName = "bmi",
    featureIndex = shap_diabetes["feature_names"].indexOf(featureName),
    featureValues = shap_diabetes["feature_values"].map(
      (row) => row[featureIndex]
    ),
    featureShapValues = shap_diabetes["shap_values"].map(
      (row) => row[featureIndex]
    );

  console.log("EXPLANATION HYPO: ");
  console.log(hypo.freetext);

  const income_capitalGain = "Capital Gain",
    income_capitalGain_featureIndex =
      shap_income["feature_names"].indexOf(income_capitalGain),
    income_capitalGain_featureValues = shap_income["feature_values"].map(
      (row) => row[income_capitalGain_featureIndex]
    ),
    income_capitalGain_shapValues = shap_income["shap_values"].map(
      (row) => row[income_capitalGain_featureIndex]
    );

  const income_educationNum = "Education-Num",
    income_educationNum_featureIndex =
      shap_income["feature_names"].indexOf(income_educationNum),
    income_educationNum_featureValues = shap_income["feature_values"].map(
      (row) => row[income_educationNum_featureIndex]
    ),
    income_educationNum_shapValues = shap_income["shap_values"].map(
      (row) => row[income_educationNum_featureIndex]
    );

  const income_age = "Age",
    income_age_featureIndex = shap_income["feature_names"].indexOf(income_age),
    income_age_featureValues = shap_income["feature_values"].map(
      (row) => row[income_age_featureIndex]
    ),
    income_age_shapValues = shap_income["shap_values"].map(
      (row) => row[income_age_featureIndex]
    );

  const income_occupation = "Occupation",
    income_occupation_featureIndex =
      shap_income["feature_names"].indexOf(income_occupation),
    income_occupation_featureValues = shap_income["feature_values"].map(
      (row) => row[income_occupation_featureIndex]
    ),
    income_occupation_shapValues = shap_income["shap_values"].map(
      (row) => row[income_occupation_featureIndex]
    );

  const income_relationship = "Relationship",
    income_relationship_featureIndex =
      shap_income["feature_names"].indexOf(income_relationship),
    income_relationship_featureValues = shap_income["feature_values"].map(
      (row) => row[income_relationship_featureIndex]
    ),
    income_relationship_shapValues = shap_income["shap_values"].map(
      (row) => row[income_relationship_featureIndex]
    );

  const income_capitalLoss = "Capital Loss",
    income_capitalLoss_featureIndex =
      shap_income["feature_names"].indexOf(income_capitalLoss),
    income_capitalLoss_featureValues = shap_income["feature_values"].map(
      (row) => row[income_capitalLoss_featureIndex]
    ),
    income_capitalLoss_shapValues = shap_income["shap_values"].map(
      (row) => row[income_capitalLoss_featureIndex]
    );

  const income_hoursPerWeek = "Hours per week",
    income_hoursPerWeek_featureIndex =
      shap_income["feature_names"].indexOf(income_hoursPerWeek),
    income_hoursPerWeek_featureValues = shap_income["feature_values"].map(
      (row) => row[income_hoursPerWeek_featureIndex]
    ),
    income_hoursPerWeek_shapValues = shap_income["shap_values"].map(
      (row) => row[income_hoursPerWeek_featureIndex]
    );

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
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
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
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
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
    case "heatmap_income":
      initialVisualization = (
        <Heatmap
          shapValuesArray={[
            income_capitalGain_shapValues,
            income_educationNum_shapValues,
            income_age_shapValues,
            income_occupation_shapValues,
            income_relationship_shapValues,
            income_capitalLoss_shapValues,
            income_hoursPerWeek_shapValues,
          ]}
          featureValuesArray={[
            income_capitalGain_featureValues,
            income_educationNum_featureValues,
            income_age_featureValues,
            income_occupation_featureValues,
            income_relationship_featureValues,
            income_capitalLoss_featureValues,
            income_hoursPerWeek_featureValues,
          ]}
          labels={[
            income_capitalGain,
            income_educationNum,
            income_age,
            income_occupation,
            income_relationship,
            income_capitalLoss,
            income_hoursPerWeek,
          ]}
          height={50}
          width={800}
          title="Capital Gain Heatmap"
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
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
        />
      );
  }

  // [TODO: additional visualizations should be updated based in hypothesis]
  const additionalVisualizations = isSubmitted && (
    <>
      <Scatter
        yValues={featureShapValues}
        xValues={featureValues}
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
      <svg className="swarm" width={1300} height="70vh">
        {initialVisualization}

        {isSubmitted && additionalVisualizations}
      </svg>
    </Paper>
  );
}
