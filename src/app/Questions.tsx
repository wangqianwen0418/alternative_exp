import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { getCookieNumber } from 'lib/utility/cookies';

import { QuestionList } from 'research/questions/questionList';
import { useUUID } from 'lib/utility/useUUID';

import App from './App';
import { questionIndexAtom, questionOrderAtom } from './atoms';

export default function Questions() {
  // Ensure UUID exists before we derive question ordering.
  const uuid = useUUID();
  const [questionIndexesArray] = useAtom(questionOrderAtom);
  const [questionIndex, setQuestionIndex] = useAtom(questionIndexAtom);

  useEffect(() => {
    const saved = getCookieNumber('questionIndex');
    setQuestionIndex(saved ?? 0);
  }, [setQuestionIndex]);

  if (!uuid || questionIndexesArray.length === 0) {
    return null;
  }

  return (
    <App
      {...QuestionList[questionIndexesArray[questionIndex]]}
      questionIndex={questionIndex}
    />
  );
}
