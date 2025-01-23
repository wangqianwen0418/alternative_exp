import { TCase } from "./types";
export const CASES: TCase[] = [
  {
    pageName: "Case 1",
    href: "/case1",
    userText:
      "BMI is the more important than age for predicting diabetes progression.",
    initVis: "beeswarm",
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution of",
        },
        {
          featureName: "age",
          transform: "average",
          type: "contribution of",
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
    initVis: "bar",
    secondVis: undefined,
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution of",
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
    initVis: "scatter",
    secondVis: undefined,
    insight: {
      variables: [
        { featureName: "age", type: "value of", transform: undefined },
        {
          featureName: "age",
          type: "contribution of",
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
    initVis: "heatmap",
    secondVis: undefined,
    insight: undefined,
  },
  {
    pageName: "Case 4",
    href: "/case4",
    userText: "bp contributes more to the prediction than age.",
    initVis: "heatmap",
    secondVis: undefined,
    insight: undefined,
  },
  {
    pageName: "Free Exploration",
    href: "/free",
    userText: "",
    initVis: "scatter",
    secondVis: undefined,
    insight: undefined,
  },
];
