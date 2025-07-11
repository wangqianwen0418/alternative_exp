import React, { useEffect, useState } from "react";
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
  TextField,
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
  selectedIndicesAtom,
  isUserStudyAtom,
  secondGraphTypeAtom,
} from "../store";
import { test_weburl } from "../util/appscript_url";
import Cookies from "js-cookie";
import { TGraph } from "../util/types";
import { useLogging } from "../util/logging";

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
  const [firstVisFeedback, setFirstVisFeedback] = useState("");
  const [secondVisFeedback, setSecondVisFeedback] = useState("");
  const [difficultQuestions, setDifficultQuestions] = useState("");
  const [difficultGraphs, setDifficultGraphs] = useState("");
  const [, setSelectedIndices] = useAtom(selectedIndicesAtom);
  const [isUserStudy] = useAtom(isUserStudyAtom);
  const [secondGraphType, setSecondGraphType] = useAtom(secondGraphTypeAtom);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [userAnswer, setUserAnswer] = React.useState<
    "TRUE" | "FALSE" | undefined
  >();
  const [userExplanation, setUserExplanation] = React.useState<string>("");
  const [confidence, setConfidence] = React.useState<{
    value: string;
    label: string;
  }>({
    value: "",
    label: "Please select",
  });
  const [isSecondPart, setIsSecondPart] = React.useState(false);

  const log = useLogging();

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
    setSelectedIndices([]);

    setUserAnswer(undefined);
    setConfidence(confidenceOptions[0]);
    setUserExplanation("");
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
      q_index: currentQuestionIndex,
      q_order: questionIndexesArray.toString(),
      free_text: freeText,
      first_vis: (initVis as TGraph).graphType,
      second_graph_type: secondGraphType,
      is_second_part: isSecondPart ? "TRUE" : "FALSE",
      user_answer: userAnswer,
      confidence: confidence.value,
      explanation: userExplanation,
      ground_truth: QuestionList[currentQuestionIndex].groundTruth,
    };

    try {
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

    if (isSecondPart && isUserStudy) {
      log(
        "Question Part B Finished",
        "Index: " + currentQuestionIndex,
        secondGraphType
      );
      if (isLastQuestion) {
        setModalVisible(true);
      } else {
        setTimeout(() => {
          log(
            "Question Started",
            "Index: " + questionIndexesArray[questionIndex + 1]
          );
        }, 500);
        moveToNextQuestion();
      }
    } else {
      log("Question Part A Finished", "Index: " + currentQuestionIndex);
      setSecondVis(QuestionList[currentQuestionIndex].secondVis);
      setUserAnswer(undefined);
      setConfidence(confidenceOptions[0]);
      setIsSecondPart(true);
      setIsSubmitted(true);
      setUserExplanation("");
      setSelectedIndices([]);
      Cookies.set("isSecondPart", "true");
    }
  };

  const handleFinalSubmit = async () => {
    const feedbackData = {
      uuid,
      timestamp: new Date().toLocaleString(),
      first_vis_feedback: firstVisFeedback,
      second_vis_feedback: secondVisFeedback,
      difficult_questions: difficultQuestions,
      difficult_graphs: difficultGraphs,
    };

    try {
      await fetch(test_weburl!, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }

    // Optionally, you can reset the feedback fields or close the modal
    setModalVisible(false);
  };

  const onStepperNext = () => {
    if (isSecondPart && isUserStudy) {
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
      setSelectedIndices([]);
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
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Radio
              checked={userAnswer === "TRUE"}
              onChange={() => setUserAnswer("TRUE")}
            />
            <span>
              <b>Correct</b>: the visualization clearly supports this statement.
            </span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Radio
              checked={userAnswer === "FALSE"}
              onChange={() => setUserAnswer("FALSE")}
            />
            <span>
              <b>Incorrect</b>: the visualization contradicts this statement.
            </span>
          </label>
        </RadioGroup>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
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

        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 10 }}
        >
          <span>
            <b>Part 3:</b>{" "}
            {isSecondPart
              ? "Given the new visualization, please briefly explain your answer (<150 characters)."
              : "Please briefly explain your answer (<150 characters)."}{" "}
          </span>
          <TextField
            placeholder="Explain here"
            multiline
            variant="outlined"
            fullWidth
            margin="normal"
            value={userExplanation}
            onChange={(e) => setUserExplanation(e.target.value)}
          />
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            disabled={
              userAnswer === undefined ||
              confidence.value === "" ||
              userExplanation === ""
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
            onClick={() => {
              Cookies.remove("questionIndex");
              Cookies.remove("isSecondPart");
              Cookies.remove("uuid");
              setQuestionIndex(0); // Reset to first question
              setIsSecondPart(false); // Reset to Part A
              setIsSubmitted(false);
            }}
          >
            Reset UUID
          </Button>

          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => {
              setShowTutorial(true);
              log("Tutorial", "User opened the tutorial.");
            }}
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

      {/* Thank You and Feedback Modal */}
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
            Thank you for your participation! Your prolific code is CLJIR87G.
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            We would appreciate your feedback:
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            How frequently was the first visualization sufficient to determine
            your answer?
          </Typography>
          <TextField
            label="First Visualization"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstVisFeedback}
            onChange={(e) => setFirstVisFeedback(e.target.value)}
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            How frequently was the second (additional) visualization helpful in
            increasing your confidence in your answer?
          </Typography>
          <TextField
            label="Second Visualization"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            margin="normal"
            value={secondVisFeedback}
            onChange={(e) => setSecondVisFeedback(e.target.value)}
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Were there particular questions that were especially tricky or
            difficult? If so, which ones?
          </Typography>

          <TextField
            label="Questions"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            margin="normal"
            value={difficultQuestions}
            onChange={(e) => setDifficultQuestions(e.target.value)}
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Were there particular types of graphs that were not helpful or
            difficult to use? If so, which ones?
          </Typography>

          <TextField
            label="Graphs"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            margin="normal"
            value={difficultGraphs}
            onChange={(e) => setDifficultGraphs(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleFinalSubmit}
            sx={{ mt: 2 }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Modal>
    </>
  );
}
