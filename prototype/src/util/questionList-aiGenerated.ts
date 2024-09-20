import { TQuestion } from "./types";

export const QuestionList: TQuestion[] = [
  // --- Test condition: no vis ---
  {
    index: 0,
    pageName: "question",
    userText:
      "BMI is more important than age for predicting diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "bmi", transform: "average", type: "contribution" },
        { featureName: "age", transform: "average", type: "contribution" },
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
      "Blood Sugar level contributes positively for diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "blood sugar",
          type: "contribution",
          transform: undefined,
        },
        0,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 2,
    pageName: "question",
    userText:
      "The larger the age, the more likely greater diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "age", type: "value", transform: undefined },
        { featureName: "age", type: "contribution", transform: undefined },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 3,
    pageName: "question",
    userText:
      "Patients with higher BMI experience greater disease progression.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: undefined },
        { featureName: "age", type: "contribution", transform: undefined },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: false,
  },
  {
    index: 4,
    pageName: "question",
    userText: "Older patients show a higher risk of diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "age", type: "value", transform: undefined },
        { featureName: "bmi", type: "contribution", transform: undefined },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 5,
    pageName: "question",
    userText: "Blood pressure is positively associated with diabetes risk.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "blood pressure", type: "value", transform: undefined },
        { featureName: "cholesterol", type: "value", transform: undefined },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 6,
    pageName: "question",
    userText:
      "BMI and age are equally important in predicting diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: "average" },
        { featureName: "age", type: "contribution", transform: "average" },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: false,
  },
  {
    index: 7,
    pageName: "question",
    userText: "Higher cholesterol levels lead to greater disease progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "cholesterol", type: "value", transform: "average" },
        { featureName: "age", type: "value", transform: "average" },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: true,
  },
  {
    index: 8,
    pageName: "question",
    userText: "Cholesterol level does not affect diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "cholesterol",
          type: "contribution",
          transform: undefined,
        },
        {
          featureName: "blood sugar",
          type: "contribution",
          transform: undefined,
        },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: false,
  },
  {
    index: 9,
    pageName: "question",
    userText:
      "Blood pressure and blood sugar contribute equally to diabetes risk.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "blood pressure", type: "value", transform: "average" },
        { featureName: "blood sugar", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "no vis",
    groundTruth: true,
  },

  // --- Test condition: random vis ---
  {
    index: 10,
    pageName: "question",
    userText:
      "Patients with high cholesterol have higher diabetes progression risk.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "cholesterol", type: "value", transform: "average" },
        {
          featureName: "blood pressure",
          type: "contribution",
          transform: undefined,
        },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 11,
    pageName: "question",
    userText: "Higher cholesterol leads to higher disease progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "cholesterol",
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
    index: 12,
    pageName: "question",
    userText: "Blood sugar level correlates with high diabetes progression.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "blood sugar", type: "value", transform: undefined },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 13,
    pageName: "question",
    userText: "Higher age increases the chance of higher diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "age", type: "contribution", transform: undefined },
        {
          featureName: "blood pressure",
          type: "contribution",
          transform: undefined,
        },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 14,
    pageName: "question",
    userText:
      "Patients with higher blood sugar are at greater risk for diabetes.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "blood sugar",
          type: "contribution",
          transform: undefined,
        },
        { featureName: "age", type: "value", transform: "average" },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 15,
    pageName: "question",
    userText: "Higher blood pressure does not increase diabetes risk.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "blood pressure", type: "value", transform: undefined },
        { featureName: "bmi", type: "contribution", transform: "average" },
      ],
      type: "comparison",
      relation: "less",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 16,
    pageName: "question",
    userText: "Blood sugar and age contribute equally to diabetes progression.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "blood sugar", type: "value", transform: "average" },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 17,
    pageName: "question",
    userText: "Higher age means higher risk of diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "age", type: "value", transform: "average" },
        { featureName: "blood sugar", type: "value", transform: "average" },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 18,
    pageName: "question",
    userText: "BMI and age are equally important for predicting diabetes.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: "average" },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 19,
    pageName: "question",
    userText:
      "Blood pressure and cholesterol equally impact diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        { featureName: "blood pressure", type: "value", transform: "average" },
        { featureName: "cholesterol", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "random vis",
    groundTruth: true,
  },

  // --- Test condition: ours ---
  {
    index: 20,
    pageName: "question",
    userText: "Patients with lower BMI have higher disease progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: "average" },
        { featureName: "cholesterol", type: "value", transform: undefined },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 21,
    pageName: "question",
    userText: "Cholesterol positively correlates with disease progression.",
    initVis: "bar",
    insight: {
      variables: [
        { featureName: "cholesterol", type: "value", transform: "average" },
        { featureName: "bmi", type: "contribution", transform: undefined },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 22,
    pageName: "question",
    userText:
      "Patients with high BMI show greater signs of disease progression.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: undefined },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 23,
    pageName: "question",
    userText: "BMI is a stronger predictor than age for disease progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: "average" },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 24,
    pageName: "question",
    userText:
      "Cholesterol has a greater effect on diabetes than blood pressure.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "cholesterol",
          type: "contribution",
          transform: undefined,
        },
        { featureName: "blood pressure", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 25,
    pageName: "question",
    userText: "BMI and age have the same effect on disease progression.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "bmi", type: "value", transform: "average" },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 26,
    pageName: "question",
    userText: "Blood pressure impacts diabetes progression more than BMI.",
    initVis: "scatter",
    insight: {
      variables: [
        { featureName: "blood pressure", type: "value", transform: "average" },
        { featureName: "bmi", type: "contribution", transform: undefined },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 27,
    pageName: "question",
    userText: "BMI and cholesterol contribute equally to disease progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        { featureName: "bmi", type: "contribution", transform: undefined },
        {
          featureName: "cholesterol",
          type: "contribution",
          transform: undefined,
        },
      ],
      type: "comparison",
      relation: "equal",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 28,
    pageName: "question",
    userText:
      "Higher cholesterol increases diabetes progression more than BMI.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "cholesterol",
          type: "contribution",
          transform: undefined,
        },
        { featureName: "bmi", type: "value", transform: "average" },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 29,
    pageName: "question",
    userText:
      "Patients with high blood pressure are at greater risk of diabetes.",
    initVis: "scatter",
    insight: {
      variables: [
        {
          featureName: "blood pressure",
          type: "contribution",
          transform: "average",
        },
        { featureName: "age", type: "value", transform: undefined },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: "ours",
    groundTruth: true,
  },
];
