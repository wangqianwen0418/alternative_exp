import { TQuestion } from "./types";

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    pageName: "question",
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
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 1,
    pageName: "question",
    userText:
      "Blood Sugar level always contributes positively for predicting diabetes progression.",
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
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 2,
    pageName: "question",
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
    testCondition: "ours",
    groundTruth: true,
  },
];
