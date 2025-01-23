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
  // diabetes_s5_shapValues,
  // diabetes_s5_featureValues,
} from "../util/diabetesData";
import { useState, useEffect, useRef } from "react";
import Heatmap from "./Heatmap";
import Swarm from "./Swarm";
import Scatter from "./Scatter";
import Bar from "./Bar";
import { useAtom } from "jotai";
import { initVisAtom, insightAtom, isSubmittedAtom } from "../store";

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
  const [insight, setInsight] = useAtom(insightAtom);
  const [initVis] = useAtom(initVisAtom);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [initialVisWidth, setInitialVisWidth] = useState(0);
  const [initialVisHeight, setInitialVisHeight] = useState(0); // State to store initial vis height
  const [additionalVisHeight, setAdditionalVisHeight] = useState(0); // State to store additional vis height
  const initialVisRef = useRef<SVGGElement>(null);
  const additionalVisRef = useRef<SVGGElement>(null)

  const [initialVisYPos, setInitialVisYPos] = useState(0);
  const [additionalVisYPos, setAdditionalVisYPos] = useState(0); 


  let featureName = "bmi",
    featureIndex = shap_diabetes["feature_names"].indexOf(featureName),
    featureValues = shap_diabetes["feature_values"].map(
      (row) => row[featureIndex]
    ),
    featureShapValues = shap_diabetes["shap_values"].map(
      (row) => row[featureIndex]
    );

  const test_random_shap = getRandomPoints(featureShapValues);
  const test_random_feature = getRandomPoints(featureValues);

  let initialVisualization;
  switch (initVis) {
    case "beeswarm":
      initialVisualization = (
        <Swarm
          xValues={diabetesShapValues}
          colorValues={diabetesFeatureValues}
          ids={diabetesLabels}
          // xValues={[diabetes_s5_shapValues]}
          // colorValues={[diabetes_s5_featureValues]}
          // ids={["serum triglycerides level"]}
          width={500}
          height={300}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          // annotation={{
          //   type: "highlightRange",
          //   xValueRange: [-20, 30],
          //   label: "serum triglycerides level",
          // }}
          // annotation={{
          //   type: "singleLine",
          //   xValue: 15,
          //   label: "serum triglycerides level",
          // }}
          // annotation={{
          //   type: "highlightPoints",
          //   shapValues: test_random_shap,
          //   label: "bmi",
          // }}
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
        />
      );
      break;
    case "heatmap":
      initialVisualization = (
        <Heatmap
          shapValuesArray={diabetesShapValues}
          featureValuesArray={diabetesFeatureValues}
          labels={diabetesLabels}
          width={600}
          height={250}
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

  let additionalVisualizations;
  if (insight?.graph.graphType) {
    switch (insight?.graph.graphType) {
      case "Bar":
        console.log("Bar");
        additionalVisualizations = isSubmitted && (
          <>
            <Bar
              allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
              featureNames={shap_diabetes["feature_names"].slice(0, 100)}
              width={600}
              height={200}
              id="bar"
              offsets={[0, 150]}
              annotation={
                insight?.graph.annotation
                  ? insight?.graph.annotation[0]
                  : undefined
              }
              highlightedFeatures={insight?.graph.features}
            />
          </>
        );
        break;
      case "Scatter":
        console.log("Scatter");
        if (insight?.graph.xValues) {
          const featureName = insight?.graph.xValues;
        } else {
          const featureName = "bmi";
        }
        featureIndex = shap_diabetes["feature_names"].indexOf(featureName);
        featureValues = shap_diabetes["feature_values"].map(
          (row) => row[featureIndex]
        );
        featureShapValues = shap_diabetes["shap_values"].map(
          (row) => row[featureIndex]
        );
        additionalVisualizations = isSubmitted && (
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
        console.log("Swarm");
        let swarmFeatureValues = [[0.0]];
        let swarmFeatureShapValues = [[0]];
        if (insight.graph?.features){
          const featureIndices = insight?.graph.features.map(feature => shap_diabetes["feature_names"].indexOf(feature));
          swarmFeatureValues = shap_diabetes["feature_values"].map(row =>
            featureIndices.map(index => row[index])
          );
          const featureShapValues = shap_diabetes["shap_values"].map(row =>
            featureIndices.map(index => row[index])
          );

        }
        additionalVisualizations = isSubmitted && (
          <>
            <Swarm
              colorValues={[featureValues]}
              xValues={[featureShapValues]}
              width={400}
              height={300}
              ids={["bmi-scatter"]}
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
        console.log("Heatmap");
        additionalVisualizations = isSubmitted && (
          <>
            <Heatmap
              shapValuesArray={diabetesShapValues}
              featureValuesArray={diabetesFeatureValues}
              labels={diabetesLabels}
              width={800}
              height={50}
              title="Diabetes Heatmap"
            />
          </>
        );
        break;

      default:
        console.log("UNKNOWN GRAPH TYPE");
        console.log(insight?.graph.graphType);
    }
  }

  useEffect(() => {
    if (initialVisRef.current) {
      
      const bbox = initialVisRef.current.getBBox();
      setInitialVisHeight(bbox.height); // Set the height of the initial visualization
      console.log("initialVisHeight: " + initialVisHeight);
    }

    // if (additionalVisRef.current) {
    //   const bbox = additionalVisRef.current.getBBox();
    //   setAdditionalVisHeight(bbox.height); // Set the height of the additional visualization
    //   console.log("additionalVisHeight: " + additionalVisHeight);
    // }
  }, [initialVisualization, additionalVisualizations]);

  const yOffsetDifference = initialVisYPos - additionalVisYPos;

  return (
    <Paper style={{ padding: "15px" }}>
      <Typography variant="h5" gutterBottom>
        Visual Explanation
      </Typography>
      <svg className="swarm" width="100%" height="100vh">
        {/* Initial Visualization */}
        <g ref={initialVisRef} transform="translate(0, 0)">
          {initialVisualization}
        </g>

        {/* Additional Visualization BELOW the initialVisualization */}
        {isSubmitted && (
          <g
            ref={additionalVisRef}
            //transform={`translate(0, ${initialVisHeight -100})`}
            transform={`translate(0,200)`}
          >
            {additionalVisualizations}
          </g>
        )}
      </svg>
    </Paper>
  );
}
