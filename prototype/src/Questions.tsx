import { QuestionList } from "./util/questionList";
import App from "./App";
import { useAtom } from "jotai";
import { questionIndexAtom, questionOrderAtom } from "./store";
import Cookies from "js-cookie";
import { useEffect } from "react";

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
      {...QuestionList[questionIndexesArray[0]]}
      questionIndex={questionIndex}
    />
  );
}
