import { TQuestion } from "./types";
import { QuestionList } from "../util/questionList";

const generateLatinSquare = <T>(items: T[]): T[][] => {
  const permutations = items.map((_, i) =>
    items.slice(i).concat(items.slice(0, i))
  );
  return permutations;
};

const createCounterbalancedOrder = (
  QuestionList: TQuestion[],
  latinSquare: string[][]
): TQuestion[][] => {
  return latinSquare.map((categoryOrder) => {
    const order: TQuestion[] = [];

    categoryOrder.forEach((category) => {
      const catQuestions = QuestionList.filter(
        (q) => q.testCondition === category
      );

      const trueQuestions = catQuestions.filter((q) => q.groundTruth === true);
      const falseQuestions = catQuestions.filter(
        (q) => q.groundTruth === false
      );

      if (trueQuestions.length > 0)
        order.push(
          trueQuestions[Math.floor(Math.random() * trueQuestions.length)]
        );
      if (falseQuestions.length > 0)
        order.push(
          falseQuestions[Math.floor(Math.random() * falseQuestions.length)]
        );
    });

    return order;
  });
};

export const generateQuestionOrder = (): TQuestion[][] => {
  const categories = ["no vis", "random vis", "ours"];
  const latinSquare = generateLatinSquare(categories);
  const orders = createCounterbalancedOrder(QuestionList, latinSquare);
  return orders;
};
