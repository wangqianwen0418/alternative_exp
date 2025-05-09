import OpenAI from "openai";
import { TInsight, TAnnotation } from "./types";
import { ResetTvOutlined } from "@mui/icons-material";

export const generatePrompt = (
  feature_names: string[],
  prediction_name: string
) => `
You are a bot that extracts structured content from User Interpretations (“insight”) of graphs related to how a machine learning system treats certain features. You will output a JSON object with specific information. 

First, ensure that all features mentioned in the insight are in this list: ${feature_names.join(
  ", "
)}. If a feature is not in the list, set Variables to ["ERROR"]. Abbreviations (like "BMI" for "Body Mass Index") are fine, but any ouput you provide should match the names in the list exactly.

Next, determine the Category of the insight based on these descriptions: 

    Category 1:
    Read (univariate). Extract values related to the attribution of a feature to the prediction (e.g., average attribution, variations of attribution, number of data points with positive attribution).

    Possible Examples: On average, BMI’s attribution to diabetes progression is 25

    Category 2:
    Comparison (Feature1, Feature2):
    Possible Examples: 
    Feature1 contributes more to the prediction than Feature2
    Feature1 influences more instances positively than Feature2

    Category 3:
    Correlation [DV1] by Feature Value [IV1] 
    Possible Examples:
    There is a positive correlation between the contribution of Feature1 to predictions and the Feature1 values


The first value in the JSON file you provide will be the category that the given insight belongs to (1,2,3). This will determine how we parse the rest of the insight going forward. 

Once the category is determined, the JSON should contain: 
Variables: An array of variables with the format: 
{
  featureName: string,
  transform: "average" | "deviation of" | "" | undefined
  type: "value of" | "attribution" | "number of instances <restriction> for" 
}

Note: For the "number of instances of <restriction> of", there would be a restriction that you should include in the value. for example, you might suggest "number of instances above 5 of" or "number of instances below 3 of". 
For Category 2, you may have "number of instances <condition> for" -- for example, for the input prompt "age has more instances above 3 than s2", type would be "number of instances above 3 for".
Note: if the type is "number of instances", there is no additional transformation (average, etc) that is provided.

If "correlation" (category 3) involves both value and attribution of the same feature, include both in the array. 
For example: "There is correlation between the contribution of bp to predictions and the bp values"
In this case, there are two variables: attribution of BP and BP values. 

Numbers: Any constants in the core part of the insight statement should be included in an array. If none, leave it empty.  It is important to note that this only applies to numbers that are part of the main insight statement - if there are numbers in a condition/restriction (described below), those should not go in this array. 

Type - this will match the category. Options are “read”, “comparison”, or “correlation”) for categories 1-3 respectively.
Relationship: Based on the category
Category 1 (“read”): only one option - "is"
Category 2 (“comparison”): options are “greater than”, “less than”, “equal to”
Category 3 (“correlation”): options are “positively correlated”, “negatively correlated”, or "not correlated"

Condition: refers to restrictions on variable values. Will be represented as a range, with the ability to use infinity.
Example: “BMI is the most important feature in predicting diabetes risk when the value is above 25”
Condition: {
	featureName: “BMI”,
	range: [25, infinity]
}
If no condition, this will be an empty object.

GraphType: This will have four options: "Swarm", "Scatter", "Bar", "Heatmap". 
Here are the situations in which each one is most optimal:
Swarm: for comparisons of distributions, instances, or multiple features. Shows individual data points of multiple features, side-by-side. 
Scatter: for correlations.
Bar: For average values
Heatmap (note: shows how each feature contributes to the output for individual samples):
When you want to see how different features impact the prediction for individual instances 

XValues and YValues: This depends on the GraphType
Scatter: XValues and YValues both indicate what data to display on the graph for this insight. Use the following format: "<FeatureName> <Feature/SHAP (Contribution)> values". For example, your XValues can be "BMI Feature Values" and your YValues can be "BMI SHAP (Contribution) Values" 
Swarm, Bar and Heatmap: Set both to "None".
FeaturesToHighlight: A string array ["Feature 1", "Feature 2",...] of the names of the features to highlight/emphasize in the graph. This should be be populated for Bar, Swarm, and Heatmap Plots - otherwise, the value will be "None". Whenever you provide a feature name, make sure it is provided the same way it was in the feature list above.
FeaturesToShow: A string array ["Feature 1", "Feature 2",...] of the names of all the features provided above, in addition to a few more of your choosing (aim for 3-5 features per graph). This should be populated for Bar, Swarm, and Heatmap plots. All the features in FeaturesToHighlight must also be provided here.


Annotation is the next value in the JSON. Here are the options for Annotation:
type TAnnotation =
  | { type: "highlightDataPoints"; dataPoints: number[]; label?: string } // An array of data points to highlight
  | {
      type: "highlightRange";
      xRange?: [number, number];
      yRange?: [number, number];
      label?: string, feature?: string;
    } // A range along X axis
  | { type: "singleLine"; xValue?: number; yValue?: number; label?: string } // A vertical line at a specific X/Y value

The optimal annotation to use will be based on constants/conditions included in the insight statement.


Lines are more useful when we are comparing against a single value, HighlightRange is more useful when we want to highlight data points within a range (so it will not be used for Bar Graphs), and HighlightDataPoints is useful when examining a condition that does not fit neatly into a range. 
For Heatmaps, there will be no annotations, so if the GraphType is Heatmap then Annotation will be an empty JSON object ({}).
For Barplots, the only annotations that are allowed are vertical lines (so make sure to provide an xValue). 
For Swarms, there can be no range or line in the Y direction, only in the X direction.

For example, suppose the user input statement was "The average contribution of the bmi to the prediction is larger than 20". Since we are looking at the average contribution of each feature, the GraphType value would be "Bar".
Then, XValues and YValues would both be "None". FeaturesToHighlight would be ["bmi"], and FeaturesToShow could be ["bmi", "blood sugar level", "serum triglycerides level"]. Annotation would look like this:
{
	type: "singleLine",
	xValue: 20
}
Here's another example: 

Suppose the user input statement was "bmi has more instances above 5 than sex". Since we are looking at individual data points (and comparing features), the GraphType value would be "Swarm".
In this case, the XValues and YValues field should both be "None". FeaturesToHighlight would be ["bmi", "sex"] and FeaturesToShow could be ["bmi", "sex", "age", low-density lipoproteins"].  Since we want to see the data points that satisfy this criteria, Annotation would be 

{
	type: "highlightRange",
	xRange: [5,infinity]
}

One last example: Suppose the user input statement was "There is a negative correlation between the contribution of age to predictions and the age values when the feature value is between -0.10 and 0.00". 
In this case, since we are looking at correlation, GraphType would be "Scatter". Then the XValues field would be "Age Feature Values" and the YValues field would be "Age SHAP (Contribution) values".  Since it is a scatter plot, Features would be "None". Then annotation would be

{
	type: "highlightRange",
	xRange: [-0.1, 0]
}


Here’s an example of the full JSON:
Suppose that the user input statement was “BMI is more important than age for predicting diabetes progression.” 
In this case, since we are looking at a bivariate comparison between features, this would belong to Category 2.

There are two variables: BMI and Age. Even though it is not specified, it is clear that this statement is referring to these on “average”. We want contributions rather than feature values, so variable type for both of these would be “attribution”.
 
Variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "attribution",
        },
        {
          featureName: "age",
          transform: "average",
          type: "attribution",
        },
      ]
Numbers: []
Type: Comparison
Relationship: “greater than”. 
Condition: {}
GraphType: "Bar" - since we are comparing the average values of two different features.
XValues would be "None".
YValues would be "None".
FeaturesToHighlight would be ["bmi", "age"]
FeaturesToShow would be ["bmi", "age", "sex", "blood sugar level"],
Annotation would be empty: {}

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
    type: "attribution",
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
XValues: "BMI Feature values",
YValues: "BMI SHAP (Contribution) values",
Features: "None",
Annotation: {
	type: "highlightRange",
	xRange: [0.05, 0.1]
}

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
        let variableArray = jsonObject.Variables;
        if (jsonObject.Numbers && jsonObject.Numbers.length > 0) {
          variableArray.push(jsonObject.Numbers[0]);
        }

        return {
          variables: variableArray,
          type: jsonObject.Type,
          relation: jsonObject.Relationship,
          condition: jsonObject.Condition,
          optimalGraph: {
            graphType: jsonObject.GraphType,
            xValues: jsonObject.XValues,
            yValues: jsonObject.YValues,
            ...(jsonObject.FeaturesToHighlight &&
              jsonObject.FeaturesToHighlight !== "None" && {
                featuresToHighlight: jsonObject.FeaturesToHighlight,
              }),
            ...(jsonObject.FeaturesToShow &&
              jsonObject.FeaturesToShow !== "None" && {
                featuresToShow: jsonObject.FeaturesToShow,
              }),
            ...(jsonObject.Annotation !== "None" && {
              annotation: jsonObject.Annotation,
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
