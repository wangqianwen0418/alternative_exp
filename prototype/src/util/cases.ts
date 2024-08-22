import { TCase } from "./types";
export const CASES: TCase[] = [
  {
    pageName: "Case 1",
    href: "/case1",
    userText:
      "BMI is the more important than age for predicting diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution",
        },
        {
          featureName: "age",
          transform: "average",
          type: "contribution",
        },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
  },
  {
    pageName: "Case 2",
    href: "/case2",
    userText:
      "bmi always contributes positively for predicting diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution",
          transform: undefined,
        },
        0,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
  },
  {
    pageName: "Case 3",
    href: "/case3",
    userText:
      "the larger the age, the more likely to have greater diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "age", type: "value", transform: undefined },
        {
          featureName: "age",
          type: "contribution",
          transform: undefined,
        },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
  },
  {
    pageName: "Case 4",
    href: "/case4",
    userText:
      "the larger the capital gain, the more likely to have greater income.",
    initVis: "heatmap",
    insight: undefined,
  },
  {
    pageName: "Free Exploration",
    href: "/free",
    userText: "",
    initVis: "random",
    insight: undefined,
  },
];
