import { NoEncryption } from "@mui/icons-material";
import { TCase } from "./types";
export const CASES: TCase[] = [
  {
    pageName: "Case 1",
    href: "/case1",
    userText:
      "BMI is the more important than age for predicting diabetes progression.",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["age", "bmi"],
    },
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution to the prediction of",
        },
        {
          featureName: "age",
          transform: "average",
          type: "contribution to the prediction of",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["age", "bmi"],
      },
    },
  },
  {
    pageName: "Case 2",
    href: "/case2",
    userText:
      "bmi always contributes positively for predicting diabetes progression.",
    initVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    },
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution to the prediction of",
          transform: undefined,
        },
        0 as number,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Swarm",
        xValues: "BMI",
        yValues: "BMI",
        annotation: [{
          type: "singleLine",
          xValue: 0,
        }],
      },
    },
  },
  {
    pageName: "Case 3",
    href: "/case3",
    userText:
      "the larger the age, the more likely to have greater diabetes progression.",
    initVis: {
      graphType: "Scatter",
      xValues: "Age feature values",
      yValues: "Age SHAP values",
    },
    secondVis: undefined,
    insight: {
      variables: [
        { featureName: "age", type: "value of", transform: undefined },
        {
          featureName: "age",
          type: "contribution to the prediction of",
          transform: undefined,
        },
      ],
      type: "correlation",
      relation: "positively correlated",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "Age",
        yValues: "Age",
      },
    },
  },
  {
    pageName: "Case 4",
    href: "/case4",
    userText: "bp contributes more to the prediction than age.",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      features: ["blood pressure, age"],
    },
    secondVis: undefined,
    insight: undefined,
  },
  {
    pageName: "Case 5",
    href: "/case5",
    userText:
      "The correlation between bmi and its feature values is stronger when the feature value for age is in the range |0.05 to 0.1| compared to |0 to 0.02|.",
    initVis: {
      graphType: "two-scatter",
      xValues: "none",
      yValues: "none",
    },
    secondVis: undefined,
    insight: undefined,
  },
  {
    pageName: "Visualization Generation",
    href: "/generator",
    userText: "BMI contributes positively to diabetes risk for more patients than sex does",
    initVis:{
      graphType: "Bar",
      xValues: "none",
      yValues: "none",
      features: ["serum triglycerides level", "blood sugar level"],
    },
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution to the prediction of",
        },
        20,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "Blood pressure feature values",
        yValues: "Blood pressure SHAP values",
      }
    }
  },
  {
    pageName: "Free Exploration",
    href: "/free",
    userText: "",
    initVis: {
      graphType: "Scatter",
      xValues: "None",
      yValues: "None",
    },
    secondVis: undefined,
    insight: undefined,
  },
];
