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

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [apiKey, setApiKey] = useState<string>("");

  // 1. Use useEffect to check if an API key is already stored in localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    console.log("Stored API key: " + storedApiKey);

    if (pageName?.includes("Free") && !storedApiKey) {
      setModalVisible(true);
    }

    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [pageName]);

  const handleApiKeySubmit = () => {
    localStorage.setItem("apiKey", apiKey);
    setModalVisible(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem("apiKey");
    setApiKey("");
    setModalVisible(true);
  };

  const isUserStudy = pageName?.includes("question");
  console.log("USER STUDY: " + isUserStudy);

  const handleSubmission = async () => {
    if (!freeText.trim()) return;
    setIsLoading(true);

    if (insight === undefined) {
      const prompt = generatePrompt(
        shapData.feature_names,
        shapData.prediction_name
      );
      try {
        const parsedInput: TInsight = await parseInput(
          freeText,
          apiKey,
          prompt
        );
        setInsight(parsedInput);
        console.log("PARSED INPUT: ");
        console.log(parsedInput);
      } catch (error) {
        console.error("Error parsing input: ", error);
      }
    }
    setIsLoading(false);
    setIsSubmitted(true);
  };

  // Handle the new "Parse" button click (parse only without submission state change)
  const handleParseOnly = async () => {
    if (!freeText.trim()) return;
    setIsLoading(true);

    const prompt = generatePrompt(
      shapData.feature_names,
      shapData.prediction_name
    );
    try {
      const parsedInput: TInsight = await parseInput(freeText, apiKey, prompt);
      setInsight(parsedInput); // Update insight to reflect the newly parsed input
      console.log("PARSED INPUT: ");
      console.log(parsedInput);
    } catch (error) {
      console.error("Error parsing input: ", error);
    }
    setIsLoading(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeText(e.target.value);
    setIsSubmitted(false);
  };

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
                border: "1px solid",
                borderRadius: "8px",
                padding: "4px",
                width: "24px",
                height: "24px",
                ml: 1,
              }}
            >
              <Settings sx={{ fontSize: 12 }} />
            </IconButton>
          )}
        </Box>
        {isUserStudy ? (
          <TextField
            id="outlined-basic"
            value={freeText}
            onChange={handleTextChange}
            multiline
            minRows={1}
            maxRows={10}
            fullWidth
            disabled={isUserStudy}
            sx={{
              "& .Mui-disabled": {
                WebkitTextFillColor: "black !important",
              },
            }}
          />
        ) : (
          <TextField
            id="outlined-basic"
            label="e.g., a high bmi leads to large diabetes progression"
            value={freeText}
            onChange={handleTextChange}
            multiline
            minRows={1}
            maxRows={10}
            fullWidth
          />
        )}

        <div style={{ alignItems: "center" }}>
          {/* Conditionally render the button if the user is NOT in the user study */}
          {!isUserStudy && (
            <Button
              variant="outlined"
              disabled={isSubmitted}
              color="primary"
              style={{ margin: "10px 5px" }}
              onClick={handleSubmission}
            >
              Check with Additional Visualization
            </Button>
          )}

          {/* New Parse Button
          {!isUserStudy && (
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: "10px 5px" }}
              onClick={handleParseOnly}
            >
              Parse
            </Button>
          )} */}
        </div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          (isSubmitted || insight) &&
          !isUserStudy && (
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
//test check
