import {
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./Interpretation.css";
import { useState } from "react";

import shapData from "../assets/shap_diabetes.json";

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
        id="demo-simple-select-standard"
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
  entityType: "feature" | "relation" | "prediction"
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
  }
}

interface props {
  isSubmitted: boolean;
  setIsSubmitted: (k: boolean) => void;
}

export default function Interpretation({ isSubmitted, setIsSubmitted }: props) {
  const [userInput, setUserInput] = useState("");

  const higlightInput = (k: string) => {
    // return reacejs element with highlighted text
    for (let i = 0; i < shapData.feature_names.length; i++) {
      k = k.replace(
        new RegExp(shapData.feature_names[i], "g"),
        `<span class="highlight">${shapData.feature_names[i]}</span>`
      );
    }
    k = k.replace(
      new RegExp(shapData.prediction_name, "g"),
      `<span class="highlight">${shapData.prediction_name}</span>`
    );
    return k;
  };

  return (
    <Paper style={{ padding: "15px" }}>
      <Typography variant="h5" gutterBottom>
        User Interpretation
      </Typography>
      <TextField
        id="outlined-basic"
        label="Enter your interpretation"
        defaultValue="a patien with a high bmi is more likely to large diabete progression"
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
          onClick={() => setIsSubmitted(!isSubmitted)}
        >
          Submit
        </Button>
      </div>
      {isSubmitted && (
        <Paper className="parse-input" elevation={1}>
          {formatText("Diabete Progression", "prediction")}
          {getSelection(
            "relation",
            "increase with the increase of",
            (k) => {},
            [
              "increase with the increase of",
              "decrease with the increase of",
              "increase with the decrease of",
              "decrease with the decrease of",
            ]
          )}
          {formatText("bmi", "feature")}
          {getSelection("condition", "when bmi >25", (k) => {}, [
            "when bmi >25",
            "when bmi <25",
          ])}
        </Paper>
      )}
    </Paper>
  );
}
