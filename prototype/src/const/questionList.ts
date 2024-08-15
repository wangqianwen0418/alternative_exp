import { TCase } from ".";
type TQuestion = TCase & {
    testCondition: 'no vis' | 'random vis' | 'ours';
}

export const QuestionList: TQuestion[] = [
  {
    name: "q1",
    href: "/questions",
    userText:
      "BMI is the more important than age for predicting diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "contribution",
        },
        {
          featureName: "age",
          transform: "average",
          type: "contribution",
        },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
    testCondition: 'no vis'
  },
  {
    name: "q2",
    href: "/questions",
    userText:
      "bmi always contributes positively for predicting diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "contribution",
          transform: undefined,
        },
        0,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
    testCondition: 'random vis'
  },
  {
    name: "q3",
    href: "/questions",
    userText:
      "the larger the age, the more likely to have greater diabetes progression.",
    initVis: "bee swarm",
    insight: {
      variables: [
        { featureName: "age", type: "value", transform: undefined },
        {
          featureName: "age",
          type: "contribution",
          transform: undefined,
        },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
    testCondition: 'ours'
  }
];