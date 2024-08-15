import React from "react";
import { Button, Typography, Paper, RadioGroup, Radio } from "@mui/material";
import { QuestionList } from "../util/questionList";
import Selection from "./WebUtil/Selection";
import { on } from "events";

type props = {
  questionIndex: number;
  setQuestionIndex: (k: number) => void;
};

const confidenceOptions = [
  "please select",
  "0 not confidence at all",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6 very confident",
];
export default function UserResponse(props: props) {
  const { questionIndex, setQuestionIndex } = props;

  const [userAnswer, setUserAnswer] = React.useState<
    "yes" | "no" | undefined
  >();
  const [confidence, setConfidence] = React.useState<string>(
    confidenceOptions[0]
  );

  const onSubmit = () => {
    // recording(userAnswer, confidence) commit the results to the database
    setUserAnswer(undefined);
    setConfidence(confidenceOptions[0]);
    setQuestionIndex(questionIndex + 1);
  };
  return (
    <Paper style={{ padding: "15px 20px", marginTop: "10px" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
        Please Respond Here
      </Typography>
      <span>
        <b>Q1:</b>Is the above interpretation accurate?
      </span>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <Radio
          checked={userAnswer == "yes"}
          onChange={() => setUserAnswer("yes")}
        />{" "}
        <span style={{ margin: "auto 0" }}>Yes, accurate</span>
        <Radio
          checked={userAnswer == "no"}
          onChange={() => setUserAnswer("no")}
        />{" "}
        <span style={{ margin: "auto 0" }}>No, inaccurate </span>
      </RadioGroup>

      <div style={{ display: "flex" }}>
        <span style={{ margin: "auto 0" }}>
          <b>Q2:</b>Please rate your confidence{" "}
        </span>
        <Selection
          label=""
          value={confidence}
          handleChange={setConfidence}
          options={confidenceOptions}
        />
      </div>
      <br />
      <Button
        variant="contained"
        disabled={userAnswer == undefined || confidence == confidenceOptions[0]}
        onClick={() => onSubmit()}
      >
        {" "}
        {questionIndex < QuestionList.length - 1 ? "Next" : "Submit"}{" "}
      </Button>
    </Paper>
  );
}
