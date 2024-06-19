import { Paper, Typography } from "@mui/material";
import shap_diabetes from "../assets/shap_diabetes.json";

import Swarm from "./Swarm";
import Scatter from "./Scatter";

interface props {
  isSubmitted: boolean;
}

export default function Explanation({ isSubmitted }: props) {
  const featureName = "bmi",
    featureIndex = shap_diabetes["feature_names"].indexOf(featureName),
    featureValues = shap_diabetes["feature_values"].map(
      (row) => row[featureIndex]
    ),
    shapValues = shap_diabetes["shap_values"].map((row) => row[featureIndex]);
  return (
    <Paper style={{ padding: "15px" }}>
      <Typography variant="h5" gutterBottom>
        Visual Explanation
      </Typography>
      <svg className="swarm" width={900} height={500}>
        <Swarm
          xValues={shapValues}
          colorValues={featureValues}
          width={500}
          height={100}
          id="bmi"
        />
        {isSubmitted && (
          <>
            <Scatter
              yValues={shapValues}
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
        )}
      </svg>
    </Paper>
  );
}
