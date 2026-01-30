import { useEffect } from "react";
import { useAtom } from "jotai";
import Cookies from "js-cookie";

import { QuestionList } from "research/questions/questionList";

import App from "./App";
import { questionIndexAtom, questionOrderAtom } from "./store/atoms";

export default function Questions() {
  const [questionIndexesArray] = useAtom(questionOrderAtom);
  const [questionIndex, setQuestionIndex] = useAtom(questionIndexAtom);

  const savedQuestionIndex = Cookies.get("questionIndex");

  useEffect(() => {
    if (savedQuestionIndex !== undefined) {
      setQuestionIndex(parseInt(savedQuestionIndex));
    } else {
      setQuestionIndex(0);
    }
  }, [setQuestionIndex]);

  return (
    <App
      {...QuestionList[questionIndexesArray[questionIndex]]}
      questionIndex={questionIndex}
    />
  );
}
