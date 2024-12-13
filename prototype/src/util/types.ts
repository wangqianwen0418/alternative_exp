type TPageBase = {
  userText: string;
  initVis: "beeswarm" | "bar" | "scatter" | string;
  secondVis: "beeswarm" | "bar" | "scatter" | string | undefined;
  insight: TInsight;
};

export type TCase = TPageBase & {
  pageName: string; // show on the drawer
  href: string;
};

export type TQuestion = TPageBase & {
  pageName: "question";
  testCondition: "random vis" | "ours";
  index: number;
  groundTruth: boolean;
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
  relation: "greater than" | "less than" | "equal to";
  condition: { featureName: string; range: [number, number] } | undefined;
};

export type TInsight3 = {
  variables: [TVariable, TVariable];
  type: "correlation";
  relation: "positively" | "negatively" | "no correlation";
  condition: { featureName: string; range: [number, number] } | undefined;
};

export type TInsight4 = {
  variables: [TVariable, TVariable];
  type: "featureInteraction";
  relation: "same" | "different";
  condition: { featureName: string; range: [number, number][] } | undefined;
};

export type TVariable = {
  featureName: string;
  transform: "average" | "deviation" | undefined;
  type: "value of" | "contribution of" | "number of instances";
};

export type TAnnotation =
  | { type: "highlightPoints"; xValues: number[]; label?: string }
  | {
      type: "highlightRange";
      xValueRange?: [number, number];
      yValueRange?: [number, number];
      label?: string;
    }
  | { type: "singleLine"; xValue?: number; yValue?: number; label?: string };
