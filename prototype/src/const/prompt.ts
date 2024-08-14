import OpenAI from "openai";

export const generatePrompt = (
  feature_names: string[],
  prediction_name: string
) => `You are a bot that extracts the content from 'insight' statements. You produce JSON that contains the following data from an inputted sentence: \:
Features (Independent Variable(s))
Feature State (any context about how the feature is used)
Attribution (Dependent Variable)
Relationship 
Constant
Condition

The features have to be present in this list: ${feature_names.join(
  ", "
)}, and the Attribution should be ${prediction_name}. 

It's fine if they use abbreviations/the full form of an abbreviation (ie Body Mass Index for BMI and vice versa), but if the user's interpretation describes a feature that is not present in the list, set the feature value to ["ERROR"]. This is very important, do not forget about this!

For example, if the sentence is: "The average contribution of BMI to diabetes risk is larger than 0.5", the values you should return is as follows:

Features: ["BMI"]
FeatureState: ["Average Contribution"]
Attribution: diabetes risk
Relationship: Greater than
Constant: 0.5
Condition: NONE

There may be multiple features, so the value for the "features" key and Feature State should always be an array (of same length). 


In addition, you should also include the following three fields (as arrays):
Possible Relationships: 
Possible Conditions:  
Possible Constants: 

In this example, some possible relationships would include: "greater than", "Less than", etc. Note that these conditions should apply to the feature state (since we're looking at average contribution in this case, we should not be considering things like overall correlation, but that might be the case in different situations).
Some possible conditions would include: "when the BMI is above 25". Note that possible conditions should be included even if there are no conditions in the original statement.


If there is no actual condition in the sentence, make sure you still include a couple options for possible conditions, based on reasonable values for the given feature/variable.

Finally, there is one last thing you need to return: One of four categories that an insight can fall into. This can best be explained in the following way: 

Category 1:
Attribution (DV) by Feature (IV), univariate. 
Possible Examples: The <feature> values contribute at least <constant> to the <attribution>, The average contribution of F_i to the prediction is larger than <constant>

Category 2:
Bivariate comparison (Feature1, Feature2):
Possible Examples: 
Feature1 contributes [more] to the prediction than Feature2
Feature1 influences a [greater] number of instances than Feature2

Category 3:
Attribution [DV1] by Feature Value [IV1] 
Possible Examples:
There is a [positive] correlation between the contribution of Feature1 to predictions and the Feature1 values [when values are above 15]

Category 4:
Multivariate Attribution by Feature Values
Possible Examples:
The correlation between the Feature1Values and Feature1 is [stronger/weaker] when Feature2 is in [range A] compared to [range B].



Please return the integer value of the Category in the JSON as well.

This should be formatted in a JSON object, structured like this: 

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
        return jsonObject;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  } else {
    console.error("JSON string is null");
    return null;
  }
};
