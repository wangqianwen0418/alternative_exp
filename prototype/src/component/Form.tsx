import React, { useState, useEffect } from "react";
import { Button, Slider, TextField, Typography } from "@mui/material";
import { weburl } from "../util/appscript_url";

const prompts = [
  "Example Prompt 1",
  "Example Prompt 2",
  "Example Prompt 3",
  "Example Prompt 4",
  "Example Prompt 5",
  "Example Prompt 6",
  "Example Prompt 7",
  "Example Prompt 8",
  "Example Prompt 9",
  "Example Prompt 10",
];

const UserInsight = () => {
  const [confidence, setConfidence] = useState<number>(5);
  const [insight, setInsight] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  }, []);

  const handleConfidenceChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setConfidence(newValue as number);
  };

  const handleInsightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInsight(event.target.value);
  };

  const handleSubmit = async () => {
    const data = {
      timestamp: new Date().toISOString(),
      prompt,
      confidence,
      insight,
    };
    try {
      console.log("Submitting form:", JSON.stringify(data));
      const response = await fetch(weburl!, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setInsight("");
      setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Prompt:
      </Typography>
      <Typography variant="body1" gutterBottom>
        {prompt}
      </Typography>
      <Typography gutterBottom sx={{ mt: 5 }}>
        Confidence Score:
      </Typography>
      <Slider
        value={confidence}
        onChange={handleConfidenceChange}
        aria-labelledby="confidence-slider"
        valueLabelDisplay="auto"
        min={1}
        max={10}
        marks
      />
      <TextField
        label="Your Insight"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        margin="normal"
        value={insight}
        onChange={handleInsightChange}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  );
};

export default UserInsight;
