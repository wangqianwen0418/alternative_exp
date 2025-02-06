import { Paper, Typography, IconButton, Popover } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import shap_diabetes from "../assets/shap_diabetes.json";
import {
  diabetesShapValues,
  diabetesFeatureValues,
  diabetesLabels,
  variableMapping,
  variableList,
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
import { TGraph } from "../util/types";

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
  let [initVis] = useAtom(initVisAtom);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialVisRef = useRef<SVGGElement>(null);
  const additionalVisRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({
    initialHeight: 0,
    additionalHeight: 0,
    totalHeight: 0,
    spacing: 50,
    padding: 30,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const VISUALIZATION_HEIGHTS = {
    Scatter: 400,
    Swarm: 250,
    Bar: 350,
    Heatmap: 250,
  };

  const getVisualizationHeight = (visType: string) => {
    return (
      VISUALIZATION_HEIGHTS[visType as keyof typeof VISUALIZATION_HEIGHTS] ||
      300
    );
  };

  // let featureName = "bmi",
  //   featureIndex = shap_diabetes["feature_names"].indexOf(featureName),
  //   featureValues = shap_diabetes["feature_values"].map(
  //     (row) => row[featureIndex]
  //   ),
  //   featureShapValues = shap_diabetes["shap_values"].map(
  //     (row) => row[featureIndex]
  //   );

  let initialVisualization;
  if (initVis == undefined) {
    initVis = {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    };
  }
  const initialVisHeight = getVisualizationHeight(
    (initVis as TGraph).graphType || "Scatter"
  );
  const additionalVisHeight = insight?.graph?.graphType
    ? getVisualizationHeight(insight.graph.graphType)
    : 0;

  const SPACING = 50;

  const totalHeight =
    initialVisHeight +
    (isSubmitted ? SPACING + additionalVisHeight : 0) +
    SPACING;

  switch ((initVis as TGraph).graphType) {
    case "Swarm":
      console.log("Explanation IDs: " + diabetesLabels);
      initialVisualization = (
        <Swarm
          xValues={diabetesShapValues}
          colorValues={diabetesFeatureValues}
          ids={diabetesLabels}
          // xValues={[diabetes_s5_shapValues]}
          // colorValues={[diabetes_s5_featureValues]}
          // ids={["serum triglycerides level"]}
          width={450}
          height={300}
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
          width={450}
          height={350}
          id="bmi"
          offsets={[0, 0]}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          xLabel={(initVis as TGraph).xValues ?? ""}
          yLabel={(initVis as TGraph).yValues ?? ""}
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
    case "Bar":
      initialVisualization = (
        <Bar
          allShapValues={shap_diabetes["shap_values"].slice(0, 100)}
          featureNames={shap_diabetes["feature_names"].slice(0, 100)}
          width={450}
          height={250}
          id="bmi"
          offsets={[0, 0]}
        />
      );
      break;
    case "Heatmap":
      initialVisualization = (
        <Heatmap
          shapValuesArray={diabetesShapValues}
          featureValuesArray={diabetesFeatureValues}
          labels={diabetesLabels}
          width={450}
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
              width={400}
              height={300}
              id="bmi-scatter"
              offsets={[0, 150]}
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
        console.log("Swarm");
        console.log("Annotation: ");
        console.log(insight?.graph.annotation ? insight?.graph.annotation[0] : "no annotation provided")
        additionalVisualizations = isSubmitted && (
          <>
            <Swarm
              colorValues={diabetesFeatureValues}
              xValues={diabetesShapValues}
              width={400}
              height={300}
              ids={diabetesLabels}
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
    const calculateDimensions = () => {
      const initialBBox = initialVisRef.current?.getBBox();
      const additionalBBox = additionalVisRef.current?.getBBox();

      if (initialBBox) {
        const newInitialHeight = Math.ceil(initialBBox.height);
        const newAdditionalHeight = additionalBBox
          ? Math.ceil(additionalBBox.height)
          : 0;

        setDimensions((prev) => ({
          ...prev,
          initialHeight: newInitialHeight,
          additionalHeight: newAdditionalHeight,
        }));
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculateDimensions);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    // Initial calculation
    calculateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, [isSubmitted]); // Remove initialVisualization and additionalVisualizations from dependencies

  return (
    <Paper style={{ padding: "15px" }} ref={containerRef}>
      <Typography variant="h5" gutterBottom>
        Visual Explanation
        <IconButton onClick={handlePopoverOpen} aria-label="help">
          <HelpOutlineIcon />
        </IconButton>
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
          In many machine learning models, features are adjusted so their average is 0, and the scale is based on standard deviations. <br />
          A positive value (e.g., BMI 0.1) is above average, and a negative value is below. <br />
          For example, a blood pressure feature value of 0.2 indicates a higher blood pressure than 0.1, which is higher than -0.05. <br /> 
          This makes it easier to meaningfully compare features like BMI and blood pressure, even though they use different scales.
        </Typography>
      </Popover>
      <svg
        className="swarm"
        width="100%"
        height={totalHeight}
        style={{
          display: "block",
          minHeight: `${totalHeight}px`,
        }}
      >
        <g transform="translate(0, 0)">{initialVisualization}</g>

        {isSubmitted && (
          <g transform={`translate(0, ${initialVisHeight + SPACING})`}>
            {additionalVisualizations}
          </g>
        )}
      </svg>
    </Paper>
  );
}
