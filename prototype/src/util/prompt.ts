import OpenAI from "openai";
import { TInsight } from "./types";

export const generatePrompt = (
  feature_names: string[],
  prediction_name: string
) => `You are a bot that extracts the content from User Interpretations (“insight” ) of Graphs and formats them in a structured way. The graphs in question are centered around the way that a machine learning system treats certain features/variables.  You will return a JSON object containing specific information from the structured sentence. 

You are a bot that extracts the content from User Interpretations (“insight” ) of Graphs and formats them in a structured way. The graphs in question are centered around the way that a machine learning system treats certain features/variables.  You will return a JSON object containing specific information from the structured sentence. 

Before you start, you need to make sure that any features/variables that are present are in this list: ${feature_names.join(", ")}. 
It's fine if they use abbreviations/the full form of an abbreviation (ie Body Mass Index for BMI and vice versa), but if the user's interpretation describes a feature that is not present in the list, set the Variables value to ["ERROR"]. This is very important, do not forget about this!

Assuming that all works out, the first thing I need you to determine is the Category that a particular “insight” belongs to. 

Here’s some information about the categories: 
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


The remaining details we care about are as follows:
Variables
Variable Types (“value” or “contribution”)
Variable Transformations ("average" or "")
In the case of "correlation" (category 3), there might be two different variables with the same Feature Name. 
For example: "There is correlation between the contribution of bp to predictions and the bp values"
In this case, there are two variables: contribution of BP and BP values. 
So the variables array should have length 2.

Numbers: If there are any constants in the core part of the insight statement, they go here (in an array). If not, this will be an empty array. This array will *usually* have length 1, but not necessarily.
It is important to note that this only applies to numbers that are part of the main insight statement - if there are numbers in a condition/restriction (described below), those should not go in this array. 
Type (options are “read”, “comparison”, “correlation”, or “featureInteraction”) - note that these are the same as the four categories. So if category 1, type=”read”, if category 2, type=”comparison” and so on
Relationship (this depends on the category). Here are the options for each category:
Category 1 (“read”): options are “greater than”, “less than”, “equal to”
Category 2 (“comparison”): options are “greater”, “less”, “equal”
Category 3 (“correlation”): options are “positively” or “negatively”
Category 4 (“featureInteraction”): options are “same” or “different”
The last value in the JSON will be Condition. 
Condition refers to a restriction on a range for a given variable. For example, in the statement “BMI is the most important feature in predicting diabetes risk when the value is above 25”, the variable being restricted is BMI and the range of the restriction is 25 to infinity. 
In the JSON, this should be represented as follows: a nested JSON object that contains a featureName (string) and ‘range’ (array of two numbers). In this example, the Condition value would look like this:
Condition: {
	featureName: “BMI”,
	range: [25, infinity]
}
In the case of Category 4, there will be TWO ranges included in the condition, formatted as an array. 
Here's an example: Suppose we have the following statement
"The correlation between bmi and its feature values is stronger when the feature value for age is in the range 0.05 to 0.1 compared to -0.01 to 0"

Then condition would look like this:
Condition: {
  featureName: "age",
  range: [[0.05, 0.1], [-0.01, 0]]
}

If there is no condition, just include an empty JSON object: {}


Here’s an example of the full JSON:
Suppose that the user input statement was “BMI is more important than age for predicting diabetes progression.” 

In this case, there are two variables: BMI and Age. Even though it is not specified, it is clear that this statement is referring to these on “average” (since we are not looking at specific values). Furthermore, we are looking at the contribution of BMI and age to diabetes progression (as opposed to the feature values themselves), so the variable type for both of these would be “contribution”. So the Variables array (which will be in the JSON) will look like this: 
variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution",
        },
        {
          featureName: "age",
          transform: "average",
          type: "contribution",
        },
      ]
Numbers, in this case, would be an empty array: []
The relationship in this case is a comparison of two variables (category 2), so the type value will be “comparison” while the relation value will be “greater”. 
Condition would also be empty: {}


So your final JSON should have the following structure:
Category: (In this case, value would be 2)
Variables: (in this case, value would be the array displayed above)
Type (in this case, value would be “comparison”)
Relationship: (In this case, value would be “greater”)
Condition: {}

One thing that is important to note: Sometimes, constants (numbers) are implicitly present in the statement even if they are not explicitly stated. For example, in the sentence "bmi always contributes positively for predicting diabetes progression", the implied number is 0, since the sentence can be rewritten as "the contribution of bmi is always greater than 0".
In these cases, make sure you include the implied constant in the numbers array.   
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
        console.log("JSON!!");
        console.log(jsonObject);
        let variableArray = jsonObject.Variables;
        if (jsonObject.Numbers && jsonObject.Numbers.length > 0){
          variableArray.push(jsonObject.Numbers[0]);

        }
        return {
          variables: variableArray,
          type: jsonObject.Type,
          relation: jsonObject.Relationship,
          condition: jsonObject.Condition
        } as TInsight;
         

      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      
    }
  } else {
    console.error("JSON string is null");
    
  }
};
