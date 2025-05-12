import { NoEncryption } from "@mui/icons-material";
import { TCase } from "./types";
export const CASES: TCase[] = [
  {
    pageName: "Case 1",
    href: "/case1",
    userText:
      "BMI is the more important than age for predicting diabetes progression.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["age", "bmi"],
    },
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "attribution of",
        },
        {
          featureName: "age",
          transform: "average",
          type: "attribution of",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
      optimalGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["age", "bmi"],
      },
    },
  },
  {
    pageName: "Case 2",
    href: "/case2",
    userText:
      "bmi contributes positively for predicting diabetes progression.",
    initVis: {
      graphType: "BAR",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi"],
    },
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "attribution of",
          transform: "",
        },
        0 as number,
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
      optimalGraph: {
        graphType: "SWARM",
        xValues: "BMI",
        yValues: "BMI",
        annotation: {
          type: "singleLine",
          xValue: 0,
        },
      },
    },
  },
  {
    pageName: "Case 3",
    href: "/case3",
    userText:
      "the larger the age, the more likely to have greater diabetes progression.",
    initVis: {
      graphType: "BAR",
      xValues: "Age Feature Values",
      yValues: "Age SHAP (Contribution) Values",
      

    },
    secondVis: undefined,
    insight: {
      variables: [
        { featureName: "age", type: "value of", transform: "" },
        {
          featureName: "age",
          type: "attribution of",
          transform: "",
        },
      ],
      type: "correlation",
      relation: "positively correlated",
      condition: undefined,
      optimalGraph: {
        graphType: "SCATTER",
        xValues: "Age Feature Values",
        yValues: "Age SHAP (Contribution) Values",
      },
    },
  },
  {
    pageName: "Case 4",
    href: "/case4",
    userText: "bp contributes more to the prediction than age.",
    initVis: {
      graphType: "HEATMAP",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure, age"],
    },
    secondVis: undefined,
    insight: undefined,
  },
  {
    pageName: "Case 5", //TODO: Still a two-color scatter setup
    href: "/case5",
    userText:
      "The correlation between bmi and its feature values is stronger when the feature value for age is in the range |0.05 to 0.1| compared to |0 to 0.02|.",
    initVis: {
      graphType: "BAR",
      xValues: "none",
      yValues: "none",
    },
    secondVis: undefined,
    insight: {
      variables: [
        { featureName: "age", type: "value of", transform: "" },
        {
          featureName: "age",
          type: "attribution of",
          transform: "",
        },
      ],
      type: "correlation",
      relation: "positively correlated",
      condition: undefined,
      optimalGraph: {
        graphType: "TWO-SCATTER",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        colorValues: "Age Feature Values"
      },
    },
  },
  {
    pageName: "Visualization Generation",
    href: "/generator",
    userText: "BMI contributes positively to diabetes risk for more patients than sex does",
    initVis:{
      graphType: "BAR",
      xValues: "none",
      yValues: "none",
      featuresToHighlight: ["serum triglycerides level", "blood sugar level"],
    },
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "attribution of",
        },
        20,
      ],
      type: "read",
      relation: "is",
      condition: undefined,
      optimalGraph: {
        graphType: "SCATTER",
        xValues: "Blood Pressure Feature Values",
        yValues: "Blood pressure SHAP values",
      }
    }
  },
  {
    pageName: "Free Exploration",
    href: "/free",
    userText: "",
    initVis: {
      graphType: "SCATTER",
      xValues: "None",
      yValues: "None",
    },
    secondVis: undefined,
    insight: undefined,
  },
];
