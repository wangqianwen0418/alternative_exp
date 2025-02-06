import { TQuestion } from "./types";

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    pageName: "question",
    userText: "BMI contributes at least 20 to diabetes risk",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP values",
      annotation: [
        {
          type: "singleLine",
          xValue: 20,
        },
      ],
    },
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
        graphType: "Bar",
        xValues: "None",
        yValues: "None",
        features: ["bmi"],
        annotation: [
          {
            type: "singleLine",
            xValue: 20,
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
    userText: "blood pressure contributes more than 5 to diabetes risk.",
    initVis: {
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
          type: "contribution to the prediction of",
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
    userText: "Serum Triglycerides contributes 30+ to the prediction",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      features: ["serum triglycerides level"],
      // annotation: [
      //   {type: "singleLine",
      //     xValue: 30,
      //   }
      // ]
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "Serum triglycerides feature values",
      yValues: "Serum triglycerides SHAP values",
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
          type: "contribution to the prediction of",
          transform: "average",
        },
        30,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
      graph: {
        graphType: "Scatter",
        xValues: "Serum triglycerides feature values",
        yValues: "Serum triglycerides SHAP values",
        features: ["serum triglycerides level"],
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
    userText: "Serum cholesterol contributes more than 2.5",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      //features: ["serum cholesterol"],
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
          type: "contribution to the prediction of",
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
    userText: "BP is more important than age",
    initVis: {
      graphType: "Heatmap",
      xValues: "none",
      yValues: "none",
      features: ["blood pressure", "age"],
    },
    secondVis: "beeswarm", // randomly chosen
    newVis: {
      graphType: "Swarm",
      xValues: "none",
      yValues: "none",
      features: ["blood pressure, age"],
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
          type: "contribution to the prediction of",
          transform: "average",
        },
        {
          featureName: "age",
          type: "contribution to the prediction of",
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
        annotation: [{ type: "singleLine", xValue: 5 }],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 5,
    pageName: "question",
    userText: "bmi has more instances above 0 than sex.",
    initVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP values",
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
          transform: "",
        },
        {
          featureName: "sex",
          type: "number of instances above 0 of",
          transform: "",
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
    userText:
      "age contributes positively to more instances than Low-Density Lipoproteins.",
    initVis: {
      graphType: "Scatter",
      xValues: "LDL feature values",
      yValues: "LDL SHAP values",
    },
    secondVis: "beeswarm",
    newVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      //features: ["age", "low-density lipoproteins"],
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
    userText: "the deviations for BP are larger than they are for age",
    initVis: {
      graphType: "Scatter",
      xValues: "Blood pressure feature values",
      yValues: "Blood pressure SHAP values",
    },
    secondVis: "bar", // randomly chosen
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      features: ["blood pressure", "age"],
      annotation: [
        {
          type: "singleLine",
          xValue: 8,
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "blood pressure",
          type: "",
          transform: "deviation of",
        },
        {
          featureName: "age",
          type: "",
          transform: "deviation of",
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
        annotation: [
          {
            type: "singleLine",
            xValue: 8,
          },
        ],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 8,
    pageName: "question",
    userText: "bp contribution goes up as bp values go up",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      features: ["blood pressure"],
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "Blood pressure feature values",
      yValues: "Blood pressure SHAP values",
    },
    insight: {
      variables: [
        {
          featureName: "blood pressure",
          type: "contribution to the prediction of",
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
        xValues: "blood pressure feature values",
        yValues: "blood pressure SHAP values",
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 9,
    pageName: "question",
    userText:
      "Age has a negative correlation with diabetes risk when age is between -0.1 and 0",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      features: ["age"],
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "Age feature values",
      yValues: "Age SHAP values",
      annotation: [
        {
          type: "highlightRange",
          xRange: [-0.1, 0],
        },
      ],
    },
    insight: {
      variables: [
        {
          featureName: "age",
          type: "contribution to the prediction of",
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
        xValues: "Age feature values",
        yValues: "Age SHAP values",
        annotation: [
          {
            type: "highlightRange",
            xRange: [-0.1, 0],
          },
        ],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 10,
    pageName: "question",
    userText:
      "In the BMI range of 0.05 and 0.1, it is positively correlated with diabetes risk",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      features: ["bmi"],
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP values",
      annotation: [
        {
          type: "highlightRange",
          xRange: [0.05, 0.1],
        },
      ],
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
          type: "contribution to the prediction of",
          transform: "",
        },
      ],
      type: "correlation",
      relation: "positively correlated",
      condition: { featureName: "bmi", range: [0.05, 0.1] },
      graph: {
        graphType: "Scatter",
        xValues: "BMI feature values",
        yValues: "BMI SHAP values",
        annotation: [
          {
            type: "highlightRange",
            xRange: [0.05, 0.1],
          },
        ],
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 11,
    pageName: "question",
    userText:
      "BMI has a stronger correlation with predictions when age is between 0.05 to 0.1 versus 0 to 0.02",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      features: ["bmi", "age"],
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP values",
    },
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution to the prediction of",
          transform: "average",
        },
        {
          featureName: "age",
          type: "contribution to the prediction of",
          transform: "average",
        },
      ],
      type: "featureInteraction",
      relation: "different",
      condition: {featureName: "age", range: [[0.05, 0.1], [0,0.02]]},
      graph: {
        graphType: "Scatter",
        xValues: "BMI feature values",
        yValues: "BMI SHAP values",
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
];
