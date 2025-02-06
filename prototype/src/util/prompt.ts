import OpenAI from "openai";
import { TInsight, TAnnotation} from "./types";
import { ResetTvOutlined } from "@mui/icons-material";

export const generatePrompt = (
  feature_names: string[],
  prediction_name: string
) => `
You are a bot that extracts structured content from User Interpretations (“insight”) of graphs related to how a machine learning system treats certain features. You will output a JSON object with specific information. 

First, ensure that all features mentioned in the insight are in this list: ${feature_names.join(
  ", "
)}. If a feature is not in the list, set Variables to ["ERROR"]. Abbreviations (like "BMI" for "Body Mass Index") are fine.

Next, determine the Category of the insight based on these descriptions: 

    Category 1:
    Attribution (DV) by Feature (IV), univariate. 
    Possible Examples: The <feature> values contribute at least <constant> to the <attribution>, The average contribution of F_i to the prediction is larger than <constant>

    Category 2:
    Bivariate comparison (Feature1, Feature2):
    Possible Examples: 
    Feature1 contributes more to the prediction than Feature2
    Feature1 influences a greater number of instances than Feature2

    Category 3:
    Attribution [DV1] by Feature Value [IV1] 
    Possible Examples:
    There is a positive correlation between the contribution of Feature1 to predictions and the Feature1 values when values are above 15

    Category 4:
    Multivariate Attribution by Feature Values
    Possible Examples:
    The correlation between the Feature1 Values and Feature1 is stronger/weaker when Feature2 is in range A compared to range B.

The first value in the JSON file you provide will be the category that the given insight belongs to (1,2,3,4). This will determine how we parse the rest of the insight going forward. 


Once the category is determined, the JSON should contain: 
Variables: An array of variables with the format: 
{
  featureName: string,
  transform: "average" | "deviations to the" | ""
  type: "value of" | "contribution to the prediction of" | "number of instances of <restriction> for" 
}

Note: For the "number of instances of <restriction> of", there would be a restriction that you should include in the value. for example, you might suggest "number of instances above 5 of" or "number of instances below 3 of". 
For Category 2, you may have "number of instances <condition> for" -- for example, for the input prompt "age has more instances above 3 than s2", type would be "number of instances above 3 for".

Note: if the type is "number of instances", there is no additional transformation (average, etc) that is provided.

If "correlation" (category 3) involves both value and contribution of the same feature, include both in the array. 
For example: "There is correlation between the contribution of bp to predictions and the bp values"
In this case, there are two variables: contribution of BP and BP values. 

Numbers: Any constants in the core part of the insight statement should be included in an array. If none, leave it empty.  It is important to note that this only applies to numbers that are part of the main insight statement - if there are numbers in a condition/restriction (described below), those should not go in this array. 

Type - this will match the category. Options are “read”, “comparison”, “correlation”, or “featureInteraction”) for categories 1-4 respectively.
Relationship: Based on the category
Category 1 (“read”): options are “greater than”, “less than”, “equal to”
Category 2 (“comparison”): options are “greater than”, “less than”, “equal to”
Category 3 (“correlation”): options are “positively correlated” or “negatively correlated”
Category 4 (“featureInteraction”): options are “same” or “different”

Condition: refers to restrictions on variable values. 
Example: “BMI is the most important feature in predicting diabetes risk when the value is above 25”
Condition: {
	featureName: “BMI”,
	range: [25, infinity]
}
If no condition, this will be an empty object.
For Category 4, there will be TWO ranges in the condition. 
Example: "The correlation between bmi and its feature values is stronger when the feature value for age is in the range 0.05 to 0.1 compared to -0.01 to 0"

Then condition would look like this:
Condition: {
  featureName: "age",
  range: [[0.05, 0.1], [-0.01, 0]]
}


GraphType: This will have four options: "Swarm", "Scatter", "Bar", "Heatmap". 
Here are the situations in which each one is most optimal:
Swarm: for comparisons of distributions, instances, or multiple features. Shows individual data points.
Scatter: for correlations.
Bar: For average values
Heatmap (note: shows how each feature contributes to the output for individual samples):
When you want to see how different features impact the prediction for individual instances 

XValues and YValues: This depends on the GraphType
Swarm and Scatter: XValues and YValues are the name of one of the features we are looking at
Bar and Heatmap: Set both to "None".
Features: A string array ["Feature 1", "Feature 2",...] of the names of the features to highlight. This should be be populated for Bar and Swarm Plots - otherwise, the value will be "None". Whenever you provide a feature name, make sure it is provided in Lower Case.

Annotation and AnnotationParams are the next two values in the JSON. Here are the options for Annotation:
SingleLine: When comparing to a single value (in either X or Y direction). AnnotationParams would be an array of two elements. The first element will be "X" or "Y", (If the line is vertical, use 'X' - if the line is horizontal, use 'Y'.). The second element will be a number (the value the line should be drawn at).
HighlightRange: When highlighting a range in the X,Y, or both directions. AnnotationParams would be an array [[x_min, x_max], [y_min, y_max]]. If the range is only in one direction, the other array will be empty.  In the case where one end of the range is infinity/neg. infity, please use "100" (or -100) for the value. 
HighlightDataPoints: When highlighting specific datapoints that may not fit a range. AnnotationParams would be an string "Specific Data Points".


The optimal annotation to use will be based on constants/conditions included in the insight statement.


Lines are more useful when we are comparing against a single value, HighlightRange is more useful when we want to highlight data points within a range (so it will not be used for Bar Graphs), and HighlightDataPoints is useful when examining a condition that does not fit neatly into a range. 
For Heatmaps, there will be no annotations, so if the GraphType is Heatmap then both Annotation and AnnotationParams will be "None".
For Barplots, the only annotations that are allowed are vertical lines (so make sure to use 'X' for the first value). 
For Swarms, there can be no range in the Y direction, only in the X direction.

For example, suppose the user input statement was "The average contribution of the bmi to the prediction is larger than 20". Since we are looking at the average contribution of each feature, the GraphType value would be "Bar".
Then, XValues and YValues would both be "None". Features would be ["BMI"]. Annotation would be "SingleLine" and AnnotationParams would be ["X", 20].
Here's another example: 
Suppose the user input statement was "bmi has more instances above 5 than sex". Since we are looking at individual data points (and comparing features), the GraphType value would be "Swarm".
In this case, the XValues field should be "BMI", and the YValues field would just be "BMI". Features would be ["BMI", "sex"].  Since we want to see the data points that satisfy this criteria, Annotation would be "HighlightRange" and AnnotationParams would be [[5, 100], []].

One last example: Suppose the user input statement was "There is a negative correlation between the contribution of age to predictions and the age values when the feature value is between -0.10 and 0.00". 
In this case, since we are looking at correlation, GraphType would be "Scatter". Then the XValues field would be "Age" and the YValues field would be "Age".  Since it is a scatter plot, Features would be "None". The Annotation field would be "HighlightRange", and AnnotationParams would be [[-0.10, 0.00], []].


Here’s an example of the full JSON:
Suppose that the user input statement was “BMI is more important than age for predicting diabetes progression.” 
In this case, since we are looking at a bivariate comparison between features, this would belong to Category 2.

There are two variables: BMI and Age. Even though it is not specified, it is clear that this statement is referring to these on “average”. We want contributions rather than feature values, so variable type for both of these would be “contribution to the prediction of”.
 
Variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution to the value of",
        },
        {
          featureName: "age",
          transform: "average",
          type: "contribution to the value of",
        },
      ]
Numbers: []
Type: Comparison
Relationship: “greater than”. 
Condition: {}
GraphType: "Bar" - since we are comparing the average values of two different features.
XValues would be "None".
YValues would be "None".
Features would be ["BMI", "Age"]
Annotation would be "None".
AnnotationParams would be "None".


Here is another full example:
Suppose the user input statement was "There is a positive correlation between the contribution of bmi to predictions and the bmi values when the feature value is between 0.05 and 0.10".
The final JSON would look like this:
Category: 3
Variables: [
  {
    featureName: "bmi",
    transform: undefined,
    type: "value of",
  },
  {
    featureName: "bmi",
    transform: undefined,
    type: "contribution to the value of",
  },
]
Numbers: []
Type: "correlation" 
Relationship: "positively"
Condition: {
  featureName: "bmi",
  range: [0.05, 0.10]
}
GraphType: "Scatter",
XValues: "bmi",
YValues: "bmi",
Features: "None",
Annotation: "HighlightRange", 
AnnotationParams: [[0.05, 0.10], []]


One thing that is important to note: Sometimes, constants (numbers) are implicitly present in the statement even if they are not explicitly stated. For example, in the sentence "bmi always contributes positively for predicting diabetes progression", the implied number is 0, since the sentence can be rewritten as "the contribution of bmi is always greater than 0".
In these cases, make sure you include the implied constant in the numbers array.

There might be an implied number that is not 0 or infinity. If it helps, feel free to use the number table below for the average/median SHAP values of each feature: 

age:
  Average SHAP Value: -0.30
  Median SHAP Value: -0.43
sex:
  Average SHAP Value: 0.00
  Median SHAP Value: 0.69
bmi:
  Average SHAP Value: 0.59
  Median SHAP Value: -16.36
blood pressure:
  Average SHAP Value: -0.04
  Median SHAP Value: -2.60
serum cholesterol:
  Average SHAP Value: 0.62
  Median SHAP Value: 0.49
low-density lipoproteins:
  Average SHAP Value: 0.40
  Median SHAP Value: 0.12
high-density lipoproteins:
  Average SHAP Value: 0.32
  Median SHAP Value: 1.36
total/HDL cholesterol ratio:
  Average SHAP Value: -0.26
  Median SHAP Value: -0.82
serum triglycerides level:
  Average SHAP Value: 0.34
  Median SHAP Value: -8.19
blood sugar level:
  Average SHAP Value: -0.17
  Median SHAP Value: -1.27
total average SHAP value (across ALL features): 0.15

For example, if someone was to provide a statement along the lines of "serum triglycerides has a higher than average contribution to the prediction", 
this could get parsed as "the average contribution to the prediction of serum triglycerides level is greater than [average SHAP value for ALL features = 0.15]". 

Similarly, if a sentence is referring to the average/median SHAP value for a particular feature, insert the value from this table.

The final note: If you can't figure out any of these values (you can't fit the sentence the user inputs to any of these statement types meaningfully), then set the "type" field to ERROR.
`;

export const parseInput = async (
  input: string,
  apiKey: string,
  prompt: string
) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: input },
    ],
  });

  let json_string = chatCompletion.choices[0].message.content;
  let finish_reason = chatCompletion.choices[0].finish_reason;
  if (json_string !== null && finish_reason === "stop") {
    try {
      let jsonObject = JSON.parse(json_string);

      if (
        jsonObject.features === "ERROR" ||
        jsonObject.prediction === "ERROR"
      ) {
        console.error("Improper feature/prediction detected");
      } else {
        // console.log("JSON from GPT!!");
        // console.log(jsonObject);
        let variableArray = jsonObject.Variables;
        if (jsonObject.Numbers && jsonObject.Numbers.length > 0) {
          variableArray.push(jsonObject.Numbers[0]);
        }

        return {
          variables: variableArray,
          type: jsonObject.Type,
          relation: jsonObject.Relationship,
          condition: jsonObject.Condition,
          graph: {
            graphType: jsonObject.GraphType,
            xValues: jsonObject.XValues,
            yValues: jsonObject.YValues,
            ...(jsonObject.Features &&
              jsonObject.Features !== "None" && {
                features: jsonObject.Features,
              }),
            ...(jsonObject.Annotation !== "None" && {
              annotation: (() => {
                let annotations: TAnnotation[] = [];
                switch (jsonObject.Annotation) {
                  case "HighlightRange":
                    const xRange = jsonObject.AnnotationParams[0];
                    const yRange = jsonObject.AnnotationParams[1];

                    const range: {
                      type: string;
                      xRange?: number[];
                      yRange?: number[];
                    } = {
                      type: "HighlightRange",
                    };
                    if (xRange && xRange.length > 0) {
                      range.xRange = xRange;
                    }
                    if (yRange && yRange.length > 0) {
                      range.yRange = yRange;
                    }
                    return range;
                  case "SingleLine":
                    const [axis, value] = jsonObject.AnnotationParams;
                    const line: {
                      type: string;
                      xValue?: number;
                      yValue?: number;
                    } = {
                      type: "singleLine",
                    };
                    if (axis === "X" || jsonObject.GraphType == "Bar") {
                      line.xValue = value;
                    } else if (axis === "Y") {
                      line.yValue = value;
                    }
                    return line;
                  case "Highlight Specific Data Points":
                    return {
                      type: "highlightDataPoints",
                      dataPoints: [0, 1, 2, 3, 4, 5, 6],
                    };
                  default:
                    return null; // Return null if there's no valid annotation type
                }
              })(),
            }),
          },
        } as TInsight;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.error("JSON string is null");
  }
};
