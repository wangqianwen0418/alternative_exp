import { TQuestion } from "./types";
import { QuestionList } from "./questionList";

const seededShuffle = <T>(array: T[], seed: string): T[] => {
  const shuffled = array.slice();
  let currentIndex = shuffled.length;
  let randomIndex;

  let seedNum = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  while (currentIndex !== 0) {
    randomIndex = Math.floor(
      Math.abs(Math.sin(seedNum++) * 10000) % currentIndex
    );
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
};

const createCounterbalancedOrder = (
  questionList: TQuestion[],
  uuid: string
): number[] => {
  const questionIndices = questionList.map((q) => q.index);
  const shuffledIndices = seededShuffle(questionIndices, uuid);
  return shuffledIndices;
};

export const generateQuestionOrder = (uuid: string): number[] => {
  return createCounterbalancedOrder(QuestionList, uuid);
};
