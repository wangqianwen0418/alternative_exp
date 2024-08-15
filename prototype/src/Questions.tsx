import { QuestionList } from "./util/questionList";
import { useEffect, useState } from "react";
import App from "./App";
import React from "react";
import { useAtom } from "jotai";
import { questionIndexAtom } from "./store";

export default function Questions() {
  const [questionIndex, setQuestionIndex] = useAtom(questionIndexAtom);

  useEffect(() => {
    setQuestionIndex(0);
  }); // set the question index to 0 when the component is mounted
  return <App {...QuestionList[questionIndex]} />;
}
