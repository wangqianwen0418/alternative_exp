import {
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import React from "react";
import { Settings } from "@mui/icons-material";

import "./Interpretation.css";
import { useState, useEffect } from "react";

import shapData from "../assets/shap_diabetes.json";
import { TInsight } from "../util/types";
import { GenerateTextTemplates } from "../util/parseTemplate";
import { generatePrompt, parseInput } from "../util/prompt";
import { useAtom } from "jotai";
import {
  freeTextAtom,
  insightAtom,
  isSubmittedAtom,
  pageNameAtom,
} from "../store";

export default function Interpretation() {
  const [isSubmitted, setIsSubmitted] = useAtom(isSubmittedAtom);
  const [freeText, setFreeText] = useAtom(freeTextAtom);
  const [insight, setInsight] = useAtom(insightAtom);
  const [pageName] = useAtom(pageNameAtom);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [apiKey, setApiKey] = useState<string>("");

  // 1. Use useEffect to check if an API key is already stored in localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    console.log("Stored API key: " + storedApiKey);
    // 2. Check both conditions: pageName includes "Free" AND apiKey is not found
    if (pageName?.includes("Free") && !storedApiKey) {
      // Set modalVisible to true only if we are on the "Free" page and no API key is stored
      setModalVisible(true);
    }

    // If there is an API key, set it in the state so that it's ready for use
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [pageName]); // Dependency on pageName ensures this runs when pageName changes

  const handleApiKeySubmit = () => {
    // Store the API key in localStorage when submitted
    localStorage.setItem("apiKey", apiKey);
    setModalVisible(false); // Close the modal after submission
  };

  const clearApiKey = () => {
    localStorage.removeItem("apiKey");
    setApiKey(""); // Clear the state as well
    setModalVisible(true); // Reopen the modal to ask for the key again
  };

  const handleSubmission = async () => {

    if(!freeText.trim()) return;
    setIsLoading(true);

    if (insight == undefined) {
      const prompt = generatePrompt(
        shapData.feature_names,
        shapData.prediction_name
      );
      try {
        const parsedInput: TInsight = await parseInput(freeText, apiKey, prompt);
        console.log(parsedInput);
        setInsight(parsedInput);
      } catch(error){
        console.error("Error parsing input: ", error);
      }
    }
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeText(e.target.value);
    setIsSubmitted(false);
  }

  return (
    <>
      <Paper style={{ padding: "15px" }}>
        <Box display="flex" alignItems="baseline">
          <Typography variant="h5" gutterBottom>
            Interpretation
          </Typography>
          {pageName?.includes("Free") && (
            <IconButton
              onClick={clearApiKey}
              aria-label="settings"
              sx={{
                color: "#aaaaaaa",
                border: "1px solid", // Add a border around the icon
                borderRadius: "8px", // Rounded square shape (8px gives a subtle curve)
                padding: "4px", // Control padding inside the button
                width: "24x", // Set fixed width for the button
                height: "24px", // Set fixed height for the button
                ml: 1,
              }}
            >
              <Settings sx={{ fontSize: 12 }} />{" "}
              {/* Reduced font size for the icon */}
            </IconButton>
          )}
        </Box>
        <TextField
          id="outlined-basic"
          label="e.g., a high bmi leads to large diabete progression"
          value={freeText}
          onChange={(e) =>
            pageName?.includes("Free") && setFreeText(e.target.value)
          }
          multiline
          rows={2}
          fullWidth
        />

        <div style={{ alignItems: "center" }}>
          {/* <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px 5px" }}
          onClick={() => setIsSubmitted(!isSubmitted)}
        >
          Clear
        </Button> */}
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: "10px 5px" }}
            onClick={handleSubmission}
          >
            Check with Additional Visualization
          </Button>
        </div>
        {isLoading ? (
          <CircularProgress></CircularProgress>
        ) : (
          isSubmitted && (
            <Paper className="parse-input" elevation={0}>
              <b>Formatted: </b>
              {GenerateTextTemplates(insight)}
            </Paper>
          )
        )}
      </Paper>
      <Modal open={modalVisible} onClose={() => {}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
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
            onClick={handleApiKeySubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
