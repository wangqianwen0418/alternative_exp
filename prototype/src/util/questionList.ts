import { TQuestion, TVariable, TInsight, TGraph, TAnnotation } from "./types";

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    pageName: "question",
    userText:
      "The average contribution of the bmi to the prediction is larger than 20.",
    initVis: "beeswarm",
    firstVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "None",
      yValues: "None",
      annotation: [
        {
          type: "singleLine",
          yValue: 20,
        },
      ],
    },
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
      graph: {
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["bmi"],
        annotation: [
          {
            type: "singleLine",
            yValue: 20,
          },
        ],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 1,
    pageName: "question",
    userText:
      "The average contribution of blood pressure to the prediction is larger than 5.",
    initVis: "beeswarm",
    firstVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["blood pressure"],
    },
    secondVis: "bar",
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      features: ["blood pressure"],
      annotation: [
        {
          type: "singleLine",
          xValue: 5,
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "blood pressure",
          type: "contribution of",
          transform: "average",
        },
        5,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["blood pressure"],
        annotation: [
          {
            type: "singleLine",
            xValue: 5,
          },
        ],
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 2,
    pageName: "question",
    userText:
      "The serum triglycerides level values contribute at least 30 to the prediction.",
    initVis: "beeswarm",
    firstVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["serum triglycerides"],
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "None",
      yValues: "None",
      annotation: [
        {
          type: "singleLine",
          yValue: 30,
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "serum triglycerides level",
          type: "contribution of",
          transform: "average",
        },
        30,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "None",
        yValues: "None",
        features: ["serum triglycerides"],
        annotation: [
          {
            type: "singleLine",
            yValue: 30,
          },
        ],
      },
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 3,
    pageName: "question",
    userText:
      "The serum cholesterol values contribute at least 2.5 to the prediction.",
    initVis: "beeswarm",
    firstVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["serum cholesterol"],
    },
    secondVis: "bar",
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      features: ["serum cholesterol"],
      annotation: [
        {
          type: "singleLine",
          xValue: 2.5,
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "serum cholesterol",
          type: "contribution of",
          transform: "average",
        },
        2.5,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["serum cholesterol"],
        annotation: [
          {
            type: "singleLine",
            xValue: 2.5,
          },
        ],
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 4,
    pageName: "question",
    userText: "blood pressure contributes more to the prediction than age.",
    initVis: "heatmap",
    secondVis: "beeswarm", // randomly chosen
    newVis: {
      graphType: "Swarm",
      xValues: "none",
      yValues: "none",
      features: ["blood pressure, age"],
      annotation: [
        {
          type: "singleLine",
          xValue: 25,
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "blood pressure",
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
      graph: {
        graphType: "Swarm",
        xValues: "blood pressure",
        yValues: "none",
        features: ["blood pressure", "age"],
        annotation: [{ type: "singleLine", xValue: 40 }],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 5,
    pageName: "question",
    userText: "bmi has more instances above 0 than sex.",
    initVis: "scatter",
    firstVis: {
      graphType: "Scatter",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "bar", // randomly chosen
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      features: ["bmi", "sex"],
      annotation: [
        {
          type: "singleLine",
          xValue: 0,
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "number of instances above 0 of",
          transform: "average",
        },
        {
          featureName: "sex",
          type: "number of instances above 0 of",
          transform: "average",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["bmi", "sex"],
        annotation: [
          {
            type: "singleLine",
            xValue: 0,
          },
        ],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 6,
    pageName: "question",
    userText: "age has more instances above 0 than low-density lipoproteins.",
    initVis: "scatter",
    firstVis: {
      graphType: "Scatter",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "beeswarm",
    newVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["age", "low-density lipoproteins"],
      annotation: [{ type: "singleLine", xValue: 0 }],
    },
    insight: {
      variables: [
        {
          featureName: "age",
          type: "number of instances above 0 of",
          transform: "",
        },
        {
          featureName: "low-density lipoproteins",
          type: "number of instances above 0 of",
          transform: "",
        },
      ],
      type: "comparison",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Swarm",
        xValues: "None",
        yValues: "None",
        features: ["age", "low-density lipoproteins"],
        annotation: [{ type: "singleLine", xValue: 0 }],
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 7,
    pageName: "question",
    userText:
      "blood pressure has larger deviations in its contribution to the prediction compared to age.",
    initVis: "scatter",
    firstVis: {
      graphType: "Scatter",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "bar", // randomly chosen
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      features: ["blood pressure", "age"],
      annotation: [{
        type: "singleLine",
        xValue: 20,
      }],
    },
    insight: {
      variables: [
        {
          featureName: "blood pressure",
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
      graph: {
        graphType: "Bar",
        xValues: "BMI",
        yValues: "BMI",
        features: ["blood pressure", "age"],
        annotation: [{
          type: "singleLine",
          xValue: 20,
        }],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 8,
    pageName: "question",
    userText:
      "There is a positive correlation between the contribution of blood pressure to predictions and the blood pressure values.",
    initVis: "heatmap",
    firstVis: {
      graphType: "heatmap",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "blood pressure",
      yValues: "blood pressure",
    },
    insight: {
      variables: [
        {
          featureName: "blood pressure",
          type: "contribution of",
          transform: "",
        },
        {
          featureName: "blood pressure",
          type: "value of",
          transform: "",
        },
      ],
      type: "correlation",
      relation: "positively correlated",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "blood pressure",
        yValues: "blood pressure",
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 9,
    pageName: "question",
    userText:
      "There is a negative correlation between the contribution of age to predictions and the age values when the feature value is between -0.10 and 0.00.",
    initVis: "heatmap",
    firstVis: {
      graphType: "heatmap",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "age",
      yValues: "age",
      annotation: [{
        type: "highlightRange",
        xRange: [-0.1, 0],
      }],
    },
    insight: {
      variables: [
        {
          featureName: "age",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "age",
          type: "value of",
          transform: "average",
        },
      ],
      type: "correlation",
      relation: "negatively correlated",
      condition: { featureName: "age", range: [-0.1, 0] },
      graph: {
        graphType: "Scatter",
        xValues: "age",
        yValues: "age",
        annotation: [{
          type: "highlightRange",
          xRange: [-0.1, 0],
        }],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 10,
    pageName: "question",
    userText:
      "There is a positive correlation between the contribution of bmi to predictions and the bmi values when the feature value is between 0.05 and 0.10.",
    initVis: "heatmap",
    firstVis: {
      graphType: "heatmap",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "bmi",
      yValues: "bmi",
      annotation: [{
        type: "highlightRange",
        xRange: [0.05, 0.1],
      }],
    },
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "value of",
          transform: "",
        },
        {
          featureName: "bmi",
          type: "contribution of",
          transform: "",
        },
      ],
      type: "correlation",
      relation: "positively correlated",
      condition: { featureName: "bmi", range: [0.05, 0.1] },
      graph: {
        graphType: "Scatter",
        xValues: "bmi",
        yValues: "bmi",
        annotation: [{
          type: "highlightRange",
          xRange: [0.05, 0.1],
        }],
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 11,
    pageName: "question",
    userText:
      "The correlation between bmi and its feature values is stronger when the feature value for age is in the range |0.05 to 0.1| compared to |0 to 0.02|.",
    initVis: "heatmap",
    firstVis: {
      graphType: "heatmap",
      xValues: "None",
      yValues: "None",
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "bmi",
      yValues: "bmi",
    },
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
      graph: {
        graphType: "Scatter",
        xValues: "bmi",
        yValues: "bmi",
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
];
