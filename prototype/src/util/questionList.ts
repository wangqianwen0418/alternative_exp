import { TQuestion } from "./types";

const randList = [];
for (let i=0; i < 12; i++){
  randList.push(Math.random())
}

const newVals = randList;

export const QuestionList: TQuestion[] = [
  {
    index: 0,
    condition: newVals[0] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText: "On average, the absolute contribution of BMI to diabetes risk is at least 20.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi"],
      featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
    },
    secondVis: "SCATTER", // randomly chosen
    newVis: {
      graphType: "SCATTER",
      xValues: "BMI Feature Values",
      yValues: "BMI SHAP (Contribution) Values",
      annotation: 
        {
          type: "singleLine",
          xValue: 20,
        },
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
      optimalGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["bmi"],
        featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
        annotation: 
          {
            type: "singleLine",
            xValue: 20,
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        annotation: 
          {
            type: "singleLine",
            xValue: 20,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: true, //verified
  },
  {
    index: 1,
    condition: newVals[1] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "On average, the absolute contribution of serum triglycerides to diabetes risk is higher than it is for blood sugar.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["serum triglycerides level", "blood sugar level"],
      featuresToShow: ["serum triglycerides level", "blood sugar level", "bmi", "age"],
    },
    secondVis: "SCATTER",
    newVis: {
      graphType: "SCATTER",
      xValues: "Blood Sugar Feature Values",
      yValues: "Blood Sugar SHAP (Contribution) Values",
      //featuresToHighlight: ["serum triglycerides level"],
      annotation: 
        {
          type: "singleLine",
          xValue: 5,
        },
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
      optimalGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["serum triglycerides level", "blood sugar level"],
        featuresToShow: ["serum triglycerides level", "blood sugar level", "bmi", "age"],
        annotation: 
          {
            type: "singleLine",
            xValue: 5,
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "Blood Sugar Feature Values",
        yValues: "Blood Sugar SHAP (Contribution) Values",
        //featuresToHighlight: ["serum triglycerides level"],
        annotation: 
          {
            type: "singleLine",
            xValue: 5,
          },
      },
    },
    testCondition: "ours",
    groundTruth: true, //verified
  },
  {
    index: 2,
    condition: newVals[2] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "On average, the absolute contribution of serum triglycerides to diabetes risk is over 30.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["serum triglycerides level"],
      featuresToShow: ["serum triglycerides level", "bmi", "blood sugar level"],
      // annotation: 
      //   {type: "singleLine",
      //     xValue: 30,
      //   }
      // 
    },
    secondVis: "SCATTER", // randomly chosen
    newVis: {
      graphType: "SCATTER",
      xValues: "Serum Triglycerides Feature Values",
      yValues: "Serum Triglycerides SHAP (Contribution) Values",
      annotation: 
        {
          type: "singleLine",
          yValue: 30,
        },
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
      optimalGraph: {
        graphType: "BAR",
        xValues: "Serum Triglycerides Feature Values",
        yValues: "Serum Triglycerides SHAP (Contribution) Values",
        featuresToHighlight: ["serum triglycerides level"],
        featuresToShow: ["serum triglycerides level", "bmi", "blood sugar"],
        annotation:
          {
            type: "singleLine",
            xValue: 30,
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "Serum Triglycerides Feature Values",
        yValues: "Serum Triglycerides SHAP (Contribution) Values",
        annotation: 
          {
            type: "singleLine",
            yValue: 30,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: false, //verified
  },
  {
    index: 3,
    condition: newVals[3] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "There is a positive correlation between blood sugar values and the contribution of blood sugar to diabetes risk when the blood sugar value is between -0.05 and 0.05.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood sugar level"],
      featuresToShow: ["blood sugar level", "age", "sex", "bmi", "serum triglycerides level"],
    },
    secondVis: "BAR",
    newVis: {
      graphType: "BAR",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood sugar level"],
      featuresToShow: ["blood sugar level", "age", "bmi", "serum triglycerides level"],
      annotation:
        {
          type: "singleLine",
          xValue: 2.5,
        },
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
      optimalGraph: {
        graphType: "SCATTER",
        xValues: "Blood Sugar Feature Values",
        yValues: "Blood Sugar SHAP (Contribution) Values",
        annotation: {
          type: "highlightRange",
          xRange: [-0.05, 0.05]
        }
      },
      randomGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["blood sugar level"],
        featuresToShow: ["blood sugar level", "age", "bmi", "serum triglycerides level"],
        annotation:
          {
            type: "singleLine",
            xValue: 2.5,
          },
      },
    },
    testCondition: "ours",
    groundTruth: false, //ASK NICK
  },
  {
    index: 4,
    condition: newVals[4] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "On average, the absolute contribution of blood pressure to diabetes progression is less than it is for age.",
    initVis: {
      graphType: "HEATMAP",
      xValues: "none",
      yValues: "none",
      featuresToHighlight: ["blood pressure", "age"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar level", "bmi"], 
    },
    secondVis: "beeswarm", // randomly chosen
    newVis: {
      graphType: "SWARM",
      xValues: "none",
      yValues: "none",
      featuresToHighlight: ["blood pressure", "age"],
      featuresToShow: ["blood pressure", "age", "bmi", "blood sugar level"],
      annotation: 
        {
          type: "singleLine",
          xValue: 5,
        },
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
      relation: "less than",
      condition: undefined,
      optimalGraph: {
        graphType: "BAR",
        xValues: "blood pressure",
        yValues: "none",
        featuresToHighlight: ["blood pressure", "age"],
        featuresToShow: ["blood pressure", "age", "sex", "bmi"],
        annotation: { type: "singleLine", xValue: 5 },
      },
      randomGraph: {
        graphType: "SWARM",
        xValues: "none",
        yValues: "none",
        featuresToHighlight: ["blood pressure", "age"],
        featuresToShow: ["blood pressure", "age", "bmi", "blood sugar level"],
        annotation: 
          {
            type: "singleLine",
            xValue: 5,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 5,
    condition: newVals[5] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "BMI contributes positively to diabetes risk for more patients than sex does.",
    initVis: {
      graphType: "SCATTER",
      xValues: "BMI Feature Values",
      yValues: "BMI SHAP (Contribution) Values",
    },
    secondVis: "BAR", // randomly chosen
    newVis: {
      graphType: "BAR",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi", "sex"],
      featuresToShow: ["bmi", "sex", "age", "blood sugar level", "serum cholesterol"],
      annotation: 
        {
          type: "singleLine",
          xValue: 1,
        },
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
      optimalGraph: {
        graphType: "SWARM",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["bmi", "sex"],
        featuresToShow: ["blood pressure", "bmi", "sex", "blood sugar level"],
        annotation: 
          {
            type: "singleLine",
            xValue: 0,
          },
      },
      randomGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["bmi", "sex"],
        featuresToShow: ["bmi", "sex", "age", "blood sugar level", "serum cholesterol"],
        annotation: 
          {
            type: "singleLine",
            xValue: 1,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 6,
    condition: newVals[6] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "Age contributes positively to more instances than low-density lipoproteins.",
    initVis: {
      graphType: "SCATTER",
      xValues: "LDL Feature Values",
      yValues: "LDL SHAP (Contribution) Values",
    },
    secondVis: "beeswarm",
    newVis: {
      graphType: "BAR",
      xValues: "None",
      yValues: "None",
      featuresToShow: ["age", "low-density lipoproteins", "sex", "serum cholesterol, blood sugar"],
      featuresToHighlight: ["age", "low-density lipoproteins"],
      //features: ["age", "low-density lipoproteins"],
      annotation: { type: "singleLine", xValue: 0 },
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
      optimalGraph: {
        graphType: "SWARM",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["age", "low-density lipoproteins"],
        featuresToShow: ["low-density lipoproteins", "age", "sex", "blood sugar level", "serum triglycerides level"],
        annotation: { type: "singleLine", xValue: 0 },
      },
      randomGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToShow: ["age", "low-density lipoproteins", "sex", "serum cholesterol, blood sugar"],
        featuresToHighlight: ["age", "low-density lipoproteins"],
        //features: ["age", "low-density lipoproteins"],
        annotation: { type: "singleLine", xValue: 0 },
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 7,
    condition: newVals[7] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "Blood pressure has larger deviations in its contribution to diabetes risk compared to age.",
    initVis: {
      graphType: "SCATTER",
      xValues: "Blood Pressure Feature Values",
      yValues: "Blood Pressure SHAP (Contribution) Values",
    },
    secondVis: "BAR", // randomly chosen
    newVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure", "age"],
      featuresToShow: ["blood pressure", "age", "blood sugar level", "bmi"],
      annotation:
        {
          type: "singleLine",
          xValue: 8,
        },
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
      optimalGraph: {
        graphType: "BAR",
        xValues: "BMI",
        yValues: "BMI",
        featuresToHighlight: ["blood pressure", "age"],
        featuresToShow: ["blood pressure", "age", "blood sugar level", "low-density lipoproteins"],
        annotation:
          {
            type: "singleLine",
            xValue: 8,
          },
      },
      randomGraph: {
        graphType: "SWARM",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["blood pressure", "age"],
        featuresToShow: ["blood pressure", "age", "blood sugar level", "bmi"],
        annotation:
          {
            type: "singleLine",
            xValue: 8,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: true,
  },
  {
    index: 8,
    condition: newVals[8] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "There is a positive correlation between blood pressure and its contribution to diabetes risk.",
    initVis: {
      graphType: "HEATMAP",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure"],
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar level"],
    },
    secondVis: "SCATTER",
    newVis: {
      graphType: "SWARM",
      xValues: "Blood Pressure Feature Values",
      yValues: "Blood Pressure SHAP (Contribution) Values",
      featuresToShow: ["blood pressure", "age", "sex", "blood sugar level"],
      featuresToHighlight: ["blood pressure"],
      annotation: {
        type: "singleLine",
        xValue: 5
      }
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
      optimalGraph: {
        graphType: "SCATTER",
        xValues: "Blood Pressure Feature Values",
        yValues: "Blood Pressure SHAP (Contribution) Values",
      },
      randomGraph: {
        graphType: "SWARM",
        xValues: "Blood Pressure Feature Values",
        yValues: "Blood Pressure SHAP (Contribution) Values",
        featuresToShow: ["blood pressure", "age", "sex", "blood sugar level"],
        featuresToHighlight: ["blood pressure"],
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
    index: 9,
    condition: newVals[9] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "Blood pressure is correlated more strongly to diabetes risk when the BMI is between 0.1 and 0.2 versus -0.05 to 0.05.",
    initVis: {
      graphType: "HEATMAP",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure", "bmi"],
      featuresToShow: ["blood pressure", "bmi", "high-density lipoproteins", "blood sugar level"],
    },
    secondVis: "SCATTER", // randomly chosen
    newVis: {
      graphType: "SCATTER",
      xValues: "Blood Pressure Feature Values",
      yValues: "Blood Pressure SHAP (Contribution) Values",
      annotation: 
        {
          type: "highlightRange",
          xRange: [-0.05, 0.05],
        },
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
      optimalGraph: {
        graphType: "TWO-SCATTER",
        xValues: "Blood Pressure Feature Values",
        yValues: "Blood Pressure SHAP (Contribution) Values",
        colorValues: "BMI Feature Values",
        annotation:
          {
            type: "twoColorRange",
            range: [
              [0.2, 0.5],
              [0, 0.1]
            ]
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "Blood Pressure Feature Values",
        yValues: "Blood Pressure SHAP (Contribution) Values",
        annotation: 
          {
            type: "highlightRange",
            xRange: [-0.05, 0.05],
          },
      },
    },
    testCondition: "random vis",
    groundTruth: false,
  },
  {
    index: 10,
    condition: newVals[10] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "In the BMI range of 0.05 and 0.1, it is positively correlated with diabetes risk.",
    initVis: {
      graphType: "HEATMAP",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi"],
      featuresToShow: ["blood pressure", "age", "bmi", "blood sugar level"],
    },
    secondVis: "SCATTER",
    newVis: {
      graphType: "SWARM",
      xValues: "BMI Feature Values",
      yValues: "BMI SHAP (Contribution) Values",
      featuresToShow: ["bmi", "age", "serum triglycerides level"],
      featuresToHighlight: ["bmi"],
      // annotation:
      //   {
      //     type: "highlightRange",
      //     xRange: [0.05, 0.1],
      //   },
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
      optimalGraph: {
        graphType: "SCATTER",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        annotation:
          {
            type: "highlightRange",
            xRange: [0.05, 0.1],
          },
      },
      randomGraph: {
        graphType: "SWARM",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        featuresToShow: ["bmi", "age", "serum triglycerides level"],
        featuresToHighlight: ["bmi"],
      },
    },
    testCondition: "ours",
    groundTruth: true,
  },
  {
    index: 11,
    condition: newVals[11] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText:
      "BMI is correlated more strongly to diabetes risk when the age is between 0.05 to 0.1 versus 0 to 0.02.",
    initVis: {
      graphType: "HEATMAP",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi", "age"],
      featuresToShow: ["blood pressure", "bmi", "sex", "blood sugar level"],
    },
    secondVis: "SCATTER",
    newVis: {
      graphType: "SCATTER",
      xValues: "BMI Feature Values",
      yValues: "BMI SHAP (Contribution) Values",
      annotation: {
        type: "highlightRange",
        xRange: [0.05, 0.1]
      },
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
      optimalGraph: {
        graphType: "TWO-SCATTER",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        colorValues: "Age Feature Values",
        annotation: 
          {
            type: "twoColorRange",
            range: [
              [0.05, 0.1],
              [0, 0.02]
            ],
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        annotation: {
          type: "highlightRange",
          xRange: [0.05, 0.1]
        },
      },
    },
    testCondition: "ours",
    groundTruth: false,
  },
  {
    index: 12,
    condition: newVals[0] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText: "BMI is a feature that is used in this model to predict diabetes risk.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["bmi"],
      featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
    },
    secondVis: "SCATTER", // randomly chosen
    newVis: {
      graphType: "SCATTER",
      xValues: "BMI Feature Values",
      yValues: "BMI SHAP (Contribution) Values",
      annotation: 
        {
          type: "singleLine",
          xValue: 20,
        },
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
      optimalGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["bmi"],
        featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
        annotation: 
          {
            type: "singleLine",
            xValue: 20,
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "BMI Feature Values",
        yValues: "BMI SHAP (Contribution) Values",
        annotation: 
          {
            type: "singleLine",
            xValue: 20,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: true, //verified
  },
  {
    index: 13,
    condition: newVals[0] < 0.5 ? "OPTIMAL" : "RANDOM",
    pageName: "question",
    userText: "Diabetes is a chronic condition that affects many people.",
    initVis: {
      graphType: "SWARM",
      xValues: "None",
      yValues: "None",
      featuresToHighlight: ["blood pressure"],
      featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
    },
    secondVis: "SCATTER", // randomly chosen
    newVis: {
      graphType: "SCATTER",
      xValues: "Blood Pressure Feature Values",
      yValues: "Blood Pressure SHAP (Contribution) Values",
      annotation: 
        {
          type: "singleLine",
          xValue: 20,
        },
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
      optimalGraph: {
        graphType: "BAR",
        xValues: "None",
        yValues: "None",
        featuresToHighlight: ["blood pressure"],
        featuresToShow: ["bmi", "serum triglycerides level", "blood pressure"],
        annotation: 
          {
            type: "singleLine",
            xValue: 20,
          },
      },
      randomGraph: {
        graphType: "SCATTER",
        xValues: "Blood Pressure Feature Values",
        yValues: "Blood Pressure SHAP (Contribution) Values",
        annotation: 
          {
            type: "singleLine",
            xValue: 20,
          },
      },
    },
    testCondition: "random vis",
    groundTruth: true, //verified
  },
];
