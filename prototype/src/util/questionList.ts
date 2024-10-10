import { TQuestion } from "./types";

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    pageName: "question",
    userText:
      "The average contribution of the bmi to the prediction is larger than 20.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution of",
        },
        20,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 1,
    pageName: "question",
    userText:
      "The average contribution of bp to the prediction is larger than 5.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "bp",
          type: "contribution of",
          transform: "average",
        },
        5,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 2,
    pageName: "question",
    userText: "The s5 values contribute at least 30 to the prediction.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "s5",
          type: "contribution of",
          transform: "average",
        },
        30,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 3,
    pageName: "question",
    userText: "The s1 values contribute at least 2.5 to the prediction.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "s1",
          type: "contribution of",
          transform: "average",
        },
        2.5,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 4,
    pageName: "question",
    userText: "bp contributes more to the prediction than age.",
    initVis: "heatmap",
    insight: {
      variables: [
        {
          featureName: "bp",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "age",
          type: "contribution of",
          transform: "average",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 5,
    pageName: "question",
    userText: "bmi has more instances above 5 than sex.",
    initVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "number of instances",
          transform: "average",
        },
        {
          featureName: "sex",
          type: "number of instances",
          transform: "average",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 6,
    pageName: "question",
    userText: "age has more instances above 3 than s2.",
    initVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "age",
          type: "number of instances",
          transform: "average",
        },
        {
          featureName: "s2",
          type: "number of instances",
          transform: "average",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 7,
    pageName: "question",
    userText:
      "bp has larger deviations in its contribution to the prediction compared to age.",
    initVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "bp",
          type: "contribution of",
          transform: "deviation",
        },
        {
          featureName: "age",
          type: "contribution of",
          transform: "deviation",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 8,
    pageName: "question",
    userText:
      "There is correlation between the contribution of bp to predictions and the bp values.",
    initVis: "scatter",
    insight: {
      variables: [
        {
          featureName: "bp",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "bp",
          type: "contribution of",
          transform: "average",
        },
      ],
      type: "correlation",
      relation: "positively", // #TODO
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 9,
    pageName: "question",
    userText:
      "There is correlation between the contribution of age to predictions and the age values when the feature value is between |0.05 and 0.10|.",
    initVis: "scatter",
    insight: {
      variables: [
        {
          featureName: "age",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "age",
          type: "contribution of",
          transform: "average",
        },
      ],
      type: "correlation",
      relation: "positively", // #TODO
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 10,
    pageName: "question",
    userText:
      "There is correlation between the contribution of bmi to predictions and the bmi values when the feature value is between |0.05 and 0.10|.",
    initVis: "scatter",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "bmi",
          type: "contribution of",
          transform: "average",
        },
      ],
      type: "correlation",
      relation: "positively", // #TODO
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 11,
    pageName: "question",
    userText:
      "The correlation between bmi and its feature values is stronger when the feature value for age is in the range |0.05 to 0.1| compared to |0 to 0.02|.",
    initVis: "scatter",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "age",
          type: "contribution of",
          transform: "average",
        },
      ],
      type: "featureInteraction",
      relation: "same",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: false,
  },
];
