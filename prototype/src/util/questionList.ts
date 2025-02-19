import { TQuestion } from "./types";

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    pageName: "question",
    userText: "On average, BMI contributes at least 20 to diabetes risk",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi"],
      featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP (Contribution) values",
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
        featuresToHighlight: ["bmi"],
        featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
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
    userText:
      "On average, serum triglycerides are more important than blood sugar for diabetes risk.",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["serum triglycerides level", "blood sugar"],
      featuresToShow: ["serum triglycerides level", "blood sugar", "bmi", "age"],
    },
    secondVis: "bar",
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["serum "],
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
        featuresToHighlight: ["serum triglycerides level", "blood sugar"],
        featuresToShow: ["serum triglycerides level", "blood sugar", "bmi", "age"],
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
      "On average, serum tryglycerides level contributes 30+ to diabetes risk",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["serum triglycerides level"],
      featuresToShow: ["serum triglycerides level", "bmi", "blood sugar"],
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
      yValues: "Serum triglycerides SHAP (Contribution) values",
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
        yValues: "Serum triglycerides SHAP (Contribution) values",
        featuresToHighlight: ["serum triglycerides level"],
        //featuresToShow: ["serum triglycerides level", "bmi", "blood sugar"]
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
      "There is a positive correlation between blood sugar values and the contribution of blood sugar values to diabetes risk",
    initVis: {
      graphType: "Swarm",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood sugar"],
      featuresToShow: ["blood sugar", "age", "sex", "bmi", "serum triglycerides level"],
    },
    secondVis: "bar",
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["serum cholesterol"],
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
        graphType: "Scatter",
        xValues: "Blood sugar feature values",
        yValues: "Blood sugar SHAP (Contribution) values",
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 4,
    pageName: "question",
    userText:
      "On average, blood pressure is more important than age for diabetes risk",
    initVis: {
      graphType: "Heatmap",
      xValues: "none",
      yValues: "none",
      featuresToHighlight: ["blood pressure", "age"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar", "low-density lipoproteins"], 
    },
    secondVis: "beeswarm", // randomly chosen
    newVis: {
      graphType: "Swarm",
      xValues: "none",
      yValues: "none",
      featuresToHighlight: ["blood pressure, age"],
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
        featuresToHighlight: ["blood pressure", "age"],
        featuresToShow: ["blood pressure", "age", "sex", "blood sugar"],
        annotation: [{ type: "singleLine", xValue: 5 }],
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 5,
    pageName: "question",
    userText:
      "BMI contributes positively to diabetes risk for more patients than sex does.",
    initVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP (Contribution) values",
    },
    secondVis: "bar", // randomly chosen
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi", "sex"],
      annotation: [
        {
          type: "singleLine",
          xValue: 1,
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
        featuresToHighlight: ["bmi", "sex"],
        featuresToShow: ["blood pressure", "bmi", "sex", "blood sugar"],
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
      yValues: "LDL SHAP (Contribution) values",
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
        featuresToHighlight: ["age", "low-density lipoproteins"],
        featuresToShow: ["low-density lipoproteins", "age", "sex", "blood sugar", "serum triglycerides level"],
        //annotation: [{ type: "singleLine", xValue: 0 }],
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 7,
    pageName: "question",
    userText:
      "Blood pressure has larger deviations in its contribution to diabetes risk compared to age",
    initVis: {
      graphType: "Scatter",
      xValues: "Blood pressure feature values",
      yValues: "Blood pressure SHAP (Contribution) values",
    },
    secondVis: "bar", // randomly chosen
    newVis: {
      graphType: "Bar",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure", "age"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar"],
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
        featuresToHighlight: ["blood pressure", "age"],
        featuresToShow: ["blood pressure", "age", "sex", "blood sugar"],
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
    userText:
      "There is a positive correlation between blood pressure and its contribution to diabetes risk",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar"],
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "Blood pressure feature values",
      yValues: "Blood pressure SHAP (Contribution) values",
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
        yValues: "blood pressure SHAP (Contribution) values",
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 9,
    pageName: "question",
    userText:
      "Blood pressure is correlated more strongly to diabetes risk when the BMI is between 0.1 and 0.2 versus -0.05 to 0.05",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["age"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar"],
    },
    secondVis: "scatter", // randomly chosen
    newVis: {
      graphType: "Scatter",
      xValues: "Age feature values",
      yValues: "Age SHAP (Contribution) values",
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
      // graph: {
      //   graphType: "two-scatter",
      //   xValues: "Blood pressure feature values",
      //   yValues: "Blood pressure SHAP values",
      //   colorValues: "BMI feature values",
      //   annotation: [
      //     {
      //       type: "twoColorRange",
      //       range: [
      //         [0.2,0.5],
      //         [0,0.1]
      //       ]
      //     },
      //   ],
      // },
      graph: {
        graphType: "Scatter",
        xValues: "Age feature values",
        yValues: "Age SHAP (Contribution) values",
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
      featuresToHighlight: ["bmi"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar"],
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP (Contribution) values",
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
        yValues: "BMI SHAP (Contribution) values",
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
      "BMI is correlated more strongly to diabetes risk when the age is between 0.05 to 0.1 versus 0 to 0.02",
    initVis: {
      graphType: "Heatmap",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi", "age"],
      featuresToShow: ["blood pressure", "bmi", "sex", "blood sugar"],
    },
    secondVis: "scatter",
    newVis: {
      graphType: "Scatter",
      xValues: "BMI feature values",
      yValues: "BMI SHAP (Contribution) values",
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
      condition: {
        featureName: "age",
        range: [
          [0.05, 0.1],
          [0, 0.02],
        ],
      },
      graph: {
        graphType: "two-scatter",
        xValues: "BMI feature values",
        yValues: "BMI SHAP (Contribution) values",
        colorValues: "Age feature values",
        annotation: [
          {
            type: "twoColorRange",
            range: [
              [0.05, 0.1],
              [0, 0.02],
            ],
          },
        ],
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
];
