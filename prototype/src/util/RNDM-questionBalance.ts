import { TQuestion } from "./types";
import { QuestionList } from "./questionList";

const seededShuffle = <T>(array: T[], seed: string): T[] => {
  const shuffled = array.slice(); // Copy array to avoid modifying the original
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
  const categories = ["random vis", "ours", "no vis"];

  const questionsByCondition: Record<string, TQuestion[]> = {
    "no vis": questionList.filter((q) => q.testCondition === "no vis"),
    "random vis": questionList.filter((q) => q.testCondition === "random vis"),
    ours: questionList.filter((q) => q.testCondition === "ours"),
  };

  const shuffledQuestionsByCondition: Record<string, TQuestion[]> = {
    "no vis": seededShuffle(questionsByCondition["no vis"], uuid),
    "random vis": seededShuffle(questionsByCondition["random vis"], uuid),
    ours: seededShuffle(questionsByCondition["ours"], uuid),
  };

  const questionOrder: TQuestion[] = [];
  const questionIndexes: number[] = [];
  let conditionIndex = 0;

  while (
    shuffledQuestionsByCondition["no vis"].length > 0 ||
    shuffledQuestionsByCondition["random vis"].length > 0 ||
    shuffledQuestionsByCondition["ours"].length > 0
  ) {
    const currentCondition = categories[conditionIndex % categories.length];
    if (shuffledQuestionsByCondition[currentCondition].length > 0) {
      const nextQuestion = shuffledQuestionsByCondition[
        currentCondition
      ].shift() as TQuestion;
      questionOrder.push(nextQuestion);
      questionIndexes.push(nextQuestion.index);
    }
    conditionIndex++;
  }

  // questionOrder is for debugging
  return questionIndexes;
};

export const generateQuestionOrder = (uuid: string): number[] => {
  return createCounterbalancedOrder(QuestionList, uuid);
};
