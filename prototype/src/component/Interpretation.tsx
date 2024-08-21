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
import Form from "./Form";
import { TInsight, TCase } from "../util/types";
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
  const [modalVisible, setModalVisible] = useState<boolean>(
    pageName ? pageName.includes("Free") : true
  );
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [apiKey, setApiKey] = useState("");

  const handleSubmission = async () => {
    if (insight == undefined) {
      setIsLoading(true); // Start loading
      const prompt = generatePrompt(
        shapData.feature_names,
        shapData.prediction_name
      );
      const parsedInput: TInsight = await parseInput(freeText, apiKey, prompt);
      setInsight(parsedInput);
      setIsLoading(false); // Stop loading
    }
    setIsSubmitted(true);
  };

  return (
    <>
      <Paper style={{ padding: "15px" }}>
        <Typography variant="h5" gutterBottom>
          Interpretation
        </Typography>
        <TextField
          id="outlined-basic"
          label="e.g., a high bmi leads to large diabete progression"
          value={freeText}
          onChange={(e) =>
            pageName.includes("Free") && setFreeText(e.target.value)
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
            disabled={isSubmitted}
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
      <Paper style={{ padding: "15px", marginTop: "10px" }}>
        <Form />
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
