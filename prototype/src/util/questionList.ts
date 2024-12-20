import { TQuestion, TVariable, TInsight, TGraph, TAnnotation } from "./types";

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    pageName: "question",
    userText:
      "The average contribution of the bmi to the prediction is larger than 20.",
    initVis: "beeswarm",
    secondVis: "scatter", // randomly chosen
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
        annotation: {
          type: "singleLine",
          xValue: 20
        }
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
    secondVis: "bar",
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
        annotation: {
          type: "singleLine",
          xValue: 5
        }
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
    secondVis: "bar", // randomly chosen
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
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["serum triglycerides"],
        annotation: {
          type: "singleLine",
          xValue: 30
        }
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
    secondVis: "bar",
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
        annotation: {
          type: "singleLine",
          xValue: 2.5
        }
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
        graphType: "Bar",
        xValues: "none",
        yValues: "none",
        features: ["blood pressure", "age"],
        
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 5,
    pageName: "question",
    userText: "bmi has more instances above 5 than sex.",
    initVis: "scatter",
    secondVis: "beeswarm", // randomly chosen
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "number of instances above 5 of",
          transform: "average",
        },
        {
          featureName: "sex",
          type: "number of instances above 5 of",
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
        features: ["bmi", "sex"]
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 6,
    pageName: "question",
    userText: "age has more instances above 3 than low-density lipoproteins.",
    initVis: "scatter",
    secondVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "age",
          type: "number of instances above 3 of",
          transform: "average",
        },
        {
          featureName: "low-density lipoproteins",
          type: "number of instances above 3 of",
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
        features: ["age", "low-density lipoproteins"]
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
    secondVis: "bar", // randomly chosen
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
        graphType: "Swarm",
        xValues: "BMI",
        yValues: "BMI",
        features: ["blood pressure", "age"],
        annotation: {
          type: "singleLine",
          xValue: 0,
        },
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
    secondVis: "scatter",
    insight: {
      variables: [
        {
          featureName: "blood pressure",
          type: "contribution of",
          transform: "average",
        },
        {
          featureName: "blood pressure",
          type: "contribution of",
          transform: "average",
        },
      ],
      type: "correlation",
      relation: "positively",
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
    secondVis: "scatter", // randomly chosen
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
      relation: "negatively",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "age",
        yValues: "age",
        annotation: {
          type: "highlightRange",
          xRange: [-0.1, 0]
        }
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
    secondVis: "scatter",
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
      relation: "positively",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "bmi",
        yValues: "bmi",
        annotation: {
          type: "highlightRange",
          xRange: [0.05, 0.1]
        }
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
    secondVis: "scatter",
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
