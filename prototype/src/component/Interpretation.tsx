import {
    Button,
    Paper,
    TextField,
    Typography,
    FormControl,
    Select,
    MenuItem,
    CircularProgress,
    Modal, Box
} from "@mui/material";
import React from "react";

import "./Interpretation.css";
import { useState, useEffect } from "react";

import OpenAI from "openai";
import shapData from "../assets/shap_diabetes.json";
import { IHypo } from "../App";
import { CASES } from "../const";


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

type props = (typeof CASES)[0] & {
    isSubmitted: boolean;
    setIsSubmitted: (k: boolean) => void;
    hypo: IHypo;
    onHypoChange: (newHypo: IHypo) => void;
};

export default function Interpretation(props: props) {
    const { isSubmitted, name: caseName, setIsSubmitted, hypo, onHypoChange } =
        props;
    const [userInput, setUserInput] = useState(
        "e.g., a high bmi leads to large diabete progression"
    );

    const [selectedRelation, setSelectedRelation] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [modalVisible, setModalVisible] = useState(caseName.includes('Free'));
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [apiKey, setApiKey] = useState("");
    const [newHypo, setNewHypo] = useState<IHypo>({
        freetext: "null",
        features: ["Feature 1", "Feature 2"],
        featureState: ["none", "none"],
        attribution: "diabetes",
        relation: "relationship 1",
        prediction: "Diabetes",
        condition: "none",
        constant: "0.0",
        possibleRelations: ["relationship 1", "relationship 2"],
        possibleConditions: ["none", "condition 1", "condition 2"],
        category: 1,
    });

    const parseInput = async (input: string) => {
        setIsLoading(true); // Start loading

        const prompt = `You are a bot that extracts the content from 'insight' statements. You produce JSON that contains the following data from an inputted sentence: \:
    Features (Independent Variable(s))
    Feature State (any context about how the feature is used)
    Attribution (Dependent Variable)
    Relationship 
    Constant
    Condition

    The features have to be present in this list: ${shapData.feature_names.join(", ")}, and the Attribution should be ${shapData.prediction_name}. 
    
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
    Features:
    FeatureState: 
    Attribution:
    Relationship:
    Constant: 
    Condition:
    PossibleRelationships:
    PossibleConditions:
    Category: 
   


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

        let json_string = chatCompletion.choices[0].message.content;
        let finish_reason = chatCompletion.choices[0].finish_reason;
        if (json_string !== null && finish_reason === "stop") {
            try {
                let jsonObject = JSON.parse(json_string);

                // Extract each element and store it in a variable
                let features = jsonObject.Features;
                let featureState = jsonObject.FeatureState;
                let attribution = jsonObject.attribution;
                let prediction = jsonObject.Attribution;
                let relationship = jsonObject.Relationship;
                let constant = jsonObject.Constant;
                let condition = jsonObject.Condition;
                let PossibleRelationships = jsonObject.PossibleRelationships;
                let PossibleConditions = jsonObject.PossibleConditions;
                let category = jsonObject.Category;
                PossibleRelationships.push(relationship);
                if (features === "ERROR" || prediction === "ERROR") {
                    console.error("Improper feature/prediction detected");
                } else {
                    console.log("FULL JSON FOR INSIGHTS: ");
                    console.log(jsonObject);
                    const updatedHypo = {
                        freetext: input,
                        features: features,
                        featureState: featureState,
                        attribution: attribution,
                        relation: relationship,
                        prediction: prediction,
                        condition: condition,
                        constant: constant,
                        possibleRelations: PossibleRelationships,
                        possibleConditions: PossibleConditions,
                        category: category,
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

        if (caseName === "Case 1") {
            updatedHypo = {
                freetext:
                    "The average contribution of BMI to diabetes risk is larger than 0.5",
                features: ["BMI"],
                featureState: ["average contribution"],
                attribution: "diabetes risk",
                prediction: "diabetes risk",
                relation: "larger than",
                condition: "none",
                constant: "0.5",
                possibleRelations: [
                    "most important feature",
                    "2nd most important feature",
                    "least important feature",
                    "has a positive correlation with",
                ],
                possibleConditions: ["when above 25", "when below 25"],
                category: 1,
            };
        } else if (caseName === "Case 2") {
            console.log("in case 2");
            updatedHypo = {
                freetext:
                    "serum triglycerides level is more important than BMI for predicting the progression of diabetes.",
                features: ["serum triglycerides level", "BMI"],
                featureState: ["none", "none"],
                prediction: "diabetes progression",
                attribution: "diabetes progression",
                relation: "most important feature",
                condition: "none",
                constant: "none",
                possibleRelations: ["more important than", "less important than"],
                possibleConditions: ["when BMI is n 25", "when below 25"],
                category: 2,
            };
        } else if (caseName === "Case 3") {
            console.log("in case 3");
            updatedHypo = {
                freetext: "BMI has a positive correlation with diabetes progression",
                features: ["BMI"],
                featureState: ["none"],
                prediction: "diabetes progression",
                attribution: "diabetes progression",
                relation: "positive correlation",
                condition: "none",
                constant: "none",
                possibleRelations: [
                    "positive correlation",
                    "negative correlation",
                    "no correlation",
                ],
                possibleConditions: ["when above 25", "when below 25"],
                category: 3,
            };
        } else if (caseName === "Free Exploration") {
            const result = await parseInput(userInput);
            if (result) {
                updatedHypo = result;
                console.log("FREE HYPO SET!");
            }
        } else {
            updatedHypo = {
                freetext:
                    "The average contribution of BMI to diabetes risk is larger than 0.5",
                features: ["BMI"],
                featureState: ["average contribution"],
                attribution: "diabetes risk",
                prediction: "diabetes risk",
                relation: "larger than",
                condition: "none",
                constant: "0.5",
                possibleRelations: [
                    "most important feature",
                    "2nd most important feature",
                    "least important feature",
                    "has a positive correlation with",
                ],
                possibleConditions: ["when above 25", "when below 25"],
                category: 1,
            };
        }

        setNewHypo(updatedHypo);
        onHypoChange(updatedHypo);
        setIsSubmitted(!isSubmitted);
    };

    type ColorKeys = 'feature' | 'prediction' | 'relation';

    const colors: Record<ColorKeys, string> = {
        "feature": "#6bbcff", // Blue
        "prediction": "#ffff6b", // Yellow
        "relation": "#6bffaf" // Green
    };

    // Function to wrap a text segment with a span and style it
    const wrapText = (text: string, color: string) => (
        <span className="label" style={{ backgroundColor: color }}>
            {text}
        </span>
    );

    const parts: (string | React.ReactNode)[] = []

    const pushNonHighlightedText = (text: string) => {
        if (text) parts.push(text);
    };

    let remainingText = newHypo.freetext;

    const processString = (subString: string, key: ColorKeys) => {
        const index = remainingText.indexOf(subString);
        if (index != -1) {
            pushNonHighlightedText(remainingText.slice(0, index));
            parts.push(wrapText(subString, colors[key]));
            remainingText = remainingText.slice(index + subString.length);
        }
    };

    newHypo.features.forEach((feature) => processString(feature, 'feature'));
    processString(newHypo.prediction, 'prediction');
    processString(newHypo.relation, 'relation');
    pushNonHighlightedText(remainingText);





    return (
        <>
            <Paper style={{ padding: "15px" }}>
                <Typography variant="h5" gutterBottom>
                    User Interpretation
                </Typography>
                <TextField
                    id="outlined-basic"
                    label="e.g., a high bmi leads to large diabete progression"
                    value={userInput}
                    onChange={(e) => caseName.includes('Free') && setUserInput(e.target.value)}
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
                {caseName.includes('Free') &&
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
                <div>
                    {parts}
                </div>
            </Paper>
            <Modal open={modalVisible} onClose={() => { }}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <TextField
                        id="api-key"
                        label="Enter your OpenAI API key here"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        rows={1}
                        fullWidth
                        style={{ marginTop: "15px" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: "10px 5px" }}
                        onClick={() => setModalVisible(false)}>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
