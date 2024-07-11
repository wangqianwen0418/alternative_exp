import {
    Button,
    Paper,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from "@mui/material";
import "./Interpretation.css";
import { useState } from "react";
import openai from '../openai_config.js';
import shapData from "../assets/shap_diabetes.json";
import { IHypo } from "../App";
import { CASES } from '../const';



var response = ""

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

type props = typeof CASES[0] & {
    isSubmitted: boolean;
    setIsSubmitted: (k: boolean) => void;
    hypo: IHypo;
    onHypoChange: (newHypo: IHypo) => void;
}

export default function Interpretation({ isSubmitted, setIsSubmitted, hypo, onHypoChange }: props) {
    const [userInput, setUserInput] = useState("");
    const [parsedData, setParsedData] = useState({
        feature: "aa",
        relation: "aa",
        prediction: "aa",
        condition: "aa",
        PossibleRelationships: ["aa", "bb"],
        PossibleConditions: ["cc", "dd"]
    });

    const [selectedRelation, setSelectedRelation] = useState(parsedData.relation);
    const [selectedCondition, setSelectedCondition] = useState(parsedData.condition);
    const [isLoading, setIsLoading] = useState(false);  // New loading state
    let newHypo: IHypo = {
        freetext: "null",
        features: ["none"],
        relation: "none",
        prediction: 'none',
        condition: 'none',
        possibleRelations: ['none'],
        possibleConditions: ['none']
    };

    const parseInput = async (input: string) => {


        setIsLoading(true);  // Start loading


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


    This should be formatted in a JSON object, structured like this: 
    Features:
    Prediction:
    Relationship:
    Condition:
    PossibleRelationships:
    PossibleConditions:
    
    If any of these values are missing in the sentence, the value for that field should be NONE. 
    `

        const chatCompletion = await openai.chat.completions.create({


            model: "gpt-4o",
            response_format: { "type": "json_object" },
            max_tokens: 1024,
            messages: [
                { "role": "system", "content": prompt },
                { "role": "user", "content": input }
            ]

        });
        console.log(`RESPONSE: '${chatCompletion.choices[0].message.content}'`);

        // [TODO: @aninuth call setHypo here to update the hypo based the gpt response]
         
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
                PossibleRelationships.push(relationship)

                if (features === "ERROR" || prediction === "ERROR") {
                    console.error("Improper feature/prediction detected");
                }
                else {
                    // Log the variables to check the values
                    newHypo = {
                        freetext: input,
                        features: features,
                        relation: relationship,
                        prediction: prediction,
                        condition: condition,
                        possibleRelations: PossibleRelationships,
                        possibleConditions: PossibleConditions                        
                    }
                    
                    console.log("NEW HYPO VALS");
                    console.log("Features:", newHypo.features);
                    console.log("Prediction:", newHypo.prediction);
                    console.log("Relationship:", newHypo.relation);
                    console.log("Condition:", newHypo.condition);
                    console.log("Possible Relationships: ", newHypo.possibleRelations);
                    console.log("Possible Conditions: ", newHypo.possibleConditions);
                    
                    onHypoChange(newHypo);
                    setIsLoading(false);
                    
                    // setParsedData({
                    //     features,
                    //     prediction,
                    //     relation: relationship,
                    //     condition,
                    //     PossibleRelationships,
                    //     PossibleConditions
                    // });
                }

            } catch (error) {
                console.error("Error parsing JSON:", error);

            }
            finally {
                setIsLoading(false);
                console.log('finally!!');
                console.log(newHypo.freetext);
            }
        } else {
            console.error("JSON string is null");
        }
    };

    const handleSubmission = async () => {
        await parseInput(userInput);
        console.log("submission done, newHypo: ");
        console.log(newHypo.freetext);
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
                onChange={(e) => setUserInput(e.target.value)}
                multiline
                rows={4}
                fullWidth
            />
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
            {isLoading ? (
                <CircularProgress></CircularProgress>
            ) : (
                // [TODO: @aninuth update based on the hypo state]
                isSubmitted && (
                    <Paper className="parse-input" elevation={1}>
                        {formatText(newHypo.features[0], "feature")}
                        {getSelection(
                            "relation",
                            newHypo.relation,
                            (k) => setSelectedRelation(k),
                            newHypo.possibleRelations
                        )}
                        {formatText(newHypo.prediction, "prediction")}
                        {getSelection("condition", newHypo.condition, (k) => setSelectedCondition(k), newHypo.possibleConditions)}
                    </Paper>
                )
            )}
        </Paper>
    );
}
