import React from "react";
import {
  Button,
  Typography,
  Paper,
  RadioGroup,
  Radio,
  Modal,
  Box,
} from "@mui/material";
import { QuestionList } from "../util/questionList";
import { useAtom } from "jotai";
import {
  questionIndexAtom,
  insightAtom,
  freeTextAtom,
  initVisAtom,
  pageNameAtom,
  isSubmittedAtom,
} from "../store";
import Selection from "./webUtil/Selection";
import { weburl } from "../util/appscript_url";
import { generateQuestionOrder } from "../util/RNDM-questionBalance";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

let uuid = Cookies.get("uuid");

if (!uuid) {
  uuid = uuidv4();
  Cookies.set("uuid", uuid);
}

const confidenceOptions = [
  "please select",
  "1 not confidence at all",
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
  const [, setInitVis] = useAtom(initVisAtom);
  const [, setName] = useAtom(pageNameAtom);
  const [, setIsSubmitted] = useAtom(isSubmittedAtom);

  const [modelVisible, setModalVisible] = React.useState<boolean>(false); // the thank you modal when finish all questions

  const [userAnswer, setUserAnswer] = React.useState<
    "yes" | "no" | undefined
  >();
  const [confidence, setConfidence] = React.useState<string>(
    confidenceOptions[0]
  );

  // question order to be passed into sheet
  const questionIndexesArray = generateQuestionOrder(uuid!);

  // Current question to be displayed, from the shuffled question order
  const currentQuestionIndex = questionIndexesArray[questionIndex];

  const onSubmit = async () => {
    // recording(userAnswer, confidence) commit the results to the database
    const data = {
      uuid: uuid,
      timestamp: new Date().toLocaleString(),
      currentIndex: currentQuestionIndex,
      questionOrder: questionIndexesArray.toString(),
      freeText,
      userAnswer,
      confidence,
    };
    try {
      console.log("Submitting form:", JSON.stringify(data));
      await fetch(weburl!, {
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

    if (questionIndex === QuestionList.length - 1) {
      setModalVisible(true);
      return;
    }

    setUserAnswer(undefined);
    setConfidence(confidenceOptions[0]);
    setIsSubmitted(false);

    // Move to the next question in the questionIndexesArray
    const nextQuestionIndex = questionIndexesArray[questionIndex + 1];
    setFreetext(QuestionList[nextQuestionIndex].userText);
    setInsight(QuestionList[nextQuestionIndex].insight);
    setInitVis(QuestionList[nextQuestionIndex].initVis);
    setName(QuestionList[nextQuestionIndex].pageName);

    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <>
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
            checked={userAnswer === "yes"}
            onChange={() => setUserAnswer("yes")}
          />{" "}
          <span style={{ margin: "auto 0" }}>Yes, accurate</span>
          <Radio
            checked={userAnswer === "no"}
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
          disabled={
            userAnswer === undefined || confidence === confidenceOptions[0]
          }
          onClick={() => onSubmit()}
        >
          {questionIndex < QuestionList.length - 1 ? "Next" : "Submit"}
        </Button>
      </Paper>
      {/* Thank You Model */}
      <Modal open={modelVisible} onClose={() => {}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400",
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
