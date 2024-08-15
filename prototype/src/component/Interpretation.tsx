import {
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";
import React from "react";

import "./Interpretation.css";
import { useState } from "react";

import shapData from "../assets/shap_diabetes.json";
import { TInsight, TCase } from "../util/types";
import { GenerateTextTemplates } from "../util/parseTemplate";
import { generatePrompt, parseInput } from "../util/prompt";

type props = {
  name: string;
  isSubmitted: boolean;
  setIsSubmitted: (k: boolean) => void;
  userText: string;
  setUserText: (k: string) => void;
  insight: TInsight;
  setInsight: (k: TInsight) => void;
};

export default function Interpretation(props: props) {
  const {
    isSubmitted,
    name: caseName,
    setIsSubmitted,
    insight,
    setInsight,
    userText,
    setUserText,
  } = props;

  const [modalVisible, setModalVisible] = useState(caseName.includes("Free"));
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [apiKey, setApiKey] = useState("");

  const handleSubmission = async () => {
    if (insight == undefined) {
      setIsLoading(true); // Start loading
      const prompt = generatePrompt(
        shapData.feature_names,
        shapData.prediction_name
      );
      const parsedInput = await parseInput(userText, apiKey, prompt);
      setInsight(parsedInput);
      setIsLoading(false); // Stop loading
    }
    setIsSubmitted(true);
  };

  return (
    <>
      <Paper style={{ padding: "15px" }}>
        <Typography variant="h5" gutterBottom>
          User Interpretation
        </Typography>
        <TextField
          id="outlined-basic"
          label="e.g., a high bmi leads to large diabete progression"
          value={userText}
          onChange={(e) =>
            caseName.includes("Free") && setUserText(e.target.value)
          }
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
          isSubmitted && (
            <Paper className="parse-input" elevation={1}>
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
            onClick={() => setModalVisible(false)}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
