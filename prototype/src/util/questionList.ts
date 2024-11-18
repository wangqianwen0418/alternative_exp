import { TQuestion, TVariable, TInsight, TGraph, TAnnotation} from "./types";

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
        xValues: "none",
        yValues: "none",
      },
    },
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 1,
    pageName: "question",
    userText:
      "BMI always contributes positively for predicting diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution of",
          transform: undefined,
        },
        0,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Swarm",
        xValues: "BMI",
        yValues: "BMI",
        annotation: {
          type: "verticalLine",
          value: 0,
        },
      }
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
        { featureName: "age", type: "value of", transform: undefined },
        {
          featureName: "age",
          type: "contribution of",
          transform: undefined,
        },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "Age",
        yValues: "Age",
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
];
