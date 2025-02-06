import React, { useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  RadioGroup,
  Radio,
  Modal,
  Box,
  Step,
  StepLabel,
  Stepper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
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
  tutorialAtom,
} from "../store";
import { test_weburl } from "../util/appscript_url";
import Cookies from "js-cookie";

const confidenceOptions = [
  { value: "", label: "Please select" },
  { value: "1", label: "1 - Not confident at all" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6 - Very confident" },
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
  const [, setShowTutorial] = useAtom(tutorialAtom);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [userAnswer, setUserAnswer] = React.useState<
    "yes" | "no" | "unsure" | undefined
  >();
  const [confidence, setConfidence] = React.useState<{
    value: string;
    label: string;
  }>({
    value: "",
    label: "Please select",
  });
  const [isSecondPart, setIsSecondPart] = React.useState(false);

  useEffect(() => {
    const savedIsSecondPart = Cookies.get("isSecondPart");
    if (savedIsSecondPart !== undefined) {
      setIsSecondPart(savedIsSecondPart === "true");
      setIsSubmitted(savedIsSecondPart === "true");
    }
  }, [setIsSecondPart]);

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

    setQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      Cookies.set("questionIndex", String(newIndex));
      Cookies.set("isSecondPart", "false");
      return newIndex;
    });
  };

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
      confidence: confidence.value,
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
      Cookies.set("isSecondPart", "true");
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
      Cookies.set("isSecondPart", "true");
    }
  };

  return (
    <>
      <Paper style={{ padding: "15px 20px", marginTop: "10px" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
          Q{questionIndex + 1}
          {!isSecondPart ? "a" : "b"} - Please Respond Here
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ marginTop: "20px" }}>
            <b>Part 2:</b>{" "}
            {isSecondPart
              ? "Given the new visualization, please rate your confidence"
              : "Please rate your confidence"}{" "}
          </span>
          <FormControl sx={{ mt: 2, maxWidth: 250 }}>
            <InputLabel id="user-study-confidence-label">
              Please select
            </InputLabel>
            <Select
              labelId="user-study-confidence-label"
              id="user-study-confidence"
              value={confidence.value}
              onChange={(event) => {
                const selectedOption = confidenceOptions.find(
                  (option) => option.value === event.target.value
                );
                if (selectedOption) {
                  setConfidence(selectedOption);
                }
              }}
              label="Please select"
              autoWidth
            >
              {confidenceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            disabled={userAnswer === undefined || confidence.value === ""}
            onClick={onSubmit}
          >
            {isSecondPart ? (isLastQuestion ? "Submit" : "Next") : "Next"}
          </Button>
          {/* REMOVE BEFORE USER STUDY */}
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={onStepperNext}
            disabled={isLastQuestion && isSecondPart}
          >
            Stepper Next
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => {
              Cookies.remove("questionIndex");
              Cookies.remove("isSecondPart");
              setQuestionIndex(0); // Reset to first question
              setIsSecondPart(false); // Reset to Part A
              setIsSubmitted(false);
            }}
          >
            Reset User Study
          </Button>

          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => setShowTutorial(true)}
          >
            Show Tutorial
          </Button>
        </div>
      </Paper>
      <Paper style={{ padding: "15px 20px", marginTop: "10px" }}>
        <Box
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Stepper
            activeStep={questionIndex}
            alternativeLabel
            style={{
              transform: "scale(0.9)",
              transformOrigin: "center",
            }}
          >
            {questionIndexesArray.map((_, index) => (
              <Step key={index}>
                <StepLabel>Q{index + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
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
