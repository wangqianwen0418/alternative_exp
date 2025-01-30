import React from "react";
import {
  Button,
  Typography,
  Paper,
  RadioGroup,
  Radio,
  Modal,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { QuestionList } from "../util/questionList";
import { useAtom } from "jotai";
import {
  questionIndexAtom,
  insightAtom,
  freeTextAtom,
  initVisAtom,
  secondVisAtom,
  pageNameAtom,
  isSubmittedAtom,
  uuidAtom,
  questionOrderAtom,
} from "../store";
import Selection from "./webUtil/Selection";
import { test_weburl } from "../util/appscript_url";

const confidenceOptions = [
  "please select",
  "1 not confident at all",
  "2",
  "3",
  "4",
  "5",
  "6 very confident",
];

export default function UserResponse() {
  const [questionIndex, setQuestionIndex] = useAtom(questionIndexAtom);
  const [, setInsight] = useAtom(insightAtom);
  const [freeText, setFreetext] = useAtom(freeTextAtom);
  const [initVis, setInitVis] = useAtom(initVisAtom);
  const [, setSecondVis] = useAtom(secondVisAtom);
  const [, setName] = useAtom(pageNameAtom);
  const [, setIsSubmitted] = useAtom(isSubmittedAtom);
  const [uuid] = useAtom(uuidAtom);
  const [questionIndexesArray] = useAtom(questionOrderAtom);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [userAnswer, setUserAnswer] = React.useState<
    "yes" | "no" | "unsure" | undefined
  >();
  const [confidence, setConfidence] = React.useState(confidenceOptions[0]);
  const [isSecondPart, setIsSecondPart] = React.useState(false);

  const currentQuestionIndex = questionIndexesArray[questionIndex];
  const isLastQuestion = questionIndex >= questionIndexesArray.length - 1;

  const moveToNextQuestion = () => {
    const nextQuestionIndex = questionIndexesArray[questionIndex + 1];

    setFreetext(QuestionList[nextQuestionIndex].userText);
    setInsight(QuestionList[nextQuestionIndex].insight);
    setInitVis(QuestionList[nextQuestionIndex].initVis);
    setSecondVis(QuestionList[nextQuestionIndex].secondVis);
    setName(QuestionList[nextQuestionIndex].pageName);

    setUserAnswer(undefined);
    setConfidence(confidenceOptions[0]);
    setIsSubmitted(false);
    setIsSecondPart(false);
    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  // -- Original "Next" logic that also SUBMITS data
  const onSubmit = async () => {
    const data = {
      uuid,
      timestamp: new Date().toLocaleString(),
      currentIndex: currentQuestionIndex,
      questionOrder: questionIndexesArray.toString(),
      freeText,
      currentVis: initVis,
      isSecondPart: isSecondPart ? "Yes" : "No",
      userAnswer,
      confidence,
    };

    try {
      console.log("Submitting form:", JSON.stringify(data));
      await fetch(test_weburl!, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    if (isSecondPart) {
      if (isLastQuestion) {
        setModalVisible(true);
      } else {
        moveToNextQuestion();
      }
    } else {
      setSecondVis(QuestionList[currentQuestionIndex].secondVis);
      setUserAnswer(undefined);
      setConfidence(confidenceOptions[0]);
      setIsSecondPart(true);
      setIsSubmitted(true);
    }
  };

  const onStepperNext = () => {
    if (isSecondPart) {
      if (isLastQuestion) {
        setModalVisible(true);
      } else {
        moveToNextQuestion();
      }
    } else {
      setSecondVis(QuestionList[currentQuestionIndex].secondVis);
      setUserAnswer(undefined);
      setConfidence(confidenceOptions[0]);
      setIsSecondPart(true);
      setIsSubmitted(true);
    }
  };

  return (
    <>
      <Paper style={{ padding: "15px 20px", marginTop: "10px" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
          Q{questionIndex + 1} - Please Respond Here
        </Typography>
        <span>
          <b>Part 1:</b>{" "}
          {isSecondPart
            ? "Given the new visualization, is the above interpretation accurate?"
            : "Is the above interpretation accurate?"}
        </span>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "16px",
            }}
          >
            <Radio
              checked={userAnswer === "yes"}
              onChange={() => setUserAnswer("yes")}
            />
            <span>
              <b>Correct</b>: the visualization clearly supports this statement.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "16px",
            }}
          >
            <Radio
              checked={userAnswer === "no"}
              onChange={() => setUserAnswer("no")}
            />
            <span>
              <b>Incorrect</b>: the visualization contradicts this statement.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Radio
              checked={userAnswer === "unsure"}
              onChange={() => setUserAnswer("unsure")}
            />
            <span>
              <b>Irrelevant</b>: the visualization does not provide enough
              information to confirm or refute this statement.
            </span>
          </div>
        </RadioGroup>

        <div style={{ display: "flex" }}>
          <span style={{ margin: "auto 0" }}>
            <b>Part 2:</b>{" "}
            {isSecondPart
              ? "Given the new visualization, please rate your confidence"
              : "Please rate your confidence"}{" "}
          </span>
          <Selection
            label=""
            value={confidence}
            handleChange={setConfidence}
            options={confidenceOptions}
          />
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            disabled={
              userAnswer === undefined || confidence === confidenceOptions[0]
            }
            onClick={onSubmit}
          >
            {isSecondPart ? (isLastQuestion ? "Submit" : "Next") : "Next"}
          </Button>

          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={onStepperNext}
            disabled={isLastQuestion && isSecondPart}
          >
            Stepper Next
          </Button>

          {/* Progress Stepper to the right */}
          <Box sx={{ flex: 1, ml: 2 }}>
            <Stepper activeStep={questionIndex} alternativeLabel>
              {questionIndexesArray.map((_, index) => (
                <Step key={index}>
                  <StepLabel>Q{index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </div>
      </Paper>

      {/* Thank You Modal */}
      <Modal open={modalVisible} onClose={() => {}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
            Thank you for your participation!
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
