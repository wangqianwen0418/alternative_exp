import { TQuestion } from "./types";
import { QuestionList } from "./questionList";

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateRandomLatinSquare = <T>(items: T[]): T[][] => {
  const n = items.length;
  const latinSquare: T[][] = [];

  const startingPermutation = shuffleArray(items);

  for (let i = 0; i < n; i++) {
    const row: T[] = [];
    for (let j = 0; j < n; j++) {
      const index = (i + j) % n;
      row.push(startingPermutation[index]);
    }
    latinSquare.push(row);
  }

  return latinSquare;
};

const createCounterbalancedOrder = (
  questionList: TQuestion[],
  numUsers: number
): TQuestion[][] => {
  const categories = ["no vis", "random vis", "ours"];

  const questionsByCondition: Record<string, TQuestion[]> = {
    "no vis": questionList.filter((q) => q.testCondition === "no vis"),
    "random vis": questionList.filter((q) => q.testCondition === "random vis"),
    ours: questionList.filter((q) => q.testCondition === "ours"),
  };

  const latinSquares: Record<string, TQuestion[][]> = {};

  categories.forEach((category) => {
    const questions = questionsByCondition[category];
    const latinSquare = generateRandomLatinSquare(questions);
    latinSquares[category] = latinSquare;
  });

  const userOrders: TQuestion[][] = [];

  for (let userIdx = 0; userIdx < numUsers; userIdx++) {
    const userOrder: TQuestion[] = [];

    categories.forEach((category) => {
      const latinSquareForCategory = latinSquares[category];
      const questionRow =
        latinSquareForCategory[userIdx % latinSquareForCategory.length];
      userOrder.push(...questionRow);
    });

    userOrders.push(userOrder);
  }

  return userOrders;
};

export const generateQuestionOrder = (): TQuestion[][] => {
  const numUsers = 5;
  return createCounterbalancedOrder(QuestionList, numUsers);
};
