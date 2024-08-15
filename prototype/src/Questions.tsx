import { QuestionList } from "./util/questionList";
import { useState } from "react";
import App from "./App";
import React from "react";

export default function Questions() {
  const [questionIndex, setQuestionIndex] = useState(0);
  return (
    <App {...QuestionList[questionIndex]} setQuestionIndex={setQuestionIndex} />
  );
}
