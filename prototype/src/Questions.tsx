import { QuestionList } from "./util/questionList";
import App from "./App";
import { useAtom } from "jotai";
import { questionOrderAtom } from "./store";

export default function Questions() {
  const [questionIndexesArray] = useAtom(questionOrderAtom);

  // useEffect(() => {
  //     setQuestionIndex(0);
  //     console.info("questionIndex reset", questionIndex);
  // }); // set the question index to 0 when the component is mounted
  return <App {...QuestionList[questionIndexesArray[0]]} questionIndex={0} />;
}
