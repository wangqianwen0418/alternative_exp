import React from "react";
import { Button, Typography, Paper, RadioGroup, Radio, Modal, Box } from "@mui/material";
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
    const [, setFreetext] = useAtom(freeTextAtom);
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

    const onSubmit = () => {
        // recording(userAnswer, confidence) commit the results to the database
        if (questionIndex == QuestionList.length - 1) {
            setModalVisible(true);
            return;
        }
        setUserAnswer(undefined);
        setConfidence(confidenceOptions[0]);
        setIsSubmitted(false);

        setFreetext(QuestionList[questionIndex + 1].userText);
        setInsight(QuestionList[questionIndex + 1].insight);
        setInitVis(QuestionList[questionIndex + 1].initVis);
        setName(QuestionList[questionIndex + 1].pageName);

        setQuestionIndex((questionIndex) => questionIndex + 1);
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
                    {questionIndex < QuestionList.length - 1 ? "Next" : "Submit"}
                </Button>
            </Paper>
            {/* Thank You Model */}
            <Modal open={modelVisible} onClose={() => { }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: '400',
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