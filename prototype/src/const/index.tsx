import React from "react";

export const CASES: TCase[] = [
  {
    name: "Case 1",
    href: "/case1",
    userText:
      "BMI is the more important than age for predicting diabetes progression.",
    initVis: "beeswarm",
    insight: {
      variables: [
        {
          featureName: "bmi",
          transform: "average",
          type: "feature attribution",
        },
        {
          featureName: "age",
          transform: "average",
          type: "feature attribution",
        },
      ],
      type: "comparison",
      relation: "greater",
      condition: undefined,
    },
  },
  {
    name: "Case 2",
    href: "/case2",
    userText:
      "bmi always contributes positively for predicting diabetes progression.",
    initVis: "bar",
    insight: {
      variables: [
        {
          featureName: "bmi",
          type: "feature attribution",
          transform: undefined,
        },
        0,
      ],
      type: "read",
      relation: "greater than",
      condition: undefined,
    },
  },
  {
    name: "Case 3",
    href: "/case3",
    userText:
      "the larger the age, the more likely to have greater diabetes progression.",
    initVis: "bee swarm",
    insight: {
      variables: [
        { featureName: "age", type: "feature value", transform: undefined },
        {
          featureName: "age",
          type: "feature attribution",
          transform: undefined,
        },
      ],
      type: "correlation",
      relation: "positively",
      condition: undefined,
    },
  },
  {
    name: "Free Exploration",
    href: "/free",
    userText: "",
    initVis: "random",
  },
];

export const GenerateTextTemplates = (insight: TInsight) => {
  if (!insight) return "";

  if (insight?.type === "read") {
    const [var1, var2] = insight.variables;
    return (
      <span>
        {" "}
        The <span className="label transform">{var1.transform}</span> value of{" "}
        <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> than{" "}
        <span className="label constant">{var2}</span>.{" "}
      </span>
    );
  } else if (insight?.type === "comparison") {
    const [var1, var2] = insight.variables;
    return (
      <span>
        {" "}
        The <span className="label transform">{var1.transform}</span> value of{" "}
        <span className="label featureName">{var1.featureName}</span> is{" "}
        <span className="label relation">{insight.relation}</span> the{" "}
        <span className="label transform">{var2.transform}</span> value of{" "}
        <span className="label featureName">{var2.featureName}</span>.{" "}
      </span>
    );
  } else if (insight?.type === "correlation") {
    const [var1, var2] = insight.variables;
    return `As the ${var1.featureName} increases, it will ${
      insight.relation == "positively" ? "more" : "less"
    } to the prediction.`;
  } else if (insight?.type === "fetureaInteraction") {
    const [var1, var2] = insight.variables;
    return `The ${var1.featureName} is ${insight.relation} with ${var2}.`;
  }
};

export type TCase = {
  name: string;
  href: string;
  userText: string;
  initVis: "beeswarm" | "bar" | "scatter" | string;
  insight?: TInsight;
};

export type TInsight =
  | TInsight1
  | TInsight2
  | TInsight3
  | TInsight4
  | undefined;

export type TInsight1 = {
  variables: [TVariable, number];
  type: "read";
  relation: "greater than" | "less than" | "equal to";
  condition: { featureName: string; range: [number, number] } | undefined;
};

export type TInsight2 = {
  variables: [TVariable, TVariable];
  type: "comparison";
  relation: "greater" | "less" | "equal";
  condition: { featureName: string; range: [number, number] } | undefined;
};

export type TInsight3 = {
  variables: [TVariable, TVariable];
  type: "correlation";
  relation: "positively" | "negatively";
  condition: { featureName: string; range: [number, number] } | undefined;
};

export type TInsight4 = {
  variables: [TVariable, TVariable];
  type: "fetureaInteraction";
  relation: "same" | "different";
  condition: { featureName: string; range: [number, number][] } | undefined;
};

export type TVariable = {
  featureName: string;
  transform: "average" | undefined;
  type: "feature value" | "feature attribution";
};
