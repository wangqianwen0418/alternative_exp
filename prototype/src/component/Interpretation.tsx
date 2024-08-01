import {
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import "./Interpretation.css";
import { useState, useEffect } from "react";

import OpenAI from "openai";
import shapData from "../assets/shap_diabetes.json";
import { IHypo } from "../App";
import { CASES } from "../const";

var response = "";
var response = "";

const feature_names = shapData.feature_names;

let feature_name_str = feature_names.join(", ");

const prediction_data = shapData.prediction_name;

function getSelection(
  label: string,
  value: string,
  handleChange: (k: string) => void,
  options: string[]
) {
  return (
    <FormControl
      variant="standard"
      sx={{ m: 1, minWidth: 120, display: "block" }}
    >
      {/* <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel> */}
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-stelandard"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        label="Age"
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  return (
    <FormControl
      variant="standard"
      sx={{ m: 1, minWidth: 120, display: "block" }}
    >
      {/* <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel> */}
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-stelandard"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        label="Age"
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function formatText(
  text: string,
  entityType: "feature" | "relation" | "prediction" | "condition"
) {
  if (entityType === "feature") {
    return (
      <span className="label" style={{ backgroundColor: "#6bbcff" }}>
        {text}
      </span>
    );
  } else if (entityType === "relation") {
    return (
      <span className="label" style={{ backgroundColor: "green" }}>
        {text}
      </span>
    );
  } else if (entityType === "prediction") {
    return (
      <span className="label" style={{ backgroundColor: "#ffc760" }}>
        {text}
      </span>
    );
  } else if (entityType === "condition") {
    return (
      <span className="label" style={{ backgroundColor: "#ffc760" }}>
        {text}
      </span>
    );
  }
}

type props = (typeof CASES)[0] & {
  isSubmitted: boolean;
  selectedCase: string;
  setIsSubmitted: (k: boolean) => void;
  hypo: IHypo;
  onHypoChange: (newHypo: IHypo) => void;
};

export default function Interpretation(props: props) {
  
  const {isSubmitted, selectedCase, setIsSubmitted, hypo, onHypoChange} = props;
  const [userInput, setUserInput] = useState("e.g., a high bmi leads to large diabete progression");




  const [selectedRelation, setSelectedRelation] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [apiKey, setApiKey] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [newHypo, setNewHypo] = useState<IHypo>({
    freetext: "null",
    features: ["Feature 1", "Feature 2"],
    relation: "relationship 1",
    prediction: "BMI",
    condition: "none",
    possibleRelations: ["relationship 1", "relationship 2"],
    possibleConditions: ["none", "condition 1", "condition 2"],
  });
  const [curCase, setCurCase] = useState("Case 1");



  useEffect(() => {
    if (window.location.pathname === "/free") {
      setIsFree(true);
      setCurCase("Free Exploration");
    }
    else if (window.location.pathname === "/case2") {
      setCurCase("Case 2");
    }
    else if (window.location.pathname === "/case3") {
      setCurCase("Case 3");
    }
    else{
      setCurCase("Case 1");
    }
  }, []);

  const parseInput = async (input: string) => {
    setIsLoading(true); // Start loading

    const prompt = `You are a bot that extracts the sentence structure from explanation sentences. You produce JSON that contains the following data from an inputted sentence: \:
    Features
    Prediction
    Relationship
    Condition

    The features have to be present in this list: ${feature_name_str}, and the prediction should be ${prediction_data}. 
    
    It's fine if they use abbreviations/the full form of an abbreviation (ie Body Mass Index for BMI and vice versa), but if the user's interpretation describes a feature that is not present in the list, set the feature value to ["ERROR"]. This is very important, do not forget about this!

    For example, if the sentence is: "BMI is the most important factor for predicting diabetes risk when it is above 25", the values you should return is as follows:

    Feature(s): ["BMI"]
    Prediction: diabetes risk
    Relationship: most important factor
    Condition: Above 25

    There may be multiple features, so the value for the "features" key should always be an array. 


    In addition, you should also include the following two fields (as arrays):
    Possible Relationships: 
    Possible Conditions:  
    
    In this example, some possible relationships would include: "has a positive correlation", "has a negative correlation", "2nd most important factor", "most important factor", etc.
    Some possible conditions would include: "Below 25". Note that possible conditions should be included even if there are no conditions in the original statement.
    
    
    If there is no actual condition in the sentence, make sure you still include a couple options for possible conditions, based on reasonable values for the given feature/variable.

    Finally, there is one last thing you need to return: An explanation level. This can best be explained in the following way: 

    Level 1. Univariate Analysis:
    Definition: Read values, ranges, and distribution of a single variable.
    Example: Examining the distribution of SHAP values for BMI.
    Level 2. Bivariate Analysis-Comparison:
    Definition: Compare two variables.
    Example: Comparing the SHAP values of BMI with those of age.
    Level 3. Bivariate Analysis-Correlation:
    Definition: Interpret the correlations between two variables.
    Example: Analyzing the correlation between BMI values and the SHAP values of BMI.
    Level 4. Multivariate Analysis:
    Definition: Investigate the influence of a third variable on the correlation between two other variables.
    Example: Exploring how the correlation between BMI values and BMI SHAP values changes based on gender values. 
    Please return the integer value of the level in the JSON as well.

    This should be formatted in a JSON object, structured like this: 
    Features:
    Prediction:
    Relationship:
    Condition:
    PossibleRelationships:
    PossibleConditions:
    Level: 
    
    If any of the original values (feature, prediction, relationship, condition) are missing in the sentence, the value for that field should be NONE. 


    `;
    const openai = new OpenAI({
      apiKey: apiKey,

      dangerouslyAllowBrowser: true,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 1024,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: input },
      ],
    });
    

    var json_string = chatCompletion.choices[0].message.content;
    var finish_reason = chatCompletion.choices[0].finish_reason;
    if (json_string !== null && finish_reason === "stop") {
      try {
        let jsonObject = JSON.parse(json_string);

        // Extract each element and store it in a variable
        let features = jsonObject.Features;
        let prediction = jsonObject.Prediction;
        let relationship = jsonObject.Relationship;
        let condition = jsonObject.Condition;
        let PossibleRelationships = jsonObject.PossibleRelationships;
        let PossibleConditions = jsonObject.PossibleConditions;
        PossibleRelationships.push(relationship);
        let level = jsonObject.Level;
        if (features === "ERROR" || prediction === "ERROR") {
          console.error("Improper feature/prediction detected");
        } else {
          const updatedHypo = {
            freetext: input,
            features: features,
            relation: relationship,
            prediction: prediction,
            condition: condition,
            possibleRelations: PossibleRelationships,
            possibleConditions: PossibleConditions,
          };

          setNewHypo(updatedHypo);
          onHypoChange(updatedHypo);
          setIsLoading(false);


        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      } finally {
        setIsLoading(false);
        return newHypo;
      }
    } else {
      console.error("JSON string is null");
    }
  };

  const handleSubmission = async () => {
    let updatedHypo: IHypo = newHypo;

    if (curCase === "Case 1") {

      updatedHypo = {
        freetext:
          "BMI is the most important feature for predicting diabetes risk.",
        features: ["BMI"],
        prediction: "diabetes risk",
        relation: "most important feature",
        condition: "none",
        possibleRelations: [
          "most important feature",
          "2nd most important feature",
          "least important feature",
          "has a positive correlation with",
        ],
        possibleConditions: ["when above 25", "when below 25"],
      };



    } else if (curCase === "Case 2") {
      console.log("in case 2");
      updatedHypo = {
        freetext:
          "serum triglycerides level is the most important feature for predicting the progression of diabetes.",
        features: ["serum triglycerides level"],
        prediction: "diabetes progression",
        relation: "most important feature",
        condition: "none",
        possibleRelations: [
          "most important feature",
          "2nd most important feature",
          "least important feature",
          "has a positive correlation with",
        ],
        possibleConditions: ["when above 25", "when below 25"],
      };



    } else if (curCase === "Case 3") {
      console.log("in case 3");
      updatedHypo = {
        freetext: "BMI has a positive correlation with diabetes progression",
        features: ["BMI"],
        prediction: "diabetes progression",
        relation: "positive correlation",
        condition: "none",
        possibleRelations: [
          "most important feature",
          "2nd most important feature",
          "least important feature",
          "has a positive correlation with",
        ],
        possibleConditions: ["when above 25", "when below 25"],
      };


    } else if (curCase === "Free Exploration") {
      const result = await parseInput(userInput);
      if (result){
        updatedHypo = result;
      }
    } else {
      updatedHypo = {
        freetext:
          "BMI is the most important feature for predicting diabetes risk.",
        features: ["BMI"],
        prediction: "diabetes risk",
        relation: "most important feature",
        condition: "none",
        possibleRelations: [
          "most important feature",
          "2nd most important feature",
          "least important feature",
          "has a positive correlation with",
        ],
        possibleConditions: ["when above 25", "when below 25"],
      };
      
    }

    setNewHypo(updatedHypo);
    onHypoChange(updatedHypo);
    setIsSubmitted(!isSubmitted);

  };

  return (
    <Paper style={{ padding: "15px" }}>
      <Typography variant="h5" gutterBottom>
        User Interpretation
      </Typography>
      <TextField
        id="outlined-basic"
        label="e.g., a high bmi leads to large diabete progression"
        value={userInput}
        onChange={(e) => isFree && setUserInput(e.target.value)}
        multiline
        rows={4}
        fullWidth
      />
      {isFree && (
        <TextField
          id="api-key"
          label="Enter your OpenAI API key here"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          rows={1}
          fullWidth
          style={{ marginTop: "15px" }}
        />
      )}

      <div style={{ alignItems: "center" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px 5px" }}
          onClick={() => setIsSubmitted(!isSubmitted)}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px 5px" }}
          onClick={handleSubmission}
        >
          Submit
        </Button>
      </div>
      {isFree && 
      (isLoading ? (
        <CircularProgress></CircularProgress>
      ) : (
        isSubmitted && (
          <Paper className="parse-input" elevation={1}>
            <div className="features-container">
              {newHypo.features.map((feature, index) => (
                <span key={index}>{formatText(feature, "feature")}</span>
              ))}
            </div>

            {getSelection(
              "relation",
              newHypo.relation,
              (k) => setSelectedRelation(k),
              newHypo.possibleRelations
            )}
            {formatText(newHypo.prediction, "prediction")}
            {getSelection(
              "condition",
              newHypo.condition,
              (k) => setSelectedCondition(k),
              newHypo.possibleConditions
            )}
          </Paper>
        )
      ))}
    </Paper>
  );
}
