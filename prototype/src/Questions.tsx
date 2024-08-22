import { QuestionList } from "./util/questionList";
import App from "./App";
import React from "react";
import { useAtom } from "jotai";
import { questionIndexAtom } from "./store";

export default function Questions() {
    const [questionIndex] = useAtom(questionIndexAtom);

    // useEffect(() => {
    //     setQuestionIndex(0);
    //     console.info("questionIndex reset", questionIndex);
    // }); // set the question index to 0 when the component is mounted
    return <App {...QuestionList[questionIndex]} questionIndex={0} />;
}
